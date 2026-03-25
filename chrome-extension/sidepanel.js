// ── DOM refs ──
const emptyState = document.getElementById("empty-state");
const explanationCard = document.getElementById("explanation-card");
const explanationText = document.getElementById("explanation-text");
const pageTitleLabel = document.getElementById("page-title-label");
const chatDivider = document.getElementById("chat-divider");
const chatMessages = document.getElementById("chat-messages");
const suggestions = document.getElementById("suggestions");
const chatInput = document.getElementById("chat-input");
const sendBtn = document.getElementById("send-btn");
const headerStatus = document.getElementById("header-status");
const mainEl = document.getElementById("main");
const setupHint = document.getElementById("setup-hint");

// ── State ──
let pageContent = "";
let conversationHistory = [];
let lastPrompt = "";

// ── Check if settings are configured on load ──
(async function checkSettings() {
    const settings = await getSettings();
    // Show hint if using defaults (no custom API configured)
    if (!settings.apiUrl && !settings.apiKey) {
        setupHint.style.display = "flex";
    }
})();

// ── API ──
async function callLLM(messages) {

    const settings = await getSettings()

    const baseUrl = settings.apiUrl || "https://api.featherless.ai/v1"
    const model = settings.model || "zai-org/GLM-5"
    const apiKey = settings.apiKey || ""

    const headers = {
        "Content-Type": "application/json"
    }

    // Only add auth if user provided a key (Ollama doesn't need one)
    if (apiKey) {
        headers["Authorization"] = `Bearer ${apiKey}`
    }

    const res = await fetch(`${baseUrl}/chat/completions`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            model,
            messages,
            max_tokens: 600
        }),
    });

    const data = await res.json()

    console.log("[SmolBrain] API response:", data)

    if (!res.ok) {
        const errorMsg = data?.error?.message || `API error ${res.status}`;
        throw new Error(`${errorMsg}\n\nℹ️ Check your API settings by clicking the gear icon ⚙️`);
    }

    return extractContent(data);
}

function extractContent(data) {

    if (!data) return ""

    if (data?.choices?.[0]?.message?.content)
        return data.choices[0].message.content

    if (data?.choices?.[0]?.text)
        return data.choices[0].text

    if (data?.message?.content)
        return data.message.content

    return ""
}

// ── Settings loader ──
async function getSettings() {
    return new Promise(resolve => {
        chrome.storage.sync.get(
            ["apiKey", "apiUrl", "model"],
            resolve
        );
    });
}

// ── Helpers ──
function delay(ms) { return new Promise(r => setTimeout(r, ms)); }
function scrollBottom() { mainEl.scrollTop = mainEl.scrollHeight; }
function skeleton() {
    return `<div class="skeleton-line" style="width:90%"></div>
            <div class="skeleton-line" style="width:75%"></div>
            <div class="skeleton-line"></div>`;
}
async function typeText(el, text, speed = 12) {
    el.innerHTML = "";
    let current = "";
    for (const char of text) {
        current += char;
        el.innerHTML = marked.parse(current);
        scrollBottom();
        await delay(speed);
    }
}
function hide(el) { el.style.display = "none"; }
function show(el) { el.style.display = "flex"; }

// ── Get page content (lazy, cached) ──
async function getPageContent() {
    if (pageContent) return pageContent;
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    pageTitleLabel.textContent = tab.title || "Current page";
    
    try {
        await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ["content.js"] });
        const response = await chrome.tabs.sendMessage(tab.id, { type: "GET_PAGE_CONTENT" });
        pageContent = (response?.content || "").slice(0, 6000);
        if (!pageContent.trim()) throw new Error("Could not extract page content.");
        return pageContent;
    } catch (error) {
        // Handle restricted pages (chrome://, chrome-extension://, Chrome Web Store, etc.)
        if (error.message.includes("Cannot access") || 
            error.message.includes("extensions gallery") ||
            error.message.includes("chrome://") ||
            tab.url?.startsWith("chrome://") ||
            tab.url?.startsWith("chrome-extension://") ||
            tab.url?.includes("chromewebstore.google.com")) {
            throw new Error("This page can't be explained.\n\nChrome system pages and extension pages are protected for security reasons. Try visiting a regular website instead!");
        }
        // Re-throw other errors
        throw error;
    }
}

// ── First message: show explanation card with skeleton ──
async function runExplain(prompt) {
    lastPrompt = prompt;
    hide(emptyState);
    explanationCard.style.display = "flex";
    pageTitleLabel.textContent = "Analyzing page…";
    explanationText.innerHTML = skeleton();
    headerStatus.textContent = "Thinking…";

    const content = await getPageContent();

    conversationHistory = [
        { role: "system", content: `You are a friendly assistant. The user is reading this page:\n\n${content}\n\nAnswer follow-up questions simply and clearly.` },
        { role: "user", content: `${prompt}\n\nPage content:\n${content}` },
    ];
    const reply = await callLLM(conversationHistory);

    conversationHistory.push({ role: "assistant", content: reply });

    await typeText(explanationText, reply);
    show(chatDivider);
    headerStatus.textContent = "Ready to chat";
}

// ── Chat ──
async function sendMessage(text) {
    if (!text.trim()) return;
    chatInput.value = "";
    chatInput.style.height = "auto";
    sendBtn.disabled = true;
    headerStatus.textContent = "Thinking…";

    // First interaction — use explain flow
    if (!conversationHistory.length) {
        try {
            await runExplain(text);
        } catch (err) {
            explanationText.textContent = `Error: ${err.message}`;
            headerStatus.textContent = "Error";
        }
        sendBtn.disabled = false;
        chatInput.focus();
        return;
    }

    // Follow-up chat
    addMessage("user", text);
    conversationHistory.push({ role: "user", content: text });
    const typing = addTypingIndicator();

    try {
        const reply = await callLLM(conversationHistory);
        typing.remove();
        conversationHistory.push({ role: "assistant", content: reply });
        addMessage("ai", reply);
    } catch (err) {
        typing.remove();
        addMessage("ai", `Sorry, something went wrong: ${err.message}`);
    }

    headerStatus.textContent = "Ready to chat";
    sendBtn.disabled = false;
    chatInput.focus();
}

function addMessage(role, text) {
    const div = document.createElement("div");
    div.className = `msg ${role}`;
    const copyBtn = role === "ai"
        ? `<button class="msg-copy-btn icon-btn" title="Copy"><svg viewBox="0 0 24 24"><path d="M16 1H4a2 2 0 0 0-2 2v14h2V3h12V1zm3 4H8a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2zm0 16H8V7h11v14z"/></svg></button>`
        : "";
    div.innerHTML = `
        <div class="msg-avatar">${role === "user" ? "👤" : "🤖"}</div>
        <div class="msg-wrap">
          <div class="msg-bubble">${role === "ai" ? marked.parse(text) : text}</div>
          ${copyBtn}
        </div>`;
    if (role === "ai") {
        div.querySelector(".msg-copy-btn").addEventListener("click", () => copyText(text, div.querySelector(".msg-copy-btn")));
    }
    chatMessages.appendChild(div);
    scrollBottom();
    return div;
}

function addTypingIndicator() {
    const div = document.createElement("div");
    div.className = "msg ai";
    div.id = "typing";
    div.innerHTML = `
        <div class="msg-avatar">🤖</div>
        <div class="msg-bubble">
          <div class="typing-indicator"><span></span><span></span><span></span></div>
        </div>`;
    chatMessages.appendChild(div);
    scrollBottom();
    return div;
}

async function copyText(text, btn) {
    await navigator.clipboard.writeText(text);
    btn.classList.add("copied");
    setTimeout(() => btn.classList.remove("copied"), 1500);
}

// ── Events ──
sendBtn.addEventListener("click", () => sendMessage(chatInput.value));

chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(chatInput.value); }
});

chatInput.addEventListener("input", () => {
    sendBtn.disabled = !chatInput.value.trim();
    chatInput.style.height = "auto";
    chatInput.style.height = chatInput.scrollHeight + "px";
});

document.querySelectorAll(".chip, .mode-item").forEach(el => {
    el.addEventListener("click", () => sendMessage(el.dataset.q));
});

document.getElementById("copy-btn").addEventListener("click", () =>
    copyText(explanationText.textContent, document.getElementById("copy-btn"))
);

document.getElementById("retry-btn").addEventListener("click", () => {
    explanationText.innerHTML = "";
    hide(chatDivider);
    chatMessages.innerHTML = "";
    conversationHistory = [];
    pageContent = "";
    runExplain(lastPrompt).catch(err => {
        explanationText.textContent = `Error: ${err.message}`;
        headerStatus.textContent = "Error";
    });
});

document.getElementById("new-chat-btn").addEventListener("click", () => {
    explanationCard.style.display = "none";
    explanationText.innerHTML = "";
    hide(chatDivider);
    chatMessages.innerHTML = "";
    conversationHistory = [];
    pageContent = "";
    lastPrompt = "";
    emptyState.style.display = "flex";
    headerStatus.textContent = "Ready";
});

document.getElementById("settings-btn").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
});

document.getElementById("open-settings-link").addEventListener("click", (e) => {
    e.preventDefault();
    chrome.runtime.openOptionsPage();
});
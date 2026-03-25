// Extracts the visible text content from the current page
function getPageContent() {
  return document.body.innerText || "";
}

// Listen for messages from the side panel
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "GET_PAGE_CONTENT") {
    sendResponse({ content: getPageContent() });
  }
  return true;
});
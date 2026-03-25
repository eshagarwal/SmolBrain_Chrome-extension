# SmolBrain  🧠✨
### Internet, but Simpler!

How many of you have opened a webpage and thought — why is this written so complicated?


---

## ⚠️ The Problem

The Internet is unnecessarily complex.

- 📘 Technical documentation  
  API references and developer guides written for experts  

- 📄 Research papers  
  Academic studies packed with jargon and methodology  

- ⚖️ Legal policies  
  Terms and conditions that require a law degree  

- 🏥 Medical information  
  Health articles full of technical terminology  

- 📝 Complex blogs  
  Long-form content that assumes too much background knowledge 

**The problem isn't the idea — it's the language.  
Brilliant concepts get lost in unnecessarily complex writing.**

---

## 🚀 SmolBrain — Internet, but Simpler!

One click. Any page. Instantly simpler.

![image](./docs/image2.png)

- Chrome Extension — it lives in your browser  
- Opens a side panel on any webpage  
- Lets users chat with the webpage  
- Multiple explanation modes  


---

## 🧠 Understanding the web your way

### 🔹 Smol Mode
Explain the page in simple terms

### 👨‍🏫 Teacher Mode
Step-by-step explanation

### ⚡ TLDR Mode
Three-bullet summary for quick understanding

### 👶 Baby Mode
Explain like you're five — no jargon, just clarity


---

## 👥 Built for everyone

- 🎓 Students  
  Reading research papers and academic materials  

- 💻 Developers  
  Navigating complex technical documentation  

- 👔 Professionals  
  Understanding legal policies and contracts  

- 🩺 Patients  
  Reading medical information and health resources  

- 🌍 Everyone  
  Non-native English speakers learning online  


---

## 🤖 Built with AI

## Structure
### Chrome extension in [chrome_extension](./chrome-extension/)

It uses the side panel api from chrome to show the initial explanation and then you can chat with the webpage directly too!

### Technology Stack

- **Browser APIs**: Chrome Extension Manifest V3
  - Side Panel API
  - Tabs API
  - Scripting API
  - Storage API (for settings)
- **Frontend**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Coding platform**: AWS Kiro
- **AI Integration**: 
    - Direct API integration with OpenAI-compatible providers

---

## 🚀 Installation

### From Source

1. **Clone the repository**

   ```bash
   git clone https://github.com/c2p-cmd/eli5-extension.git
   cd eli5-extension
   ```

2. **Load the extension in Chrome**
   - Open Chrome and go to `chrome://extensions`
   - Enable "Developer mode" (toggle in top-right)
   - Click "Load unpacked"
   - Select the `chrome-extension` folder

3. **Configure your AI provider**
   - Right-click the extension icon → **Options**
   - Choose a provider preset or enter custom settings
   - Add your API key
   - Click "Test Connection" to verify
   - Click "Save Settings"

4. **Start using!**
   - Visit any webpage
   - Click the SmolBrain extension icon
   - Choose an explanation mode or type your question

---

## ⚙️ Configuration

### Quick Setup with Presets

The settings page includes presets for popular providers:

| Provider | API URL | Notes |
|----------|---------|-------|
| **Featherless AI** | `https://api.featherless.ai/v1` | Default, affordable |
| **OpenAI** | `https://api.openai.com/v1` | GPT-4, GPT-3.5-turbo |
| **Ollama** | `http://localhost:11434/v1` | Local models, no API key needed |
| **OpenRouter** | `https://openrouter.ai/api/v1` | Access to multiple models |

### Custom Configuration

For any OpenAI-compatible API:

1. **API URL**: Your provider's base URL
2. **API Key**: Your authentication key (optional for Ollama)
3. **Model Name**: The specific model to use (e.g., `glm-4.7-flash:latest`, `llama2`)

### Access Settings

- **Option 1**: Right-click extension icon → Options
- **Option 2**: Click the gear icon ⚙️ in the side panel header

---

## 🎨 How It Works

1. Click the SmolBrain icon on any webpage
2. Choose an explanation mode or type a custom question
3. The extension extracts visible text from the page
4. Your AI provider generates a simple explanation
5. Ask follow-up questions to dive deeper

---

## 🐛 Troubleshooting

### "This page can't be explained"

- You're on a restricted Chrome page (chrome://, chrome-extension://, or Chrome Web Store)
- **Solution**: Visit a regular website instead

### "API Error" or connection issues

- Check your API settings (click gear icon ⚙️)
- Verify your API key is correct
- Test connection in settings page
- Check your provider's status page

### Extension not loading

- Make sure you loaded the `chrome-extension` folder (not the root folder)
- Check `chrome://extensions` for error messages
- Try reloading the extension

---

## 🙏 Credits

- **Powered by**: Your own AI provider
- **Built with**: [AWS Kiro](https://kiro.dev/)
- **Inspiration**: Making complex content accessible to everyone

---

## 🎬 Demo

![image](./docs/image1.png)
![image](./docs/image2.png)


---

## 🙌 Thank you
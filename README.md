# TLDR.ai – AI-Powered Text Summarizer

Effortlessly condense long articles, blogs, research papers, or documents into concise, easy-to-read summaries. TLDR.ai is a modern, AI-powered text summarization tool built with React, Chakra UI, and OpenRouter API.

![TLDR.ai Screenshot](screenshot.png) <!-- (Add a screenshot if you want) -->

---

## ✨ Features

- **AI Summarization:** Get concise summaries of any text using advanced AI models via the OpenRouter API (DeepSeek-R1-Zero).
- **File Upload:** Supports `.txt`, `.pdf`, and `.docx` files. Extracts and summarizes content from your documents.
- **Character Counter:** Live character count with a 10,000 character limit.
- **Copy & Download:** Copy the summary to clipboard or download as a `.txt` file.
- **Dark/Light Mode:** Toggle between beautiful dark and light themes.
- **Responsive Design:** Works seamlessly on desktop, tablet, and mobile.
- **FAQ & About Pages:** Learn more about the app and get answers to common questions.

---

## 📦 Tech Stack

- **Frontend:** [React](https://react.dev/) (with [Vite](https://vitejs.dev/))
- **UI:** [Chakra UI](https://chakra-ui.com/) & [React Icons](https://react-icons.github.io/react-icons/)
- **Routing:** [react-router-dom](https://reactrouter.com/)
- **PDF/DOCX Parsing:** [pdfjs-dist](https://github.com/mozilla/pdf.js/), [mammoth](https://github.com/mwilliamson/mammoth.js)
- **API:** [OpenRouter API](https://openrouter.ai/) (DeepSeek-R1-Zero model)


---

## 🚀 Getting Started

### 1. **Clone the repository**

```bash
git clone https://github.com/yourusername/text-summarizer.git
cd text-summarizer
```

### 2. **Install dependencies**

```bash
npm install
```

### 3. **Set up environment variables**

Create a `.env` file in the root directory and add your OpenRouter API key:

```
VITE_OPENROUTER_API_KEY=your_openrouter_api_key
```


### 4. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🗂️ Project Structure

```
src/
  App.jsx              # Main app with routing, layout, and all pages
  main.jsx             # Entry point, Chakra UI theme, router setup
  index.css            # Custom styles
  components/
    Logo.jsx           # SVG logo component
    Loader.jsx         # Loader/spinner for async actions
    TextSummarizer.jsx # (Legacy/optional) Summarizer component
```


## 📬 Connect

- [Twitter](https://twitter.com/iamamanchhetri)
- [GitHub](https://github.com/aman-chhetri)
- [LinkedIn](https://linkedin.com/in/amankshetri)

---

## 🧡 License

MIT 
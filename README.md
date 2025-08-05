# 💡 IntelliHint: Your AI-Powered Coding Mentor

_IntelliHint_ is an intelligent learning assistant built for coders, students, and interview preppers. It mimics the experience of a real mentor with AI-powered hint flows, problem pattern recognition, dry-run visualizations, and stepwise code exploration—all without spoiling the answer upfront. Think deep, not just dump code! 💻🚀

---

## ✨ Features

### ✅ Current Features (MVP)
- **🔐 Authentication (JWT)**
  - Register/Login with email-password
  - JWT tokens saved in `localStorage`
  - Google OAuth (coming soon)

- **🧠 Smart Problem Analysis**
  - Paraphrase of problem statement
  - Detects DSA patterns (e.g. Sliding Window, Binary Search, Hash Map)
  - Difficulty estimation (Easy/Medium/Hard)

- **📚 Progressive Guidance**
  - Step-by-step hints revealed one by one
  - Brute → Better → Optimal code walkthroughs
  - Code solutions with:
    - Explanation & intuition
    - Time & space complexity
    - Graphical complexity visualizer (SVGs)

- **💬 Interactive Chat UI**
  - Clean ChatGPT-style problem-solving flow
  - CodeMirror-based code viewer (Java syntax)
  - Toasts for feedback (via `react-hot-toast`)

- **📱 Fully Responsive**
  - Tailwind CSS-powered UI
  - Optimized for all devices

---

## 🛣️ Planned Features (Coming Soon)

- 🔁 Dry Run Visualizer (step-by-step animations)
- 📄 Export to PDF (hint + explanation bundle)
- 📊 Dashboard with problem filters & progress
- 🧠 LangChain-powered hint logic
- 🗣️ Mic-to-Text (Voice Input)
- 📌 Save & filter problems by pattern
- 📡 Offline Mode
- 📈 Problem-solving analytics

---

## 🛠️ Tech Stack

### 🌐 Frontend
- React.js + React Router v6
- Tailwind CSS + Framer Motion
- CodeMirror (Java syntax support)
- Context API + Axios + Toasts

### 🔙 Backend (Node.js + Express)
- REST APIs with Express.js
- MongoDB (via Mongoose)
- JWT-based Auth
- `node-fetch` to interact with Python AI layer

### 🧠 AI Layer (Python + Flask)
- Flask web server
- Google Gemini via `google-generativeai`
- `.env` powered config
- (Future: LangChain, OpenAI GPT-4)

---

## 📁 Folder Structure

intellihint/
│
├── client/ # React Frontend
│ ├── public/
│ └── src/
│ ├── assets/
│ ├── components/
│ ├── context/
│ ├── pages/
│ ├── utils/
│ └── App.jsx
│ └── tailwind.config.js
│
├── server/ # Express Backend
│ ├── controllers/
│ ├── models/
│ ├── routes/
│ ├── middlewares/
│ └── index.js
│
├── ai-service/ # Python AI Service
│ ├── app.py
│ ├── routes/ # (Planned)
│ ├── models/ # (Planned)
│ ├── services/ # (Planned)
│ └── requirements.txt
│
├── .env # Secrets & Keys
├── README.md # This file 💅
└── package.json # Root scripts


---

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js (v18+)
- Python 3.8+
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/intellihint.git
cd intellihint


---

## 🚀 Getting Started

### 📦 Prerequisites
- Node.js (v18+)
- Python 3.8+
- MongoDB (Local or Atlas)
- Google Gemini API Key

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/intellihint.git
cd intellihint

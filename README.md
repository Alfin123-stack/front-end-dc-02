# 🎓 QUIZ (LearnCheck!)

*Formative Assessment Powered with AI*

![Vite](https://img.shields.io/badge/Vite-7.x-purple?logo=vite)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.x-764ABC?logo=redux)
![Vite](https://img.shields.io/badge/Vite-7.x-purple?logo=vite)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![Redux](https://img.shields.io/badge/Redux%20Toolkit-2.x-764ABC?logo=redux)
![React%20Router](https://img.shields.io/badge/React%20Router-7.x-CA4245?logo=reactrouter)
![Redux%20Persist](https://img.shields.io/badge/Redux%20Persist-6.x-764ABC)
![Axios](https://img.shields.io/badge/Axios-1.x-5A29E4?logo=axios)
![Framer%20Motion](https://img.shields.io/badge/Framer%20Motion-12.x-black?logo=framer)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue?logo=tailwindcss)
![ESLint](https://img.shields.io/badge/ESLint-9.x-4B32C3?logo=eslint)

---

## 📖 Overview

**Web Developer Quiz (LearnCheck!)** adalah aplikasi **formative assessment** berbasis web yang dirancang untuk mendukung use case **DC-02 – LearnCheck! Formative Assessment Powered with AI**.

Project ini bertujuan membantu siswa memahami materi pembelajaran secara bertahap melalui **kuis adaptif**, umpan balik instan, dan pengalaman belajar yang interaktif — bukan sekadar membaca materi atau submit tugas tanpa refleksi.

Aplikasi ini dikembangkan menggunakan **React 19 + Vite**, dengan arsitektur modern yang siap diintegrasikan dengan **LLM (AI)** untuk menghasilkan soal dan feedback secara otomatis.

🌐 **Live Demo:**
[https://front-end-dc-02-j6lx.vercel.app/](https://front-end-dc-02-j6lx.vercel.app/)

---

## 🎯 Tujuan Proyek

* Menyediakan **formative assessment adaptif** untuk setiap submodul pembelajaran
* Membantu siswa mendeteksi kesulitan belajar lebih awal
* Memberikan **feedback langsung** atas jawaban siswa
* Mengurangi beban pembuatan soal manual dengan dukungan AI
* Menjadi bagian dari ekosistem **Dicoding Classroom (mock LMS)**

---

## ✨ Fitur Utama

* 🧠 **Kuis Interaktif** berbasis materi pembelajaran
* ⚡ **Umpan Balik Instan** setelah menjawab soal
* 📊 **Manajemen State Global** dengan Redux Toolkit
* 💾 **Persisted State** (redux-persist) untuk progress user
* 🎨 **Animasi Halus** menggunakan Framer Motion
* 📱 **Responsive UI** dengan TailwindCSS
* 🔄 **Routing Dinamis** menggunakan React Router v7

---

## 🔗 Query Parameter (Penting)

Aplikasi ini **wajib** dijalankan dengan query parameter untuk menyesuaikan modul dan preferensi user:

```
?tutorial=tutorialId&user=userId
```

### Contoh:

```
https://front-end-dc-02-j6lx.vercel.app/?tutorial=react-basic&user=student01
```

**Kegunaan parameter:**

* `tutorial` → menentukan modul / submodul pembelajaran
* `user` → identitas user untuk tracking progress & personalisasi soal

---

## 🏗 Tech Stack

### Frontend

* **React 19**
* **Vite 7**
* **React Router DOM 7**
* **Redux Toolkit**
* **Redux Persist**
* **Axios**
* **Framer Motion**
* **React Icons**

### Styling

* **TailwindCSS 3.4**
* **PostCSS + Autoprefixer**

### Tooling

* **ESLint**
* **PropTypes**

---

## ⚙️ Project Structure (Ringkas)

```
src/
├── components/      # Reusable UI components
├── pages/           # Page-based components
├── redux/           # Store, slices, dan persist config
├── routes/          # Routing configuration
├── services/        # API & axios setup
├── utils/           # Helper & utility functions
└── main.jsx
```

---

## ⚡ Getting Started

```bash
git clone https://github.com/your-username/web-developer-quiz.git
cd web-developer-quiz
npm install
npm run dev
```

Akses di browser:

```
http://localhost:5173/?tutorial=yourTutorialId&user=yourUserId
```

---

## 📌 Catatan Pengembangan

* Project ini **frontend-only** dan siap dihubungkan ke backend / AI service
* Endpoint AI (LLM) dapat ditambahkan untuk:

  * Generate soal otomatis
  * Analisis jawaban siswa
  * Feedback adaptif

---

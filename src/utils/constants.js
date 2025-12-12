export const ITEMS_PER_PAGE = 5;

export const levels = [
  { level: 1, name: "Mudah", time: "1:00", questions: 3 },
  { level: 2, name: "Sedang", time: "1:15", questions: 3 },
  { level: 3, name: "Sulit", time: "1:30", questions: 3 },
];

export const staticQuizResponse = {
  success: true,
  message: "Quiz generated successfully",
  tutorial: {
    id: 35363,
    title: "Penerapan AI dalam Dunia Nyata",
  },
  meta: {
    level: 1,
    totalQuestions: 3,
    multiple_choice: 3,
    multiple_answer: 0,
  },
  quiz: [
    {
      question:
        "Perangkat inovatif yang dilandasi oleh teknologi AI sehingga memiliki kemampuan untuk melakukan tugas berdasarkan perintah verbal...",
      type: "multiple_choice",
      options: {
        A: {
          text: "Self-driving car",
          isCorrect: false,
          feedback:
            "Self-driving car adalah mobil tanpa pengemudi, bukan perangkat yang merespon perintah verbal.",
        },
        B: {
          text: "Robot industri",
          isCorrect: false,
          feedback:
            "Robot industri umumnya melakukan tugas fisik berulang, bukan merespon perintah verbal seperti Smart Speaker.",
        },
        C: {
          text: "Smart Speaker",
          isCorrect: true,
          feedback:
            "Tepat sekali! Smart Speaker adalah perangkat berbasis AI yang merespons perintah verbal untuk melakukan berbagai tugas.",
        },
        D: {
          text: "Pesawat tanpa awak (Drone)",
          isCorrect: false,
          feedback:
            "Pesawat tanpa awak (drone) adalah alat terbang yang dikendalikan dari jarak jauh atau secara otomatis, bukan perangkat verbal interaktif.",
        },
        E: {
          text: "Printer 3D",
          isCorrect: false,
          feedback:
            "Printer 3D adalah perangkat untuk mencetak objek tiga dimensi, tidak berkaitan dengan perintah verbal.",
        },
      },
    },
    {
      question:
        "Salah satu komponen krusial pada Self-driving car adalah sensor yang berfungsi untuk mengukur jarak...",
      type: "multiple_choice",
      options: {
        A: {
          text: "Termometer",
          isCorrect: false,
          feedback: "Termometer mengukur suhu.",
        },
        B: {
          text: "Barometer",
          isCorrect: false,
          feedback: "Barometer mengukur tekanan udara.",
        },
        C: {
          text: "Higrometer",
          isCorrect: false,
          feedback: "Higrometer mengukur kelembaban.",
        },
        D: {
          text: "LIDAR",
          isCorrect: true,
          feedback:
            "Benar! LIDAR adalah sensor yang digunakan self-driving car untuk mengukur jarak objek di sekitarnya.",
        },
        E: {
          text: "Spektrometer",
          isCorrect: false,
          feedback: "Spektrometer menganalisis cahaya.",
        },
      },
    },
    {
      question:
        "Smart speaker memiliki kemampuan untuk menerima dan memproses perintah verbal...",
      type: "multiple_choice",
      options: {
        A: {
          text: "Computer Vision",
          isCorrect: false,
          feedback: "Digunakan untuk memahami gambar.",
        },
        B: {
          text: "Machine Learning",
          isCorrect: false,
          feedback: "ML adalah konsep lebih umum.",
        },
        C: {
          text: "Natural Language Processing (NLP)",
          isCorrect: true,
          feedback:
            "Betul! NLP adalah teknologi yang memungkinkan smart speaker memahami bahasa manusia.",
        },
        D: {
          text: "RPA",
          isCorrect: false,
          feedback: "RPA mengotomatiskan tugas berbasis aturan.",
        },
        E: {
          text: "Big Data Analytics",
          isCorrect: false,
          feedback: "Tidak digunakan untuk memahami bahasa.",
        },
      },
    },
  ],
};

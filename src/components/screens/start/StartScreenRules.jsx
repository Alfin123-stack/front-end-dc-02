import React from "react";

export default function StartScreenRules() {
  return (
    <div
      className="mt-12 p-6 rounded-2xl bg-white dark:bg-gray-800 
                    border border-gray-200 dark:border-gray-700 
                    w-full max-w-4xl">
      <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-3">
        Peraturan Quiz
      </h2>

      <ul className="space-y-2 text-gray-700 dark:text-gray-300 text-sm">
        <li>• Setiap level memiliki 3 soal dengan batas waktu tertentu.</li>
        <li>• Skor dihitung berdasarkan jumlah jawaban benar.</li>
        <li>• Bebas memilih level mana saja.</li>
        <li>• Riwayat quiz disimpan otomatis.</li>
      </ul>
    </div>
  );
}

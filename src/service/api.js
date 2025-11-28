const BASE_URL = "http://localhost:3000";

export async function generateQuiz(payload) {
  const res = await fetch(`${BASE_URL}/api/quiz/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  return res.json();
}

"use server";

interface AiCheckAnswerParams {
  userAnswer: string;
  correctAnswer: string;
  explanation?: string | null;
}

const callGemini = async (
  apiKey: string,
  correctAnswer: string,
  userAnswer: string,
  explanation?: string | null,
): Promise<Response> =>
  fetch(
    "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              'You are a lenient quiz answer validator. Determine if the user\'s answer conveys the same meaning as the correct answer. Be GENEROUS — accept equivalent answers including: numbers vs words ("6" = "six"), different order ("31 december" = "December 31st"), different date formats, abbreviations, minor typos, synonyms, partial matches that capture the key idea, different casing, and any other reasonable equivalence. When in doubt, accept the answer. Use the context/explanation to understand what the question is really asking. Respond with ONLY "true" or "false". Nothing else.',
          },
          {
            role: "user",
            content: `Correct answer: "${correctAnswer}"\nUser answer: "${userAnswer}"${explanation ? `\nContext/Explanation: "${explanation}"` : ""}`,
          },
        ],
        temperature: 0,
        max_tokens: 5,
      }),
    },
  );

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const aiCheckAnswer = async ({
  userAnswer,
  correctAnswer,
  explanation,
}: AiCheckAnswerParams): Promise<boolean> => {
  // Quick exact match shortcut
  const a = userAnswer.toLowerCase().trim();
  const b = correctAnswer.toLowerCase().trim();
  if (a === b) return true;

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error("GEMINI_API_KEY is not set — falling back to exact match");
    return false;
  }

  try {
    let response = await callGemini(apiKey, correctAnswer, userAnswer, explanation);

    // Retry once on rate limit (429)
    if (response.status === 429) {
      await sleep(1500);
      response = await callGemini(apiKey, correctAnswer, userAnswer, explanation);
    }

    if (!response.ok) {
      console.error("Gemini API error:", response.status);
      return false;
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.toLowerCase().trim();
    return result === "true";
  } catch (err) {
    console.error("AI answer check failed:", err);
    return false;
  }
};

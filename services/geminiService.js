const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const suggestCategory = async (description) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `
You are an expense category classifier.

Classify the following expense description into exactly ONE of these categories:

Food
Petrol
Salary
Shopping
Other

Expense description: "${description}"

Return ONLY the category name.
Do not explain anything.
Do not add punctuation.
      `,
    });

    const category = response.text.trim();

    return category;
  } catch (error) {
    console.error("Gemini Error:", error.message);

    throw new Error("Failed to get category suggestion");
  }
};

module.exports = {
  suggestCategory,
};

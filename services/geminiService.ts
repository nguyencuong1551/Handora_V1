
import { GoogleGenAI, Type } from "@google/genai";
import { UserQuizData, Product } from "../types";

export const getAIPersonalizedRecommendation = async (
  quizData: UserQuizData,
  availableProducts: Product[]
): Promise<{ recommendation: string; products: string[] }> => {
  // Fix: Always use named parameter for apiKey and assume it's pre-configured
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const productListString = availableProducts
    .map(p => `${p.name} (Category: ${p.category})`)
    .join(', ');

  const prompt = `Customer: ${quizData.skinType} skin, concerns: ${quizData.concerns.join(', ')}. Available: ${productListString}. Provide 2 sentence advice and suitable product names in JSON.`;

  try {
    // Fix: Using gemini-3-flash-preview for text tasks and removing manual API key validation
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendation: { type: Type.STRING },
            products: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ['recommendation', 'products']
        }
      }
    });

    // Fix: access response.text property directly
    const text = response.text;
    return JSON.parse(text || '{}');
  } catch (error) {
    console.error("AI Service Error - Using Fallback:", error);
    return {
      recommendation: "Based on your unique profile, HANDORA recommends gentle vegan formulas that maintain your skin's natural moisture barrier.",
      products: [availableProducts[0].name, availableProducts[2]?.name || availableProducts[0].name]
    };
  }
};

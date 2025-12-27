
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getStudySummary = async (subject: string, topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique de forma resumida e didática para um concurseiro o tema: "${topic}" da matéria de "${subject}". Use bullet points para os conceitos chave e termine com um "Dica de Ouro".`,
      config: {
        temperature: 0.7,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini summary error:", error);
    return "Desculpe, não consegui gerar o resumo no momento. Tente novamente mais tarde.";
  }
};

export const getAITip = async (userGoal: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Dê uma dica estratégica e motivacional para um estudante de concursos públicos que tem o seguinte objetivo ou dificuldade: "${userGoal}". Seja breve e encorajador.`,
      config: {
        temperature: 1,
      }
    });
    return response.text;
  } catch (error) {
    return "Mantenha o foco! O caminho é duro, mas a recompensa é a estabilidade.";
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { ConstructionConfig, LayoutResponse, AIInsight, TimelinePhase, SustainabilityReport } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateLayout = async (config: ConstructionConfig): Promise<LayoutResponse> => {
  const prompt = `Generate a realistic room layout for a ${config.builtUpArea} sq ft floor. 
  Inputs: Floors: ${config.floors}, Bedrooms: ${config.bedrooms}, Bathrooms: ${config.bathrooms}, 
  Dining: ${config.diningRoom}, Staircase: ${config.staircase}, Balcony: ${config.balcony}.
  
  STRICT ARCHITECTURAL RULES:
  1. Rooms must be arranged on a 20x20 unit grid.
  2. Rooms MUST NOT overlap. Use a packing algorithm logic.
  3. Total bounds should be within 20x20 units.
  4. Dimensions (width/height) and coordinates (x/y) must be integers between 0 and 20.
  5. Include specific room dimensions in feet in the description.
  6. Response must be strict JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            rooms: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  x: { type: Type.NUMBER },
                  y: { type: Type.NUMBER },
                  width: { type: Type.NUMBER },
                  height: { type: Type.NUMBER },
                  description: { type: Type.STRING }
                },
                required: ["name", "x", "y", "width", "height", "description"]
              }
            },
            totalWidth: { type: Type.NUMBER },
            totalHeight: { type: Type.NUMBER },
            explanation: { type: Type.STRING }
          },
          required: ["rooms", "totalWidth", "totalHeight", "explanation"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (err) {
    console.error("Layout generation error:", err);
    throw err;
  }
};

export const generateInsights = async (config: ConstructionConfig, estimation: any): Promise<AIInsight[]> => {
  const prompt = `Analyze Indian construction data: ${JSON.stringify(config)} and estimation: ${JSON.stringify(estimation)}.
  Currency: INR (₹). Generate 4 structured insights for the dashboard.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            category: { type: Type.STRING },
            severity: { type: Type.STRING },
            score: { type: Type.NUMBER },
            recommendation: { type: Type.STRING }
          },
          required: ["title", "category", "severity", "score", "recommendation"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const generateTimeline = async (config: ConstructionConfig): Promise<TimelinePhase[]> => {
  const duration = config.durationDays ? `${config.durationDays} days` : 'Optimal';
  const prompt = `Generate a week-by-week Indian construction schedule for ${config.builtUpArea} sq ft. 
  Requested Duration: ${duration}.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            week: { type: Type.NUMBER },
            phase: { type: Type.STRING },
            tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
            resources: { type: Type.STRING }
          },
          required: ["week", "phase", "tasks", "resources"]
        }
      }
    }
  });

  return JSON.parse(response.text || '[]');
};

export const generateSustainabilityReport = async (config: ConstructionConfig): Promise<SustainabilityReport> => {
  const prompt = `Generate a Sustainability Report for a ${config.builtUpArea} sq ft house in India. Include score and specific green tech advice.`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: { type: Type.NUMBER },
          ecoMaterials: { type: Type.ARRAY, items: { type: Type.STRING } },
          solarRecommendation: { type: Type.STRING },
          waterHarvesting: { type: Type.STRING },
          carbonEstimate: { type: Type.STRING },
          suggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["score", "ecoMaterials", "solarRecommendation", "waterHarvesting", "carbonEstimate", "suggestions"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const startAIChat = async () => {
  return ai.chats.create({
    model: 'gemini-2.0-flash',
    config: {
      systemInstruction: `You are BuildWise AI Assistant. 
      Professional Indian Construction Architect. 
      STRICT RULES FOR OUTPUT:
      1. DO NOT use Markdown (no #, *, or symbols).
      2. Use only PLAIN TEXT with clear capitalization and indentation.
      3. Use section titles in ALL CAPS followed by a colon.
      4. Use simple bullet points like "-" for lists.
      5. Always mention currency in INR (₹).`,
    }
  });
};


import { GoogleGenAI, Type } from "@google/genai";
import { Message, ComputeIntensity } from "./types";

export class GeminiService {
  private getClient(): GoogleGenAI {
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  private async withRetry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
    try {
      return await fn();
    } catch (error: any) {
      if (retries > 0 && (error.status === 503 || error.status >= 500)) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.withRetry(fn, retries - 1, delay * 2);
      }
      throw error;
    }
  }

  async detectIntentMode(prompt: string): Promise<ComputeIntensity> {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Analyze the user query and classify it into one of three compute intensity modes based on required reasoning depth:
          - LOW: Simple tasks, definitions, proofreading, translations.
          - MEDIUM: Summaries, creative writing, brainstorming, common knowledge.
          - HEAVY: Complex coding, advanced math, scientific reasoning, logic puzzles.
          
          User Query: "${prompt}"
          
          Return only the word: LOW, MEDIUM, or HEAVY.`,
        config: {
          responseMimeType: "text/plain",
        },
      });

      const result = response.text.trim().toUpperCase();
      if (result.includes("HEAVY")) return ComputeIntensity.HEAVY;
      if (result.includes("LOW")) return ComputeIntensity.LOW;
      return ComputeIntensity.MEDIUM;
    });
  }

  async analyzeBusinessCase(description: string): Promise<any> {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: `As an AI Eco-Efficiency Auditor and Sentinel, evaluate this business proposal: "${description}".
        Your goal is to define the "Eco-Efficient Choice"—the intersection where ecological sustainability meets economic growth.
        
        CRITICAL AUDIT REQUIREMENTS:
        1. CHALLENGE AI BIAS: Actively look for areas where the AI solution might be overkill or less efficient than non-AI alternatives.
        2. ECONOMIC LOSS ASSESSMENT: Explicitly identify potential economic losses (implementation failure, technical debt, or resource waste).
        3. PLANETARY IMPACT: Focus on the peacock sentinel principle—preserving biodiversity and water security.
        
        Provide a detailed analysis including metrics, social impact, and roadmap.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              metrics: {
                type: Type.OBJECT,
                properties: {
                  planetScore: { type: Type.NUMBER },
                  profitScore: { type: Type.NUMBER },
                  waterImpact: { type: Type.STRING },
                  roiFactor: { type: Type.STRING }
                },
                required: ["planetScore", "profitScore", "waterImpact", "roiFactor"]
              },
              temporalBreakeven: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.NUMBER },
                  unit: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ["value", "unit", "description"]
              },
              socialImpact: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  description: { type: Type.STRING },
                  pillars: { type: Type.ARRAY, items: { type: Type.STRING } }
                },
                required: ["score", "description", "pillars"]
              },
              roadmap: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    stage: { type: Type.STRING },
                    timeline: { type: Type.STRING },
                    action: { type: Type.STRING },
                    gains: { type: Type.STRING },
                    losses: { type: Type.STRING }
                  },
                  required: ["stage", "timeline", "action", "gains", "losses"]
                }
              },
              particulars: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    category: { type: Type.STRING },
                    variable: { type: Type.STRING },
                    value: { type: Type.STRING },
                    impact: { type: Type.STRING }
                  },
                  required: ["category", "variable", "value", "impact"]
                }
              },
              verdict: { type: Type.STRING }
            },
            required: ["metrics", "temporalBreakeven", "socialImpact", "roadmap", "particulars", "verdict"]
          }
        }
      });
      return JSON.parse(response.text);
    });
  }

  async generateResponse(history: Message[], prompt: string, mode: ComputeIntensity): Promise<string> {
    return this.withRetry(async () => {
      const ai = this.getClient();
      const modeInstruction = mode === ComputeIntensity.HEAVY 
        ? "You are in HEAVY compute mode. Provide deeply reasoned, thorough, and precise answers." 
        : mode === ComputeIntensity.LOW 
        ? "You are in LOW compute mode. Be as brief and efficient as possible, using minimal tokens." 
        : "You are in MEDIUM compute mode. Provide helpful, balanced responses.";

      const modelName = mode === ComputeIntensity.HEAVY ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';

      const response = await ai.models.generateContent({
        model: modelName,
        contents: [
          ...history.map(m => ({
            role: m.role,
            parts: [{ text: m.content }]
          })),
          { role: 'user', parts: [{ text: prompt }] }
        ],
        config: {
          systemInstruction: `You are an AI optimized for permacomputing, acting as a Nature's Sentinel (inspired by the peacock—an indicator of environmental health). ${modeInstruction} 
          CRITICAL FORMATTING RULES:
          1. STRICTURELY NO MARKDOWN. Do not use symbols like #, *, **, or - for lists or headers.
          2. Use double line breaks to separate sections.
          3. Use ALL CAPS for headers.
          4. Keep responses concise but human-readable. Output plain text.`,
          temperature: mode === ComputeIntensity.HEAVY ? 0.9 : 0.6,
        },
      });

      return response.text || "No response generated.";
    });
  }
}

export const geminiService = new GeminiService();

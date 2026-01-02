
import { GoogleGenAI, Type } from "@google/genai";
import { StyleAnalysis } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const RECOMMENDATION_ARRAY_SCHEMA = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      title: { type: Type.STRING },
      description: { type: Type.STRING },
      tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      badge: { type: Type.STRING }
    },
    required: ["title", "description", "tags"]
  }
};

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    vibe: { type: Type.STRING, description: "Overall style vibe identified" },
    faceShape: { type: Type.STRING, description: "Detected face shape (Oval, Square, etc.)" },
    bodyType: { type: Type.STRING, description: "Body structure analysis (Ectomorph, Endomorph, etc.)" },
    colorPalette: {
      type: Type.OBJECT,
      properties: {
        primary: { type: Type.STRING },
        secondary: { type: Type.STRING },
        accent: { type: Type.STRING },
        shades: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["primary", "secondary", "accent", "shades"]
    },
    skinHealth: {
      type: Type.OBJECT,
      properties: {
        overallHealth: { type: Type.STRING },
        oiliness: { type: Type.STRING },
        spots: { type: Type.STRING },
        wrinkles: { type: Type.STRING },
        darkCircles: { type: Type.STRING },
        healthScore: { type: Type.NUMBER }
      },
      required: ["overallHealth", "oiliness", "spots", "wrinkles", "darkCircles", "healthScore"]
    },
    physicalAttributes: {
      type: Type.OBJECT,
      properties: {
        estimatedAge: { type: Type.STRING },
        skinColor: { type: Type.STRING },
        eyeColor: { type: Type.STRING },
        hairColor: { type: Type.STRING },
        gender: { type: Type.STRING },
        height: { type: Type.STRING, description: "Estimated height (e.g. 5'10'')" },
        weight: { type: Type.STRING, description: "Estimated weight (e.g. 160 lbs)" }
      },
      required: ["estimatedAge", "skinColor", "eyeColor", "hairColor", "gender", "height", "weight"]
    },
    recommendations: {
      type: Type.OBJECT,
      properties: {
        hair: {
          type: Type.OBJECT,
          properties: {
            hair: RECOMMENDATION_ARRAY_SCHEMA,
            beard: RECOMMENDATION_ARRAY_SCHEMA
          }
        },
        outfit: {
          type: Type.OBJECT,
          properties: {
            Party: RECOMMENDATION_ARRAY_SCHEMA,
            Wedding: RECOMMENDATION_ARRAY_SCHEMA,
            Office: RECOMMENDATION_ARRAY_SCHEMA,
            Fashion: RECOMMENDATION_ARRAY_SCHEMA,
            Travel: RECOMMENDATION_ARRAY_SCHEMA,
            Beach: RECOMMENDATION_ARRAY_SCHEMA,
            Trekking: RECOMMENDATION_ARRAY_SCHEMA,
            Summer: RECOMMENDATION_ARRAY_SCHEMA,
            Winter: RECOMMENDATION_ARRAY_SCHEMA,
            Rainy: RECOMMENDATION_ARRAY_SCHEMA
          }
        },
        access: {
          type: Type.OBJECT,
          properties: {
            Shoes: RECOMMENDATION_ARRAY_SCHEMA,
            Watches: RECOMMENDATION_ARRAY_SCHEMA,
            Sunglasses: RECOMMENDATION_ARRAY_SCHEMA,
            Caps: RECOMMENDATION_ARRAY_SCHEMA,
            Bands: RECOMMENDATION_ARRAY_SCHEMA,
            Studs: RECOMMENDATION_ARRAY_SCHEMA,
            Belts: RECOMMENDATION_ARRAY_SCHEMA,
            Ties: RECOMMENDATION_ARRAY_SCHEMA
          }
        },
        tattoo: {
          type: Type.OBJECT,
          properties: {
            Face: RECOMMENDATION_ARRAY_SCHEMA,
            Neck: RECOMMENDATION_ARRAY_SCHEMA,
            Fingers: RECOMMENDATION_ARRAY_SCHEMA,
            Hands: RECOMMENDATION_ARRAY_SCHEMA,
            Shoulder: RECOMMENDATION_ARRAY_SCHEMA,
            Front: RECOMMENDATION_ARRAY_SCHEMA,
            Back: RECOMMENDATION_ARRAY_SCHEMA,
            Belly: RECOMMENDATION_ARRAY_SCHEMA,
            Waist: RECOMMENDATION_ARRAY_SCHEMA,
            Legs: RECOMMENDATION_ARRAY_SCHEMA
          }
        },
        diet: {
          type: Type.OBJECT,
          properties: {
            Protein: RECOMMENDATION_ARRAY_SCHEMA,
            Powders: RECOMMENDATION_ARRAY_SCHEMA,
            Salads: RECOMMENDATION_ARRAY_SCHEMA,
            DryFruits: RECOMMENDATION_ARRAY_SCHEMA,
            Fruits: RECOMMENDATION_ARRAY_SCHEMA,
            Seeds: RECOMMENDATION_ARRAY_SCHEMA,
            Keto: RECOMMENDATION_ARRAY_SCHEMA,
            NonVeg: RECOMMENDATION_ARRAY_SCHEMA,
            Veg: RECOMMENDATION_ARRAY_SCHEMA,
            GreenLeaves: RECOMMENDATION_ARRAY_SCHEMA
          }
        }
      }
    },
    occasionTips: { type: Type.ARRAY, items: { type: Type.STRING } }
  },
  required: [
    "vibe", 
    "faceShape", 
    "bodyType", 
    "colorPalette", 
    "skinHealth", 
    "physicalAttributes", 
    "recommendations",
    "occasionTips"
  ]
};

/**
 * Use gemini-3-pro-preview for complex reasoning tasks like style and health analysis.
 */
export const analyzeStyle = async (base64Image: string): Promise<StyleAnalysis> => {
  try {
    const dataParts = base64Image.split(',');
    const imageData = dataParts.length > 1 ? dataParts[1] : dataParts[0];

    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: imageData,
              mimeType: "image/jpeg",
            },
          },
          {
            text: `Perform a comprehensive premium style and health analysis. 
            Analyze gender, face structure, skin tone, height, weight, and age from the photo.
            Generate EXACTLY 3-5 high-quality, personalized recommendations for EVERY sub-category listed in the schema.
            Recommendations MUST be relevant to the person's detected physical attributes. No generic filler.
            Provide specific outfit styles for Wedding/Office/etc. that suit their body type.
            Suggest sunglasses that fit their face shape.
            Suggest diet options that suit their estimated age and physique.
            Return result in strict JSON format according to the provided schema.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    const result = JSON.parse(response.text || "{}") as StyleAnalysis;
    return result;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

/**
 * Use gemini-2.5-flash-image for general image editing tasks.
 */
export const transformStyle = async (base64Image: string, styleTitle: string, category: string): Promise<string> => {
  try {
    const dataParts = base64Image.split(',');
    const imageData = dataParts.length > 1 ? dataParts[1] : dataParts[0];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: imageData,
              mimeType: 'image/jpeg',
            },
          },
          {
            text: `Apply the "${styleTitle}" look to this person in the "${category}" area. 
            Maintain their facial structure, identity, and skin tone. 
            Change only the elements related to the recommendation.
            Output a single transformed image part.`
          },
        ],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from the transformation.");
    }

    for (const part of response.candidates[0].content.parts) {
      // Find the image part, do not assume it is the first part.
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image was found in the transformation response.");
  } catch (error) {
    console.error("Style transformation failed:", error);
    throw error;
  }
};


import { GoogleGenAI, Type } from "@google/genai";
import { StyleAnalysis, Recommendation } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

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
        gender: { type: Type.STRING, description: "Classify strictly as: 'Male', 'Female', 'Boy', or 'Girl'" },
        height: { type: Type.STRING, description: "Estimated height" },
        weight: { type: Type.STRING, description: "Estimated weight" }
      },
      required: ["estimatedAge", "skinColor", "eyeColor", "hairColor", "gender", "height", "weight"]
    },
    // Use a flat array to avoid "Constraint too tall" error caused by deep nested named properties
    recommendationsList: {
      type: Type.ARRAY,
      description: "Flat list of all style recommendations",
      items: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "The main category (e.g., hair, makeup, outfit, access, tattoo, diet)" },
          subCategory: { type: Type.STRING, description: "The specific sub-category (e.g., Party, beard, Sunglasses)" },
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          tags: { type: Type.ARRAY, items: { type: Type.STRING } },
          badge: { type: Type.STRING }
        },
        required: ["category", "subCategory", "title", "description", "tags"]
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
    "recommendationsList",
    "occasionTips"
  ]
};

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
            Identify if the person is a Male, Female, Boy, or Girl.
            
            REQUIRED SUB-CATEGORIES (Provide exactly 5 items for each valid one):
            - hair: hair, beard (only for adult Male)
            - makeup: Contact Lens, Eyebrows, Eye Liner, Lipstick, Lip Liner, Stickers, Ear Rings (only for Female/Girl)
            - outfit: Party, Wedding, Office, Fashion, Travel, Beach, Trekking, Summer, Winter, Rainy
            - access: Shoes, Watches, Sunglasses, Caps, Bands, Studs, Belts, Ties
            - tattoo: Face, Neck, Fingers, Hands, Shoulder, Front, Back, Belly, Waist, Legs
            - diet: Protein, Powders, Salads, DryFruits, Fruits, Seeds, Keto, NonVeg, Veg, GreenLeaves
            
            Return result in strict JSON format. Use the recommendationsList array for all style items.`
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: ANALYSIS_SCHEMA,
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    
    // Group the flat list back into the nested structure expected by the frontend
    const recommendations: any = {
      hair: {},
      makeup: {},
      outfit: {},
      access: {},
      tattoo: {},
      diet: {}
    };

    if (Array.isArray(parsed.recommendationsList)) {
      parsed.recommendationsList.forEach((item: any) => {
        const cat = item.category?.toLowerCase();
        if (recommendations[cat]) {
          if (!recommendations[cat][item.subCategory]) {
            recommendations[cat][item.subCategory] = [];
          }
          recommendations[cat][item.subCategory].push({
            title: item.title,
            description: item.description,
            tags: item.tags,
            badge: item.badge
          });
        }
      });
    }

    // Map back to the StyleAnalysis interface
    const result: StyleAnalysis = {
      vibe: parsed.vibe,
      faceShape: parsed.faceShape,
      bodyType: parsed.bodyType,
      colorPalette: parsed.colorPalette,
      skinHealth: parsed.skinHealth,
      physicalAttributes: parsed.physicalAttributes,
      occasionTips: parsed.occasionTips,
      recommendations
    };

    return result;
  } catch (error) {
    console.error("Analysis failed:", error);
    throw new Error("Failed to analyze image. Please try again.");
  }
};

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
            Maintain their identity. Output a single transformed image part.`
          },
        ],
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No candidates returned from transformation.");
    }

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image was found in transformation response.");
  } catch (error) {
    console.error("Style transformation failed:", error);
    throw error;
  }
};

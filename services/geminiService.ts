
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { PatientData, AIResponse } from "../types";

const SYSTEM_PROMPT = `
You are HealthMate, an expert medical AI assistant.
Your task is to analyze a photo of a doctor's prescription or clinical notes and generate patient-education materials.

Responsibilities:
1. Analyze the provided image to identify the Diagnosis, Symptoms, and Prescribed Medications/Treatments.
2. If the handwriting is unclear, infer the most likely condition based on visible medications or keywords.
3. Create a diet plan tailored to the patient's region (State/District).
4. Extract specific medication details (Name, Dosage, Timing, Purpose).
5. Suggest physical activities suitable for the patient's age and condition.
6. Generate a scene-by-scene script for an animated "Toy Avatar" (friendly bear) to explain the condition to the patient.
7. Adapt the language and tone based on the patient's age and language preference.
8. Provide a "Smart Symptom Checker" list distinguishing between normal side-effects vs. emergencies.
9. Cite verified medical sources (WHO, NHS, Mayo Clinic) for the advice.

Always return valid JSON adhering to the schema provided.
`;

export const generatePatientPlan = async (data: PatientData): Promise<AIResponse> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Prepare content parts
  const contentParts: any[] = [];

  // 1. Add Prescription Image (Required)
  const presMatches = data.prescriptionImage.match(/^data:(.+);base64,(.+)$/);
  if (!presMatches || presMatches.length !== 3) {
      throw new Error("Invalid prescription image format");
  }
  contentParts.push({
      inlineData: {
          mimeType: presMatches[1],
          data: presMatches[2]
      }
  });

  // 2. Add Report Image (Optional)
  if (data.reportImage) {
      const reportMatches = data.reportImage.match(/^data:(.+);base64,(.+)$/);
      if (reportMatches && reportMatches.length === 3) {
           contentParts.push({
              inlineData: {
                  mimeType: reportMatches[1],
                  data: reportMatches[2]
              }
          });
      }
  }

  const prompt = `
    Patient Demographics:
    - Name: ${data.patientName || "Patient"}
    - Age: ${data.age} (MANDATORY: Adapt content for this age group)
    - Gender: ${data.gender || "Unknown"}
    - Language Preference: ${data.language || "English"}
    - Region/Location: ${data.location} (MANDATORY: Use for diet)

    Task:
    1. READ the attached images (Prescription and optionally Lab Reports) carefully. Extract the diagnosis/condition name.
    2. Extract the MEDICATIONS listed.
    3. IMPORTANT: For every medication, provide a 'schedule_time' in "HH:MM" 24-hour format.
    4. Suggest 3-5 specific PHYSICAL ACTIVITIES.
    5. Generate a 'detailed_analysis' object with 4 specific fields:
       - 'what_is_it': Simple definition of the condition.
       - 'why_it_happened': The cause or mechanism.
       - 'body_part_affected': Specific organ or system.
       - 'how_treatment_helps': How the prescribed meds/lifestyle will fix it.
       - ALSO provide 'education_text' as a summary of these.
    6. Generate a 'tts_script' for the Avatar. Start with "Hello ${data.patientName || "there"}, I'm Dr. Bear...".
    7. RED ZONE ALERTS: List 3-5 critical emergency symptoms.
    8. SMART SYMPTOM CHECKER: List 4-5 symptoms (Normal vs Emergency).
    9. The "regional_food_list" MUST contain specific local dishes/ingredients from ${data.location}.
    10. Provide 3-4 General Medication Safety Tips.
    11. Provide 3-5 LIFESTYLE recommendations.
    12. SOURCES: List 2-3 credible sources.
    
    IMPORTANT LANGUAGE INSTRUCTION:
    The user has selected the language: ${data.language}.
    You MUST translate the 'detailed_analysis' fields, 'education_text', 'tts_script', 'voiceover', 'red_zone_alerts', 'symptom_checker', 'dos', 'donts', 'recommended_activities', 'lifestyle_advice', and 'medication_tips' into ${data.language}.
    The 'condition' name can be in English or the target language.
    The 'medications' names should remain in English, but translate 'purpose' and 'timing'.
  `;

  // 3. Add Prompt Text
  contentParts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: contentParts
      },
      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            condition: { type: Type.STRING },
            education_text: { type: Type.STRING },
            detailed_analysis: {
              type: Type.OBJECT,
              properties: {
                what_is_it: { type: Type.STRING, description: "Simple explanation of the condition" },
                why_it_happened: { type: Type.STRING, description: "Causes" },
                body_part_affected: { type: Type.STRING, description: "Affected body part" },
                how_treatment_helps: { type: Type.STRING, description: "How meds help" }
              }
            },
            tts_script: { type: Type.STRING },
            animation_script: {
              type: Type.OBJECT,
              properties: {
                scenes: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      scene: { type: Type.INTEGER },
                      visual: { type: Type.STRING },
                      voiceover: { type: Type.STRING }
                    }
                  }
                }
              }
            },
            regional_food_list: { type: Type.ARRAY, items: { type: Type.STRING } },
            warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
            red_zone_alerts: { type: Type.ARRAY, items: { type: Type.STRING } },
            symptom_checker: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  symptom: { type: Type.STRING },
                  severity: { type: Type.STRING, enum: ['NORMAL', 'MODERATE', 'EMERGENCY'] },
                  action: { type: Type.STRING }
                }
              }
            },
            sources: { type: Type.ARRAY, items: { type: Type.STRING } },
            dos: { type: Type.ARRAY, items: { type: Type.STRING } },
            donts: { type: Type.ARRAY, items: { type: Type.STRING } },
            medications: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  dosage: { type: Type.STRING },
                  timing: { type: Type.STRING },
                  schedule_time: { type: Type.STRING },
                  purpose: { type: Type.STRING }
                }
              }
            },
            medication_tips: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommended_activities: { type: Type.ARRAY, items: { type: Type.STRING } },
            lifestyle_advice: { type: Type.ARRAY, items: { type: Type.STRING } },
            doctor_summary_used: { type: Type.STRING }
          }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as AIResponse;
    }
    throw new Error("Empty response from AI");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateTTSAudio = async (text: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
        },
      },
    });
    
    const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!audioData) {
        throw new Error("No audio content generated.");
    }
    return audioData;

  } catch (error) {
    console.error("TTS Generation Error:", error);
    throw error;
  }
};

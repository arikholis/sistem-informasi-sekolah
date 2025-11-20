import { GoogleGenAI, Type } from "@google/genai";
import { Student, AIAnalysisResult } from '../types';

// In a real app, this key should be securely managed.
// Since the instructions say to assume process.env.API_KEY is available:
const apiKey = process.env.API_KEY || ''; 

let aiClient: GoogleGenAI | null = null;

const getAiClient = () => {
    if (!aiClient) {
        aiClient = new GoogleGenAI({ apiKey });
    }
    return aiClient;
}

export const analyzeStudentData = async (students: Student[]): Promise<AIAnalysisResult> => {
    if (!apiKey) {
        throw new Error("API Key is missing");
    }

    const ai = getAiClient();

    // Serialize student data to a string for the prompt
    const dataString = JSON.stringify(students.map(s => ({
        name: s.name,
        class: s.class,
        averages: {
            math: s.math,
            science: s.science,
            english: s.english,
            islamic: s.islamicStudies
        },
        attendance: s.attendance,
        behavior: s.behavior
    })));

    const prompt = `
    Anda adalah konsultan pendidikan ahli untuk Sekolah Smart Ekselensia Indonesia.
    Analisis data siswa berikut (format JSON) dan berikan wawasan mendalam.
    
    Data Siswa:
    ${dataString}
    
    Tugas:
    1. Berikan ringkasan kinerja akademik keseluruhan.
    2. Berikan 3 rekomendasi strategis untuk meningkatkan kualitas pendidikan berdasarkan data ini.
    3. Identifikasi siswa yang berisiko (nilai rendah atau kehadiran buruk) dan butuh perhatian khusus.
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        recommendations: { 
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        },
                        atRiskStudents: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING }
                        }
                    },
                    required: ["summary", "recommendations", "atRiskStudents"]
                }
            }
        });

        const text = response.text;
        if (!text) throw new Error("No response from AI");
        
        return JSON.parse(text) as AIAnalysisResult;

    } catch (error) {
        console.error("Gemini Analysis Error:", error);
        return {
            summary: "Gagal menganalisis data. Pastikan API Key valid.",
            recommendations: ["Periksa koneksi internet", "Coba lagi nanti"],
            atRiskStudents: []
        };
    }
};

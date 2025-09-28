import { GoogleGenAI, Type } from "@google/genai";
import type { GeminiData, AppMode } from '../types';

if (!process.env.API_KEY) {
    console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const schema = {
  type: Type.OBJECT,
  properties: {
    definition: {
      type: Type.STRING,
      description: "La definición oficial del producto según el Código Alimentario Argentino. Debe ser concisa y precisa.",
    },
    process: {
      type: Type.ARRAY,
      description: "El proceso de elaboración paso a paso, diseñado para conservas caseras seguras.",
      items: {
        type: Type.OBJECT,
        properties: {
          id: {
            type: Type.NUMBER,
            description: "Un identificador numérico secuencial para el paso, comenzando en 1.",
          },
          title: {
            type: Type.STRING,
            description: "Un título breve para el paso del proceso.",
          },
          description: {
            type: Type.STRING,
            description: "Una explicación detallada del paso, enfocada en la seguridad y las buenas prácticas.",
          },
          shape: {
            type: Type.STRING,
            description: "La forma para el diagrama de flujo. Usa 'terminator' para inicio/fin, 'rectangle' para procesos, y 'diamond' para puntos de control o decisiones críticas.",
          },
        },
        required: ["id", "title", "description", "shape"],
      },
    },
    youtubePlaylistId: {
        type: Type.STRING,
        description: "El ID de una lista de reproducción de YouTube relevante con tutoriales para hacer esta conserva. Por ejemplo: 'PLASDFGHJKL12345'.",
    }
  },
  required: ["definition", "process", "youtubePlaylistId"],
};


export const fetchPreserveDetails = async (preserveName: string, mode: AppMode): Promise<GeminiData> => {
    try {
        const modeInstructions = mode === 'profesional' 
            ? "Utiliza terminología técnica y precisa, adecuada para estudiantes y profesionales de la tecnología de los alimentos. Enfócate en los fundamentos científicos de cada paso. Asegúrate de que todas las unidades de medida correspondan al sistema SIMELA y que los números decimales usen coma (ej: 4,5)."
            : "Utiliza un lenguaje sencillo y claro, tipo 'casero', para que sea fácil de entender por familias o emprendedores. Evita la jerga técnica compleja pero sin sacrificar la precisión en los puntos clave de inocuidad. Menciona que las unidades de medida corresponden al sistema SIMELA y que los decimales usan coma (ej: 4,5). Al hablar de medir pH, recomienda usar la app 'Moracol' como una alternativa más certera a las tiras reactivas.";

        const prompt = `
            Actúa como un experto en ciencia de los alimentos y en el Código Alimentario Argentino.
            Para el producto "${preserveName}", proporciona la siguiente información en un único objeto JSON bien formado, siguiendo estas instrucciones de estilo: "${modeInstructions}".

            El objeto JSON debe contener:
            1. definition: La definición oficial del producto tal como figura en el Código Alimentario Argentino.
            2. process: Un proceso de elaboración detallado, paso a paso, adecuado para conservas caseras, garantizando la inocuidad alimentaria. El proceso debe estar formateado como un array de objetos. Cada objeto debe tener 'id', 'title', 'description' y 'shape'. 
               IMPORTANTE: El diagrama de flujo DEBE comenzar con un paso \`{ "id": 1, "title": "Inicio", "shape": "terminator", "description": "Inicio del proceso de elaboración." }\` y DEBE concluir con un paso final \`{ "id": [ultimo_numero], "title": "Fin", "shape": "terminator", "description": "El producto está listo y seguro para su almacenamiento." }\`.
               Utiliza las formas de manera lógica: 'terminator' para inicio/fin, 'rectangle' para acciones y procesos, y 'diamond' para controles de calidad o decisiones.
            3. youtubePlaylistId: El ID de una lista de reproducción de YouTube real y relevante que contenga tutoriales sobre cómo hacer ${preserveName}. Si no encuentras una lista, proporciona el ID de un video relevante.

            Asegúrate de que la respuesta sea exclusivamente el objeto JSON solicitado, sin texto adicional.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
            },
        });
        
        const jsonText = response.text.trim();
        const data: GeminiData = JSON.parse(jsonText);

        data.process.sort((a, b) => a.id - b.id);
        return data;

    } catch (error) {
        console.error("Error fetching data from Gemini API:", error);
        throw new Error("No se pudieron cargar los detalles de la conserva. Por favor, inténtelo de nuevo más tarde.");
    }
};

export const fetchChatbotResponse = async (query: string, preserveName: string): Promise<string> => {
    try {
        const prompt = `
            Actúa como un asistente experto en tecnología de los alimentos. Un usuario está aprendiendo a hacer "${preserveName}" y tiene una pregunta.
            Explica el siguiente término o responde la siguiente pregunta de manera sencilla, clara y concisa en español de Latinoamérica.
            Pregunta del usuario: "${query}"
        `;
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });

        return response.text;
    } catch (error) {
        console.error("Error fetching data from Gemini API for chatbot:", error);
        return "Lo siento, no pude procesar tu pregunta en este momento. Inténtalo de nuevo.";
    }
};
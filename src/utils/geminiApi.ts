
// API client for Google's Gemini AI
import { useToast } from "@/components/ui/use-toast";

const LOCAL_STORAGE_KEY = 'gemini_api_key';

interface GeminiMessage {
  role: 'user' | 'model';
  parts: {
    text?: string;
    inlineData?: {
      mimeType: string;
      data: string;
    };
  }[];
}

interface GeminiRequestOptions {
  contents: GeminiMessage[];
  generationConfig?: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    stopSequences?: string[];
  };
}

interface GeminiResponseCandidate {
  content: {
    parts: {
      text?: string;
    }[];
  };
  finishReason: string;
}

interface GeminiResponse {
  candidates: GeminiResponseCandidate[];
}

export const getGeminiApiKey = (): string | null => {
  return localStorage.getItem(LOCAL_STORAGE_KEY);
};

export const hasGeminiApiKey = (): boolean => {
  return !!getGeminiApiKey();
};

export const callGeminiApi = async (
  prompt: string, 
  imageData?: string,
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
): Promise<string> => {
  const apiKey = getGeminiApiKey();
  
  if (!apiKey) {
    throw new Error("Gemini API key not found. Please add your API key in settings.");
  }
  
  const model = imageData ? "gemini-pro-vision" : "gemini-pro";
  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  
  const userMessage: GeminiMessage = {
    role: "user",
    parts: []
  };
  
  // Add text prompt
  if (prompt) {
    userMessage.parts.push({ text: prompt });
  }
  
  // Add image if provided
  if (imageData) {
    // Extract base64 data from data URL
    const base64Data = imageData.split(',')[1];
    
    userMessage.parts.push({
      inlineData: {
        mimeType: "image/jpeg", // Assuming JPEG, adjust if needed
        data: base64Data
      }
    });
  }
  
  const requestBody: GeminiRequestOptions = {
    contents: [userMessage],
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 2048,
    }
  };
  
  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API error:', errorText);
      throw new Error(`Gemini API error: ${response.status}`);
    }
    
    const data: GeminiResponse = await response.json();
    
    if (!data.candidates || data.candidates.length === 0) {
      throw new Error('No response generated');
    }
    
    const text = data.candidates[0].content.parts
      .map(part => part.text || '')
      .join('');
    
    return text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

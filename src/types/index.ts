export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  fileUrl?: string;
  temporary?: boolean; // New field for temporary messages
}

export interface AISettings {
  voice: {
    enabled: boolean;
    voiceId: string;
    volume: number;
  };
  vision: {
    enabled: boolean;
  };
  video: {
    enabled: boolean;
  };
  chat: {
    temporaryMessagesEnabled: boolean;
    temporaryMessageTTL: number; // in minutes
  };
  billing?: {
    plan: 'free' | 'plus' | 'pro';
    encryptionEnabled: boolean;
    encryptionKey?: string;
  };
}

export interface ChatHistory {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

export interface SearchResult {
  title: string;
  snippet: string;
  url: string;
  publishedDate?: string;
}

export interface DeepSearchResult {
  summary: string;
  results: SearchResult[];
}

export interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
}

export interface EncryptedData {
  data: string;
  isEncrypted: boolean;
}

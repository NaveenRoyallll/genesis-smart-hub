
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
    temporaryMessageTTL: number; // Time to live in minutes
  };
}

export interface ChatHistory {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  messages: Message[];
}

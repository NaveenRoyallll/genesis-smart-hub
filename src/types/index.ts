
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  fileUrl?: string;
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
}

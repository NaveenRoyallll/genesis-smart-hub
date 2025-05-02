
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import MessageInput from '@/components/MessageInput';
import Settings from '@/components/Settings';
import ChatHistoryDrawer from '@/components/ChatHistoryDrawer';
import VideoChat from '@/components/VideoChat';
import { Message, AISettings, ChatHistory } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Mock function for handling file uploads
const uploadFile = async (file: File): Promise<string> => {
  // In a real app, this would upload to a storage service and return a URL
  return new Promise((resolve) => {
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      resolve(url);
    }, 500);
  });
};

// Mock function for AI responses
const getAIResponse = async (message: string, fileUrl?: string): Promise<string> => {
  // In a real app, this would call an AI API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (fileUrl) {
        resolve(`I've analyzed the image you shared. This appears to be [description of image]. How can I help with this?`);
      } else {
        const responses = [
          "I understand you're asking about that. Let me provide some information...",
          "That's an interesting question. Here's what I know...",
          "I'd be happy to help with that. Based on my knowledge...",
          "Great question! The answer is...",
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }
    }, 1500);
  });
};

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [chatHistories, setChatHistories] = useState<ChatHistory[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const { toast } = useToast();
  
  const [settings, setSettings] = useState<AISettings>({
    voice: {
      enabled: true,
      voiceId: '9BWtsMINqrJLrRacOk9x', // Aria voice ID
      volume: 0.8,
    },
    vision: {
      enabled: true,
    },
    video: {
      enabled: true,
    },
    chat: {
      temporaryMessagesEnabled: false,
      temporaryMessageTTL: 5, // Default 5 minutes
    }
  });

  // Clean up expired temporary messages
  useEffect(() => {
    if (settings.chat.temporaryMessagesEnabled) {
      const interval = setInterval(() => {
        setMessages(prevMessages => prevMessages.filter(msg => !msg.temporary));
      }, 60000); // Check every minute
      
      return () => clearInterval(interval);
    }
  }, [settings.chat.temporaryMessagesEnabled]);

  const handleSettingsChange = (newSettings: AISettings) => {
    setSettings(newSettings);
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved",
    });
  };

  const handleSendMessage = async (content: string, file: File | null = null, temporary: boolean = false) => {
    let fileUrl = undefined;
    
    // Handle file upload if present
    if (file && settings.vision.enabled) {
      try {
        fileUrl = await uploadFile(file);
      } catch (error) {
        toast({
          title: "Upload failed",
          description: "Failed to upload image",
          variant: "destructive",
        });
        return;
      }
    }

    // Add user message to chat
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: content,
      timestamp: new Date(),
      fileUrl,
      temporary,
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setIsTyping(true);
    
    try {
      // Get AI response
      const responseContent = await getAIResponse(content, fileUrl);
      
      // Add AI response to chat
      const aiMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        temporary,
      };
      
      setMessages((prev) => [...prev, aiMessage]);
      
      // Update current chat history or create a new one if none exists
      if (currentChatId) {
        updateChatHistory(currentChatId, [userMessage, aiMessage]);
      } else {
        createNewChatHistory([userMessage, aiMessage]);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get a response",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  const handleToggleVoice = () => {
    if (!settings.voice.enabled) {
      toast({
        title: "Voice disabled",
        description: "Enable voice in settings first",
      });
      return;
    }
    
    setIsListening((prev) => !prev);
    
    if (!isListening) {
      // Mock voice recognition start
      toast({
        title: "Listening...",
        description: "Speak now",
      });
      
      // In a real app, this would use the Web Speech API or similar
      // For demo, we'll simulate stopping after 5 seconds with a mock result
      setTimeout(() => {
        setIsListening(false);
        handleSendMessage("This is a simulated voice message");
        toast({
          title: "Voice captured",
        });
      }, 5000);
    } else {
      toast({
        title: "Stopped listening",
      });
    }
  };
  
  const handleToggleVideo = () => {
    if (!settings.video.enabled) {
      toast({
        title: "Video disabled",
        description: "Enable video chat in settings first",
      });
      return;
    }
    
    setIsVideoActive(prev => !prev);
    
    if (!isVideoActive) {
      toast({
        title: "Video chat started",
      });
    }
  };
  
  const createNewChatHistory = (msgs: Message[]) => {
    const nonTemporaryMsgs = msgs.filter(msg => !msg.temporary);
    if (nonTemporaryMsgs.length === 0) return;
    
    const firstMsg = nonTemporaryMsgs[0];
    const newChatId = uuidv4();
    const title = firstMsg.content.length > 30 
      ? firstMsg.content.substring(0, 30) + "..."
      : firstMsg.content;
      
    const newChat: ChatHistory = {
      id: newChatId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
      messages: nonTemporaryMsgs,
    };
    
    setChatHistories(prev => [newChat, ...prev]);
    setCurrentChatId(newChatId);
  };
  
  const updateChatHistory = (chatId: string, newMessages: Message[]) => {
    const nonTemporaryMsgs = newMessages.filter(msg => !msg.temporary);
    if (nonTemporaryMsgs.length === 0) return;
    
    setChatHistories(prev => prev.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          updatedAt: new Date(),
          messages: [...chat.messages, ...nonTemporaryMsgs],
        };
      }
      return chat;
    }));
  };
  
  const handleSelectHistory = (history: ChatHistory) => {
    setMessages(history.messages);
    setCurrentChatId(history.id);
    setIsHistoryOpen(false);
  };
  
  const handleDeleteHistory = (historyId: string) => {
    setChatHistories(prev => prev.filter(chat => chat.id !== historyId));
    
    if (currentChatId === historyId) {
      setCurrentChatId(null);
      setMessages([]);
    }
  };
  
  const handleNewChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setIsHistoryOpen(false);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header 
        onSettingsClick={() => setIsSettingsOpen(true)} 
        onHistoryClick={() => setIsHistoryOpen(true)}
      />
      
      <ChatContainer 
        messages={messages} 
        isTyping={isTyping}
        temporaryMessageTTL={settings.chat.temporaryMessageTTL}
      />
      
      <MessageInput 
        onSubmit={handleSendMessage}
        isVoiceEnabled={settings.voice.enabled}
        isVideoEnabled={settings.video.enabled}
        isListening={isListening}
        onToggleVoice={handleToggleVoice}
        onToggleVideo={handleToggleVideo}
        isLoading={isLoading}
        isTemporaryMessagesEnabled={settings.chat.temporaryMessagesEnabled}
      />
      
      <Settings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />
      
      <ChatHistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        histories={chatHistories}
        onSelectHistory={handleSelectHistory}
        onDeleteHistory={handleDeleteHistory}
        onNewChat={handleNewChat}
      />
      
      <VideoChat
        isActive={isVideoActive}
        onClose={() => setIsVideoActive(false)}
      />
    </div>
  );
};

export default Index;

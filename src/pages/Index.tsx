import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/Header';
import ChatContainer from '@/components/ChatContainer';
import MessageInput from '@/components/MessageInput';
import Settings from '@/components/Settings';
import ChatHistoryDrawer from '@/components/ChatHistoryDrawer';
import VideoChat from '@/components/VideoChat';
import ScreenShare from '@/components/ScreenShare';
import VoiceChat from '@/components/VoiceChat';
import { Message, AISettings, ChatHistory } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Improved AI response generation with more realistic content
const getAIResponse = async (message: string, fileUrl?: string): Promise<string> => {
  // In a real app, this would call an AI API
  return new Promise((resolve) => {
    setTimeout(() => {
      if (fileUrl) {
        resolve(`I've analyzed the image you shared. It appears to be a photograph containing visual elements that I can process. Would you like me to describe specific details about it or answer questions related to what's shown in the image?`);
      } else if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
        resolve(`Hello! I'm your Vision AI Assistant. How can I help you today? You can ask me questions, share images for analysis, or start a voice or video conversation.`);
      } else if (message.toLowerCase().includes('help')) {
        resolve(`I'm here to assist you with various tasks. You can:
- Ask me questions on any topic
- Share images for analysis and description
- Start a voice conversation using the microphone button
- Begin a video chat with the video button
- Share your screen using the screen share feature
- Use temporary messages that will disappear after a set time
- Browse your chat history using the history button
- Customize my settings with the settings button`);
      } else if (message.toLowerCase().includes('weather')) {
        resolve(`I don't have real-time weather data, but I'd be happy to help you find a weather forecast if you tell me your location. Alternatively, you could use a weather app or website for the most current information.`);
      } else if (message.toLowerCase().includes('joke')) {
        resolve(`Why don't scientists trust atoms? Because they make up everything! How can I assist you further today?`);
      } else if (message.toLowerCase().includes('video')) {
        resolve(`You can start a video chat by clicking the video camera icon at the bottom of the chat. This will open our video interface where we can communicate face-to-face.`);
      } else if (message.toLowerCase().includes('screen')) {
        resolve(`I see you're interested in screen sharing. You can click the screen share icon in the input area to share your screen. This is useful if you want to show me something on your display or get assistance with something visible on your screen.`);
      } else if (message.toLowerCase().includes('voice')) {
        resolve(`Voice communication is available by clicking the microphone icon. Once activated, you can speak naturally and I'll convert your speech to text and respond accordingly.`);
      } else {
        const responses = [
          "I understand your question about that. Based on my knowledge, I can provide the following insights...",
          "That's an interesting inquiry. Here's what I can tell you about this topic...",
          "Thank you for your question. From my analysis, I would suggest considering these points...",
          "I've processed your request and can offer these observations and recommendations...",
          "Based on the information you've provided, here's my assessment of the situation..."
        ];
        resolve(responses[Math.floor(Math.random() * responses.length)]);
      }
    }, 1500);
  });
};

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

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isVideoActive, setIsVideoActive] = useState(false);
  const [isScreenShareActive, setIsScreenShareActive] = useState(false);
  const [isVoiceChatActive, setIsVoiceChatActive] = useState(false);
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
        const now = new Date();
        setMessages(prevMessages => prevMessages.filter(msg => {
          if (!msg.temporary) return true;
          
          const expirationTime = new Date(msg.timestamp);
          expirationTime.setMinutes(expirationTime.getMinutes() + settings.chat.temporaryMessageTTL);
          return now < expirationTime;
        }));
      }, 30000); // Check every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [settings.chat.temporaryMessagesEnabled, settings.chat.temporaryMessageTTL]);

  const handleSettingsChange = (newSettings: AISettings) => {
    setSettings(newSettings);
    toast({
      title: "Settings updated",
      description: "Your preferences have been saved",
    });
  };

  const toggleTemporaryMode = () => {
    setSettings(prev => ({
      ...prev,
      chat: {
        ...prev.chat,
        temporaryMessagesEnabled: !prev.chat.temporaryMessagesEnabled
      }
    }));
    
    toast({
      title: settings.chat.temporaryMessagesEnabled ? 
        "Temporary messages disabled" : 
        "Temporary messages enabled",
      description: settings.chat.temporaryMessagesEnabled ? 
        "Messages will now be permanent" : 
        `Messages will disappear after ${settings.chat.temporaryMessageTTL} minutes`,
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

  const handleVoiceMessage = (message: string) => {
    handleSendMessage(message);
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
  
  const handleToggleScreenShare = () => {
    setIsScreenShareActive(prev => !prev);
    
    if (!isScreenShareActive) {
      toast({
        title: "Screen sharing initiated",
        description: "Share your screen to get visual assistance",
      });
    }
  };
  
  const handleToggleVoiceChat = () => {
    setIsVoiceChatActive(prev => !prev);
    
    if (!isVoiceChatActive) {
      toast({
        title: "Voice chat initiated",
        description: "Start speaking to communicate with the AI",
      });
    } else {
      toast({
        title: "Voice chat ended",
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
        onTemporaryModeClick={toggleTemporaryMode}
        isTemporaryModeActive={settings.chat.temporaryMessagesEnabled}
        onVoiceChatClick={handleToggleVoiceChat}
        isVoiceChatActive={isVoiceChatActive}
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
        onToggleScreenShare={handleToggleScreenShare}
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
      
      <ScreenShare
        isActive={isScreenShareActive}
        onClose={() => setIsScreenShareActive(false)}
      />
      
      <VoiceChat
        isActive={isVoiceChatActive}
        onClose={() => setIsVoiceChatActive(false)}
        onSendVoiceMessage={handleVoiceMessage}
      />
    </div>
  );
};

export default Index;

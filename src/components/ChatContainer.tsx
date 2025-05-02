
import React, { useRef, useEffect } from 'react';
import ChatMessage from './ChatMessage';
import { Message } from '@/types';
import { Bot } from 'lucide-react';

interface ChatContainerProps {
  messages: Message[];
  isTyping: boolean;
  temporaryMessageTTL?: number;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ 
  messages, 
  isTyping, 
  temporaryMessageTTL = 5 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute w-16 h-16 rounded-full bg-primary/20 pulse-effect"></div>
          </div>
          <h2 className="text-xl font-medium text-center mb-2">Vision AI Assistant</h2>
          <p className="text-muted-foreground text-center max-w-md">
            Your AI assistant with text, voice, vision, and video capabilities. Ask me anything!
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage 
              key={message.id} 
              message={message}
              temporaryMessageTTL={temporaryMessageTTL}
            />
          ))}
          
          {isTyping && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div className="bg-card border border-border/50 p-4 rounded-xl inline-flex items-center typing-indicator">
                <span className="w-2 h-2 bg-primary/60 rounded-full mx-0.5"></span>
                <span className="w-2 h-2 bg-primary/60 rounded-full mx-0.5"></span>
                <span className="w-2 h-2 bg-primary/60 rounded-full mx-0.5"></span>
              </div>
            </div>
          )}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatContainer;

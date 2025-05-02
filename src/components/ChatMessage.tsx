
import React, { useEffect, useState } from 'react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { User, Bot, Clock } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
  temporaryMessageTTL?: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, temporaryMessageTTL = 5 }) => {
  const isUser = message.role === 'user';
  const [timeLeft, setTimeLeft] = useState<number | null>(
    message.temporary ? temporaryMessageTTL * 60 : null
  );
  
  useEffect(() => {
    if (message.temporary && timeLeft !== null && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev !== null ? prev - 1 : null);
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [message.temporary, timeLeft]);
  
  // Format time left into minutes:seconds
  const formatTimeLeft = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (timeLeft === 0) {
    return null; // Don't render the message if time has expired
  }

  return (
    <div className={cn(
      "flex gap-3 w-full animate-fadeInUp",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
          <Bot className="w-5 h-5 text-primary" />
        </div>
      )}
      
      <Card className={cn(
        "p-4 max-w-[80%] text-sm shadow-md rounded-xl",
        isUser 
          ? "bg-primary/20 border-primary/30 text-foreground" 
          : "bg-card border-border/50",
        message.temporary && "border-secondary/30"
      )}>
        {message.fileUrl && (
          <div className="mb-3">
            <img 
              src={message.fileUrl} 
              alt="Uploaded" 
              className="rounded-lg max-h-52 object-contain"
            />
          </div>
        )}
        
        <div className="whitespace-pre-wrap">{message.content}</div>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <span>{new Date(message.timestamp).toLocaleTimeString()}</span>
          
          {message.temporary && timeLeft !== null && (
            <div className="flex items-center gap-1 text-secondary">
              <Clock className="h-3 w-3" />
              <span>{formatTimeLeft(timeLeft)}</span>
            </div>
          )}
        </div>
      </Card>

      {isUser && (
        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center flex-shrink-0 mt-1">
          <User className="w-5 h-5 text-secondary" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

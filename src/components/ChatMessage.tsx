
import React from 'react';
import { Message } from '@/types';
import { cn } from '@/lib/utils';
import { Card } from './ui/card';
import { User, Bot } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

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
          : "bg-card border-border/50"
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
        
        <div className="text-xs text-muted-foreground mt-2">
          {new Date(message.timestamp).toLocaleTimeString()}
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

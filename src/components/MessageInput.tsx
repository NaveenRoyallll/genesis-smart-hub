
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Mic, MicOff, Send, Image, Loader2, Video, Clock, ScreenShare, Brain, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from './ui/use-toast';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

interface MessageInputProps {
  onSubmit: (message: string, file?: File | null, temporary?: boolean) => void;
  isVoiceEnabled: boolean;
  isVideoEnabled: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleVoiceChat: () => void;
  onDeepThink: (query: string) => void;
  onDeepSearch: (query: string) => void;
  isLoading: boolean;
  isTemporaryMessagesEnabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSubmit,
  isVoiceEnabled,
  isVideoEnabled,
  isListening,
  onToggleVoice,
  onToggleVideo,
  onToggleScreenShare,
  onToggleVoiceChat,
  onDeepThink,
  onDeepSearch,
  isLoading,
  isTemporaryMessagesEnabled
}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isTemporary, setIsTemporary] = useState(false);
  const [isDeepMode, setIsDeepMode] = useState<'none' | 'think' | 'search'>('none');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file",
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size should be less than 5MB",
        variant: "destructive"
      });
      return;
    }

    setSelectedFile(file);
    const preview = URL.createObjectURL(file);
    setFilePreview(preview);
  };

  const handleSubmit = () => {
    if (!message.trim() && !selectedFile) return;
    
    if (isDeepMode === 'think') {
      onDeepThink(message);
      toast({
        title: "Deep Think activated",
        description: "Processing your query with enhanced reasoning...",
      });
    } else if (isDeepMode === 'search') {
      onDeepSearch(message);
      toast({
        title: "Deep Search activated",
        description: "Searching the web for relevant information...",
      });
    } else {
      onSubmit(message, selectedFile, isTemporaryMessagesEnabled && isTemporary);
    }
    
    setMessage('');
    setSelectedFile(null);
    setFilePreview(null);
    setIsTemporary(false);
    setIsDeepMode('none');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDeepThink = () => {
    setIsDeepMode(prev => prev === 'think' ? 'none' : 'think');
    if (isDeepMode !== 'think') {
      toast({
        title: "Deep Think mode enabled",
        description: "Your next message will use advanced reasoning"
      });
    } else {
      toast({
        title: "Deep Think mode disabled",
        description: "Returned to standard mode"
      });
    }
  };

  const handleDeepSearch = () => {
    setIsDeepMode(prev => prev === 'search' ? 'none' : 'search');
    if (isDeepMode !== 'search') {
      toast({
        title: "Deep Search mode enabled",
        description: "Your next message will search the web"
      });
    } else {
      toast({
        title: "Deep Search mode disabled",
        description: "Returned to standard mode"
      });
    }
  };

  return (
    <div className="p-4 border-t border-border/40 bg-background">
      {filePreview && (
        <div className="mb-3 relative">
          <img src={filePreview} alt="Preview" className="h-20 rounded-md object-contain" />
          <Button 
            variant="destructive" 
            size="sm" 
            className="absolute top-0 right-0 h-6 w-6 p-0" 
            onClick={clearImage}
          >
            ✕
          </Button>
        </div>
      )}
      
      <div className="flex items-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          className="bg-muted/50 border-border/30 text-muted-foreground hover:text-foreground"
        >
          <Image className="h-5 w-5" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onToggleVoiceChat}
                className="bg-muted/50 border-border/30 text-muted-foreground hover:text-foreground"
              >
                <Mic className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Start voice chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onToggleVideo}
                className={cn(
                  "bg-muted/50 border-border/30 text-muted-foreground hover:text-foreground",
                  !isVideoEnabled && "opacity-50"
                )}
                disabled={!isVideoEnabled}
              >
                <Video className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isVideoEnabled ? "Start video chat" : "Enable video in settings"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onToggleScreenShare}
                className="bg-muted/50 border-border/30 text-muted-foreground hover:text-foreground"
              >
                <ScreenShare className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Share your screen
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isDeepMode === 'think' ? "secondary" : "outline"}
                size="icon"
                onClick={handleDeepThink}
                className={cn(
                  "bg-muted/50 border-border/30 text-muted-foreground hover:text-foreground",
                  isDeepMode === 'think' && "text-secondary"
                )}
              >
                <Brain className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isDeepMode === 'think' ? "Disable Deep Think" : "Enable Deep Think"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                variant={isDeepMode === 'search' ? "secondary" : "outline"}
                size="icon"
                onClick={handleDeepSearch}
                className={cn(
                  "bg-muted/50 border-border/30 text-muted-foreground hover:text-foreground",
                  isDeepMode === 'search' && "text-secondary"
                )}
              >
                <Search className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isDeepMode === 'search' ? "Disable Deep Search" : "Enable Deep Search"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={isDeepMode === 'think' 
              ? "Ask a question that needs deep reasoning..." 
              : isDeepMode === 'search' 
                ? "Search for information on the web..." 
                : "Send a message..."}
            className="min-h-[50px] max-h-[200px] pr-24 resize-none bg-muted/50 border-border/30"
            disabled={isLoading}
          />
          
          {isTemporaryMessagesEnabled && (
            <div className="absolute top-2 right-24 flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <Switch 
                checked={isTemporary}
                onCheckedChange={setIsTemporary}
              />
            </div>
          )}
          
          <div className="absolute bottom-2 right-2 flex gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className={cn(
                "h-8 w-8 bg-muted/70 border border-border/30",
                isListening && "animate-pulse bg-secondary/30 border-secondary/40"
              )}
              onClick={onToggleVoice}
              disabled={!isVoiceEnabled}
            >
              {isListening ? <Mic className="h-4 w-4 text-secondary" /> : <MicOff className="h-4 w-4" />}
            </Button>
            
            <Button
              size="icon"
              className="h-8 w-8 bg-primary text-primary-foreground hover:bg-primary/80"
              onClick={handleSubmit}
              disabled={isLoading || (!message.trim() && !selectedFile)}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;

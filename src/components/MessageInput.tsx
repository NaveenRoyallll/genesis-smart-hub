
import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Mic, MicOff, Send, Image, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from './ui/use-toast';

interface MessageInputProps {
  onSubmit: (message: string, file?: File | null) => void;
  isVoiceEnabled: boolean;
  isListening: boolean;
  onToggleVoice: () => void;
  isLoading: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
  onSubmit,
  isVoiceEnabled,
  isListening,
  onToggleVoice,
  isLoading
}) => {
  const [message, setMessage] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
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
    onSubmit(message, selectedFile);
    setMessage('');
    setSelectedFile(null);
    setFilePreview(null);
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
        
        <div className="relative flex-1">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="min-h-[50px] max-h-[200px] pr-24 resize-none bg-muted/50 border-border/30"
            disabled={isLoading}
          />
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

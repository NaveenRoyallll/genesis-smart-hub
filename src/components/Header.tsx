
import React from 'react';
import { Settings, Sparkles, History, Clock, Mic } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onSettingsClick: () => void;
  onHistoryClick: () => void;
  onTemporaryModeClick: () => void;
  isTemporaryModeActive: boolean;
  onVoiceChatClick: () => void;
  isVoiceChatActive: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onSettingsClick, 
  onHistoryClick, 
  onTemporaryModeClick,
  isTemporaryModeActive,
  onVoiceChatClick,
  isVoiceChatActive
}) => {
  return (
    <header className="flex items-center justify-between p-4 border-b border-border/40 bg-muted/10">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shadow-md">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="absolute inset-0 w-10 h-10 rounded-full bg-primary/30 pulse-effect"></div>
        </div>
        <h1 className="text-xl font-semibold text-primary">Vision AI Assistant</h1>
      </div>
      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={onVoiceChatClick}
                className={cn(
                  "rounded-full w-9 h-9 bg-muted/50 border-border/30 hover:bg-muted/80", 
                  isVoiceChatActive && "text-secondary bg-secondary/10 border-secondary/30"
                )}
              >
                <Mic className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isVoiceChatActive ? "Voice chat active" : "Start voice chat"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="icon"
                onClick={onTemporaryModeClick}
                className={cn(
                  "rounded-full w-9 h-9 bg-muted/50 border-border/30 hover:bg-muted/80", 
                  isTemporaryModeActive && "text-secondary bg-secondary/10 border-secondary/30"
                )}
              >
                <Clock className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isTemporaryModeActive ? "Temporary messages enabled" : "Enable temporary messages"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="outline" 
          size="icon"
          onClick={onHistoryClick}
          className="rounded-full w-9 h-9 bg-muted/50 border-border/30 hover:bg-muted/80"
        >
          <History className="w-4 h-4" />
        </Button>

        <Button 
          variant="outline" 
          size="icon"
          onClick={onSettingsClick}
          className="rounded-full w-9 h-9 bg-muted/50 border-border/30 hover:bg-muted/80"
        >
          <Settings className="w-4 h-4" />
        </Button>
      </div>
    </header>
  );
};

export default Header;

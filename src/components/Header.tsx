
import React from 'react';
import { Settings, Sparkles, History, Clock, Mic, CreditCard } from 'lucide-react';
import { Button } from './ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { cn } from '@/lib/utils';
import { ThemeToggle } from './ThemeToggle';
import { Link } from 'react-router-dom';

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
    <header className="flex items-center justify-between p-4 border-b border-border/40">
      <div className="flex items-center gap-2">
        <div className="relative">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div className="absolute inset-0 w-8 h-8 rounded-full bg-primary/30 pulse-effect"></div>
        </div>
        <h1 className="text-xl font-semibold text-primary">Vision AI Assistant</h1>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={onVoiceChatClick}
                className={cn("text-muted-foreground hover:text-foreground", 
                  isVoiceChatActive && "text-secondary bg-secondary/10")}
              >
                <Mic className="w-5 h-5" />
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
                variant="ghost" 
                size="icon"
                onClick={onTemporaryModeClick}
                className={cn("text-muted-foreground hover:text-foreground", 
                  isTemporaryModeActive && "text-secondary bg-secondary/10")}
              >
                <Clock className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isTemporaryModeActive ? "Temporary messages enabled" : "Enable temporary messages"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onHistoryClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <History className="w-5 h-5" />
        </Button>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/billing">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <CreditCard className="w-5 h-5" />
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              Billing & Subscription
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSettingsClick}
          className="text-muted-foreground hover:text-foreground relative"
        >
          <Settings className="w-5 h-5" />
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-primary rounded-full"></span>
        </Button>
      </div>
    </header>
  );
};

export default Header;

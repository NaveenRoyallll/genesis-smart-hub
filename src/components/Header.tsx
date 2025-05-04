
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
    <header className="flex items-center justify-between p-4 border-b border-border/10 bg-background">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="mr-2">
          <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
            <div className="bg-gray-800 rounded-sm"></div>
            <div className="bg-gray-800 rounded-sm"></div>
            <div className="bg-gray-800 rounded-sm"></div>
            <div className="bg-gray-800 rounded-sm"></div>
          </div>
        </Button>
        
        <div className="flex items-center">
          <h1 className="text-lg font-semibold">Vision AI Assistant</h1>
          <Button variant="ghost" className="ml-1 p-1">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
      </div>
      
      <div className="flex items-center">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="text-muted-foreground hover:text-foreground rounded-full"
              >
                <Clock className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              Temporary messages
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center ml-2">
          <div className="rounded-full w-8 h-8 bg-blue-500 flex items-center justify-center text-white font-medium">
            NK
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

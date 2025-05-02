
import React from 'react';
import { Settings, Sparkles, History } from 'lucide-react';
import { Button } from './ui/button';

interface HeaderProps {
  onSettingsClick: () => void;
  onHistoryClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onSettingsClick, onHistoryClick }) => {
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
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onHistoryClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <History className="w-5 h-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onSettingsClick}
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};

export default Header;

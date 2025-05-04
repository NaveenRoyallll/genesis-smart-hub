
import React from 'react';
import { 
  Brain, 
  Search, 
  Mic, 
  ScreenShare as Monitor, 
  Image,
  Video, 
  File,
  Layers3,
  Link,
  Globe,
  Settings
} from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from './ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface FeatureMenuProps {
  onVoiceChatClick: () => void;
  onScreenShareClick: () => void;
  onDeepThinkClick: () => void;
  onDeepSearchClick: () => void;
  onNoteTakingClick: () => void;
  onGenerateImageClick: () => void;
  onGenerateVideoClick: () => void;
  onGeneratePDFClick: () => void;
  onToolIntegrationClick: () => void;
  activeFeature: string | null;
}

const FeatureMenu: React.FC<FeatureMenuProps> = ({
  onVoiceChatClick,
  onScreenShareClick,
  onDeepThinkClick,
  onDeepSearchClick,
  onNoteTakingClick,
  onGenerateImageClick,
  onGenerateVideoClick,
  onGeneratePDFClick,
  onToolIntegrationClick,
  activeFeature
}) => {
  const primaryFeatures = [
    { 
      name: 'search', 
      icon: Search, 
      tooltip: 'Search', 
      onClick: onDeepSearchClick 
    },
    { 
      name: 'reason', 
      icon: Brain, 
      tooltip: 'Reason', 
      onClick: onDeepThinkClick 
    },
    {
      name: 'deep-search',
      icon: Globe,
      tooltip: 'Deep Research',
      onClick: onDeepSearchClick
    },
    {
      name: 'generate-image',
      icon: Image,
      tooltip: 'Create Image',
      onClick: onGenerateImageClick
    },
    { 
      name: 'tool-integration', 
      icon: Link, 
      tooltip: 'Tool Integration', 
      onClick: onToolIntegrationClick 
    },
  ];

  return (
    <div className="flex items-center justify-between w-full gap-2 mb-2">
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9"
        >
          <span className="text-lg">+</span>
        </Button>
      </div>
      
      <div className="flex items-center gap-1">
        {primaryFeatures.map((feature) => (
          <TooltipProvider key={feature.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFeature === feature.name ? "secondary" : "ghost"}
                  size="icon"
                  onClick={feature.onClick}
                  className={cn(
                    "rounded-full w-9 h-9 bg-muted/20",
                    activeFeature === feature.name && "bg-secondary/10"
                  )}
                >
                  <feature.icon className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {feature.tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>
      
      <div className="flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full w-9 h-9"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default FeatureMenu;

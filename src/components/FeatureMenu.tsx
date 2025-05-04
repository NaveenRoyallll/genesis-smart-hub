
import React from 'react';
import { 
  Brain, 
  Search, 
  Mic, 
  ScreenShare as Monitor, 
  Image,
  Video, 
  FileText,
  File,
  Layers3,
  Link,
  Share2
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
      name: 'voice-chat', 
      icon: Mic, 
      tooltip: 'Voice Chat', 
      onClick: onVoiceChatClick 
    },
    { 
      name: 'screen-share', 
      icon: Monitor, 
      tooltip: 'Screen Share', 
      onClick: onScreenShareClick 
    },
    { 
      name: 'deep-think', 
      icon: Brain, 
      tooltip: 'Deep Think', 
      onClick: onDeepThinkClick 
    },
    { 
      name: 'deep-search', 
      icon: Search, 
      tooltip: 'Deep Search', 
      onClick: onDeepSearchClick 
    },
    { 
      name: 'note-taking', 
      icon: FileText, 
      tooltip: 'Note Taking', 
      onClick: onNoteTakingClick 
    },
    { 
      name: 'tool-integration', 
      icon: Link, 
      tooltip: 'Tool Integration', 
      onClick: onToolIntegrationClick 
    },
  ];

  return (
    <div className="flex flex-col gap-3 py-2">
      <div className="flex flex-wrap items-center justify-center gap-3">
        {primaryFeatures.map((feature) => (
          <TooltipProvider key={feature.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={feature.onClick}
                  className={cn(
                    "rounded-full w-11 h-11 bg-gradient-to-br shadow-md transition-all duration-300",
                    activeFeature === feature.name
                      ? "from-primary/80 to-primary text-white shadow-primary/25"
                      : "from-muted/60 to-muted/90 text-muted-foreground hover:text-foreground hover:shadow-lg hover:scale-105"
                  )}
                >
                  <feature.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                {feature.tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}

        <DropdownMenu>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full w-11 h-11 bg-gradient-to-br from-secondary/80 to-secondary/90 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <Layers3 className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="font-medium">
                Generate Content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end" className="w-56 rounded-lg shadow-lg border-border/50">
            <DropdownMenuItem onClick={onGenerateImageClick} className="cursor-pointer py-2">
              <Image className="mr-3 h-4 w-4" />
              <span>Generate Image</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGenerateVideoClick} className="cursor-pointer py-2">
              <Video className="mr-3 h-4 w-4" />
              <span>Generate Video</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGeneratePDFClick} className="cursor-pointer py-2">
              <File className="mr-3 h-4 w-4" />
              <span>Generate PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FeatureMenu;

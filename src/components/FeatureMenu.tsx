
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
  Link
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
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-2">
        {primaryFeatures.map((feature) => (
          <TooltipProvider key={feature.name}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={activeFeature === feature.name ? "secondary" : "outline"}
                  size="icon"
                  onClick={feature.onClick}
                  className={cn(
                    "bg-muted/50 border-border/30 text-muted-foreground hover:text-foreground",
                    activeFeature === feature.name && "text-secondary bg-secondary/10"
                  )}
                >
                  <feature.icon className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
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
                    className="bg-muted/50 border-border/30 text-muted-foreground hover:text-foreground"
                  >
                    <Layers3 className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
              </TooltipTrigger>
              <TooltipContent>
                Generate Content
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onGenerateImageClick}>
              <Image className="mr-2 h-4 w-4" />
              <span>Generate Image</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGenerateVideoClick}>
              <Video className="mr-2 h-4 w-4" />
              <span>Generate Video</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onGeneratePDFClick}>
              <File className="mr-2 h-4 w-4" />
              <span>Generate PDF</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default FeatureMenu;

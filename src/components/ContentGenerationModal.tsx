import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Loader2, Image, Video, File } from 'lucide-react';
import { ContentType, generateContent } from '@/utils/contentGenerator';
import { useToast } from './ui/use-toast';

interface ContentGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  contentType: ContentType;
}

const ContentGenerationModal: React.FC<ContentGenerationModalProps> = ({ 
  isOpen, 
  onClose, 
  contentType 
}) => {
  const [prompt, setPrompt] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const content = await generateContent({
        prompt,
        type: contentType,
      });
      
      setGeneratedContent(content);
      toast({
        title: "Content generated",
        description: `Your ${contentType} has been generated successfully`,
      });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: `Failed to generate ${contentType}`,
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const getIcon = () => {
    switch (contentType) {
      case 'image':
        return <Image className="h-5 w-5" />;
      case 'video':
        return <Video className="h-5 w-5" />;
      case 'pdf':
        return <File className="h-5 w-5" />;
    }
  };

  const getTitle = () => {
    return `Generate ${contentType.charAt(0).toUpperCase() + contentType.slice(1)}`;
  };

  const handleClose = () => {
    setPrompt('');
    setGeneratedContent(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getIcon()}
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={`Describe the ${contentType} you want to generate...`}
            className="min-h-[100px] resize-none"
            disabled={isGenerating}
          />
          
          {generatedContent && (
            <div className="mt-4 p-3 bg-muted rounded-md">
              <p className="text-sm font-medium mb-2">Generated Content:</p>
              {contentType === 'image' ? (
                <div className="aspect-video bg-muted/50 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Image would be displayed here</p>
                </div>
              ) : contentType === 'video' ? (
                <div className="aspect-video bg-muted/50 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Video would be played here</p>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <File className="h-5 w-5" />
                  <p className="text-sm truncate">Generated PDF document</p>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">{generatedContent}</p>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>Generate</>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ContentGenerationModal;

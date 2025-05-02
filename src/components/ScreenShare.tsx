
import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Monitor, StopCircle } from 'lucide-react';

interface ScreenShareProps {
  isActive: boolean;
  onClose: () => void;
}

const ScreenShare: React.FC<ScreenShareProps> = ({ isActive, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  
  useEffect(() => {
    // Clean up function to stop screen sharing when component unmounts
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaStream]);
  
  const startScreenShare = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true,
        audio: true 
      });
      
      setMediaStream(stream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      setIsSharing(true);
      setIsLoading(false);
      
      // Handle stream ending (user stops sharing)
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };
    } catch (error) {
      console.error("Error starting screen share:", error);
      setIsLoading(false);
    }
  };
  
  const stopScreenShare = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsSharing(false);
  };
  
  if (!isActive) return null;
  
  return (
    <div className="fixed top-20 right-5 rounded-lg shadow-lg overflow-hidden bg-card border border-border/40 w-64">
      <div className="relative">
        {isLoading && !isSharing && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {isSharing ? (
          <video 
            ref={videoRef} 
            autoPlay 
            className="w-64 h-48 object-contain"
          />
        ) : (
          <div className="w-64 h-48 bg-muted/30 flex flex-col items-center justify-center gap-3 p-4">
            <Monitor className="h-12 w-12 text-muted-foreground/50" />
            <p className="text-sm text-center text-muted-foreground">
              Share your screen with the AI assistant
            </p>
            <Button 
              variant="default"
              size="sm"
              onClick={startScreenShare}
              className="mt-2"
            >
              Start Sharing
            </Button>
          </div>
        )}
        
        {isSharing && (
          <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between bg-muted/80">
            <p className="text-xs text-muted-foreground">Sharing screen</p>
            <Button 
              size="sm"
              variant="destructive"
              className="h-8"
              onClick={() => {
                stopScreenShare();
                onClose();
              }}
            >
              Stop
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScreenShare;


import React, { useRef, useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Loader2, Video, VideoOff } from 'lucide-react';

interface VideoChatProps {
  isActive: boolean;
  onClose: () => void;
}

const VideoChat: React.FC<VideoChatProps> = ({ isActive, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  
  useEffect(() => {
    let mediaStream: MediaStream | null = null;
    
    const setupVideo = async () => {
      if (isActive && isVideoOn) {
        try {
          setIsLoading(true);
          mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
          
          if (videoRef.current) {
            videoRef.current.srcObject = mediaStream;
          }
        } catch (error) {
          console.error("Error accessing camera:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    setupVideo();
    
    return () => {
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isActive, isVideoOn]);
  
  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
  };
  
  if (!isActive) return null;
  
  return (
    <div className="fixed top-20 right-5 rounded-lg shadow-lg overflow-hidden bg-card border border-border/40 w-64">
      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-card/80">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        
        {isVideoOn ? (
          <video 
            ref={videoRef} 
            autoPlay 
            className="w-64 h-48 object-cover"
          />
        ) : (
          <div className="w-64 h-48 bg-muted/30 flex items-center justify-center">
            <VideoOff className="h-12 w-12 text-muted-foreground/50" />
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 p-2 flex items-center justify-between bg-muted/80">
          <Button 
            size="icon"
            variant={isVideoOn ? "outline" : "default"}
            className="h-8 w-8 bg-muted/70"
            onClick={toggleVideo}
          >
            {isVideoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
          </Button>
          
          <Button 
            size="sm"
            variant="destructive"
            className="h-8"
            onClick={onClose}
          >
            End
          </Button>
        </div>
      </div>
    </div>
  );
};

export default VideoChat;

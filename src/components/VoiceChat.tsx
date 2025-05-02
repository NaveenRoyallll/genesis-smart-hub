
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Mic, MicOff, Loader2, Volume2, VolumeX } from 'lucide-react';

interface VoiceChatProps {
  isActive: boolean;
  onClose: () => void;
  onSendVoiceMessage?: (message: string) => void;
}

const VoiceChat: React.FC<VoiceChatProps> = ({ 
  isActive, 
  onClose,
  onSendVoiceMessage 
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  
  useEffect(() => {
    // Clean up function
    return () => {
      if (audioStream) {
        audioStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [audioStream]);

  const startListening = async () => {
    try {
      setIsLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setAudioStream(stream);
      setIsListening(true);
      setIsLoading(false);
      
      // In a real app, we would connect to a speech recognition service here
      // This is a simplified simulation of voice recognition
      setTimeout(() => {
        if (isListening) {
          const simulatedText = "This is a simulated voice message from the user.";
          setTranscript(simulatedText);
          
          if (onSendVoiceMessage) {
            onSendVoiceMessage(simulatedText);
          }
        }
      }, 5000);
      
    } catch (error) {
      console.error("Error accessing microphone:", error);
      setIsLoading(false);
    }
  };
  
  const stopListening = () => {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop());
      setAudioStream(null);
    }
    setIsListening(false);
  };
  
  const toggleMute = () => {
    if (audioStream) {
      audioStream.getAudioTracks().forEach(track => {
        track.enabled = isMuted;
      });
      setIsMuted(!isMuted);
    }
  };
  
  if (!isActive) return null;
  
  return (
    <div className="fixed bottom-20 right-5 rounded-lg shadow-lg bg-card border border-border/40 w-64 p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-medium">Voice Chat</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          ✕
        </Button>
      </div>
      
      <div className="flex flex-col items-center gap-3 py-2">
        <div className={`w-16 h-16 rounded-full flex items-center justify-center ${isListening ? 'animate-pulse bg-primary/20' : 'bg-muted'}`}>
          {isLoading ? (
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          ) : (
            isListening ? (
              <Mic className="h-8 w-8 text-primary" />
            ) : (
              <MicOff className="h-8 w-8 text-muted-foreground" />
            )
          )}
        </div>
        
        {transcript && (
          <div className="w-full p-2 bg-muted/50 rounded text-xs">
            <p className="text-muted-foreground">{transcript}</p>
          </div>
        )}
        
        <div className="flex gap-2 mt-2">
          {isListening ? (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleMute}
                className="flex items-center gap-1"
              >
                {isMuted ? (
                  <>
                    <VolumeX className="h-4 w-4" />
                    <span>Unmute</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="h-4 w-4" />
                    <span>Mute</span>
                  </>
                )}
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={stopListening}
              >
                Stop
              </Button>
            </>
          ) : (
            <Button
              variant="default"
              onClick={startListening}
              disabled={isLoading}
            >
              Start Voice Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default VoiceChat;

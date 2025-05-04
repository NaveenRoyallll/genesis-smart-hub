import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AISettings } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { hasGeminiApiKey } from '@/utils/geminiApi';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AISettings;
  onSettingsChange: (settings: AISettings) => void;
}

interface VoiceOption {
  id: string;
  name: string;
}

// Voice options from ElevenLabs popular voices
const voiceOptions: VoiceOption[] = [
  { id: '9BWtsMINqrJLrRacOk9x', name: 'Aria (Female)' },
  { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger (Male)' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah (Female)' },
  { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie (Male)' },
  { id: 'onwK4e9ZLuTAKqWW03F9', name: 'Daniel (Male)' },
  { id: 'XB0fDUnXU5powFXDhCwa', name: 'Charlotte (Female)' },
];

const LOCAL_STORAGE_KEY = 'gemini_api_key';

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [tempSettings, setTempSettings] = useState<AISettings>({ ...settings });
  const [geminiApiKey, setGeminiApiKey] = useState<string>('');
  const [isApiKeyVisible, setIsApiKeyVisible] = useState<boolean>(false);
  const { toast } = useToast();

  // Load Gemini API key from localStorage when component mounts
  useEffect(() => {
    const savedApiKey = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedApiKey) {
      setGeminiApiKey(savedApiKey);
    }
  }, []);

  const handleSave = () => {
    onSettingsChange(tempSettings);
    
    // Save Gemini API key to localStorage if it exists
    if (geminiApiKey.trim()) {
      localStorage.setItem(LOCAL_STORAGE_KEY, geminiApiKey);
      toast({
        title: "API Key Saved",
        description: "Your Gemini API key has been saved securely"
      });
    }
    
    onClose();
  };

  const handleVoiceToggle = (enabled: boolean) => {
    setTempSettings({
      ...tempSettings,
      voice: {
        ...tempSettings.voice,
        enabled
      }
    });
  };

  const handleVoiceChange = (voiceId: string) => {
    setTempSettings({
      ...tempSettings,
      voice: {
        ...tempSettings.voice,
        voiceId
      }
    });
  };

  const handleVolumeChange = (volume: number[]) => {
    setTempSettings({
      ...tempSettings,
      voice: {
        ...tempSettings.voice,
        volume: volume[0]
      }
    });
  };

  const handleVisionToggle = (enabled: boolean) => {
    setTempSettings({
      ...tempSettings,
      vision: {
        ...tempSettings.vision,
        enabled
      }
    });
  };
  
  const handleVideoToggle = (enabled: boolean) => {
    setTempSettings({
      ...tempSettings,
      video: {
        ...tempSettings.video,
        enabled
      }
    });
  };
  
  const handleTemporaryMessagesToggle = (enabled: boolean) => {
    setTempSettings({
      ...tempSettings,
      chat: {
        ...tempSettings.chat,
        temporaryMessagesEnabled: enabled
      }
    });
  };
  
  const handleTemporaryMessageTTLChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const ttl = parseInt(e.target.value);
    if (!isNaN(ttl) && ttl > 0) {
      setTempSettings({
        ...tempSettings,
        chat: {
          ...tempSettings.chat,
          temporaryMessageTTL: ttl
        }
      });
    }
  };

  const toggleApiKeyVisibility = () => {
    setIsApiKeyVisible(!isApiKeyVisible);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary">Assistant Settings</DialogTitle>
          <DialogDescription>
            Configure your AI assistant preferences
          </DialogDescription>
          {!hasGeminiApiKey() && (
            <div className="mt-2 p-2 bg-amber-100 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-700 rounded-md text-sm text-amber-800 dark:text-amber-200">
              <strong>Important:</strong> Add your Google Gemini API key in the API tab to enable AI functionality.
            </div>
          )}
        </DialogHeader>
        
        <Tabs defaultValue={hasGeminiApiKey() ? "communication" : "api"}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="chat">Chat Options</TabsTrigger>
            <TabsTrigger value="api">API Keys</TabsTrigger>
          </TabsList>
          
          <TabsContent value="communication" className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium">Voice Communication</h3>
                  <p className="text-xs text-muted-foreground">Enable voice input and output</p>
                </div>
                <Switch 
                  checked={tempSettings.voice.enabled}
                  onCheckedChange={handleVoiceToggle}
                />
              </div>
              
              {tempSettings.voice.enabled && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="voice-select">Assistant Voice</Label>
                    <Select 
                      value={tempSettings.voice.voiceId}
                      onValueChange={handleVoiceChange}
                    >
                      <SelectTrigger id="voice-select" className="bg-muted/50">
                        <SelectValue placeholder="Select voice" />
                      </SelectTrigger>
                      <SelectContent>
                        {voiceOptions.map(voice => (
                          <SelectItem key={voice.id} value={voice.id}>
                            {voice.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="volume-slider">Voice Volume</Label>
                      <span className="text-xs text-muted-foreground">
                        {Math.round(tempSettings.voice.volume * 100)}%
                      </span>
                    </div>
                    <Slider 
                      id="volume-slider"
                      defaultValue={[tempSettings.voice.volume]}
                      max={1}
                      step={0.05}
                      onValueChange={handleVolumeChange}
                    />
                  </div>
                </>
              )}
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-sm font-medium">Vision Capabilities</h3>
                <p className="text-xs text-muted-foreground">Enable image analysis</p>
              </div>
              <Switch 
                checked={tempSettings.vision.enabled}
                onCheckedChange={handleVisionToggle}
              />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div>
                <h3 className="text-sm font-medium">Video Chat</h3>
                <p className="text-xs text-muted-foreground">Enable video communication with AI</p>
              </div>
              <Switch 
                checked={tempSettings.video.enabled}
                onCheckedChange={handleVideoToggle}
              />
            </div>
          </TabsContent>
          
          <TabsContent value="chat" className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium">Temporary Messages</h3>
                <p className="text-xs text-muted-foreground">Messages will disappear after a set time</p>
              </div>
              <Switch 
                checked={tempSettings.chat.temporaryMessagesEnabled}
                onCheckedChange={handleTemporaryMessagesToggle}
              />
            </div>
            
            {tempSettings.chat.temporaryMessagesEnabled && (
              <div className="space-y-2">
                <Label htmlFor="ttl-input">Messages expire after (minutes)</Label>
                <Input
                  id="ttl-input"
                  type="number"
                  value={tempSettings.chat.temporaryMessageTTL}
                  min={1}
                  onChange={handleTemporaryMessageTTLChange}
                  className="bg-muted/50"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="api" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="gemini-api-key" className="text-sm font-medium">
                Google Gemini API Key <span className="text-red-500">*</span>
              </Label>
              <p className="text-xs text-muted-foreground mb-2">
                Required for AI functionality. Your API key is stored locally and never sent to our servers.
              </p>
              <div className="relative">
                <Input
                  id="gemini-api-key"
                  type={isApiKeyVisible ? "text" : "password"}
                  value={geminiApiKey}
                  onChange={(e) => setGeminiApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="pr-10 bg-muted/50"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={toggleApiKeyVisibility}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  {isApiKeyVisible ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Don't have an API key? <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Get one from Google AI Studio</a>
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-border/30">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium rounded-md bg-muted hover:bg-muted/70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 text-sm font-medium rounded-md bg-primary text-primary-foreground hover:bg-primary/80"
          >
            Save Settings
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Settings;

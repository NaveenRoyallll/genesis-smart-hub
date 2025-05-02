
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AISettings } from '@/types';

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

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [tempSettings, setTempSettings] = useState<AISettings>({ ...settings });

  const handleSave = () => {
    onSettingsChange(tempSettings);
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary">Assistant Settings</DialogTitle>
          <DialogDescription>
            Configure your AI assistant preferences
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
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
        </div>
        
        <div className="flex justify-end gap-3">
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

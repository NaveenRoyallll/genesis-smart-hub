
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { AISettings } from '@/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Input } from './ui/input';
import { CreditCard, Shield, Lock } from 'lucide-react';
import { Button } from './ui/button';

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

interface Plan {
  id: string;
  name: string;
  price: string;
  features: string[];
  popular?: boolean;
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

// Subscription plans
const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0/month',
    features: [
      'Basic text conversations',
      'Limited vision capabilities',
      'Standard response speed',
      '50 messages per day'
    ]
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$8/month',
    features: [
      'Advanced text conversations',
      'Enhanced vision capabilities',
      'Faster response speed',
      '100 messages per day',
      'Voice chat support',
      'Priority access during peak times'
    ],
    popular: true
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$20/month',
    features: [
      'All Plus features',
      'Unlimited messages',
      'Highest quality responses',
      'Video chat support',
      'Screen sharing assistance',
      'Advanced tool integration',
      'Dedicated support'
    ]
  }
];

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [tempSettings, setTempSettings] = useState<AISettings>({ ...settings });
  const [selectedPlan, setSelectedPlan] = useState<string>('free');
  const [encryptionKey, setEncryptionKey] = useState<string>('');

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

  const handleSubscribe = (planId: string) => {
    setSelectedPlan(planId);
    // Normally this would connect to a payment processor
    console.log(`Subscribing to plan: ${planId}`);
    
    // In a real implementation, we would encrypt the payment details
    // and send to a secure backend
    if (encryptionKey) {
      console.log('Using end-to-end encryption for payment processing');
    }
  };
  
  const handleGenerateEncryptionKey = () => {
    // Generate a secure random key (in a real app, use a proper crypto library)
    const randomKey = Array(32)
      .fill(0)
      .map(() => Math.round(Math.random() * 15).toString(16))
      .join('');
    
    setEncryptionKey(randomKey);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-primary">Assistant Settings</DialogTitle>
          <DialogDescription>
            Configure your AI assistant preferences
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="communication">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="communication">Communication</TabsTrigger>
            <TabsTrigger value="chat">Chat Options</TabsTrigger>
            <TabsTrigger value="billing">Billing</TabsTrigger>
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
          
          <TabsContent value="billing" className="space-y-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-primary">Subscription Plans</h3>
              <p className="text-sm text-muted-foreground">Choose the plan that's right for you</p>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3">
              {plans.map(plan => (
                <div 
                  key={plan.id} 
                  className={`rounded-lg border p-4 relative ${
                    selectedPlan === plan.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-border'
                  } ${plan.popular ? 'ring-2 ring-primary/30' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 right-4 bg-primary text-primary-foreground px-2 py-0.5 text-xs rounded-md">
                      Popular
                    </div>
                  )}
                  <h4 className="font-medium text-lg">{plan.name}</h4>
                  <p className="text-xl font-bold my-2">{plan.price}</p>
                  <ul className="text-sm space-y-1 mb-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <span className="mr-2 text-primary">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={selectedPlan === plan.id ? "default" : "outline"} 
                    className="w-full"
                    onClick={() => handleSubscribe(plan.id)}
                  >
                    {selectedPlan === plan.id ? 'Current Plan' : 'Subscribe'}
                  </Button>
                </div>
              ))}
            </div>
            
            <div className="mt-6 border-t pt-4 border-border">
              <h3 className="text-lg font-semibold text-primary flex items-center mb-2">
                <Shield className="w-5 h-5 mr-2" />
                End-to-End Encryption
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Secure your payment information and conversation with end-to-end encryption
              </p>
              
              <div className="flex flex-col space-y-4">
                <div className="flex items-center gap-2">
                  <Input 
                    value={encryptionKey} 
                    readOnly 
                    placeholder="No encryption key generated" 
                    className="font-mono text-sm bg-muted/50"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateEncryptionKey}
                    className="whitespace-nowrap"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Generate Key
                  </Button>
                </div>
                
                <div className="text-xs text-muted-foreground">
                  <p className="mb-1 font-medium">Why encrypt?</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Protects your payment information</li>
                    <li>Secures sensitive conversations</li>
                    <li>Prevents unauthorized access</li>
                    <li>Provides enhanced privacy</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="border-t pt-4 border-border">
              <h3 className="text-lg font-semibold text-primary flex items-center mb-2">
                <CreditCard className="w-5 h-5 mr-2" />
                Payment Method
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Manage your payment details securely
              </p>
              
              <div className="space-y-3">
                <div className="p-3 border border-border rounded-md bg-muted/20 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-6 bg-primary/20 rounded mr-3"></div>
                    <span className="text-sm">•••• •••• •••• 4242</span>
                  </div>
                  <Button variant="outline" size="sm">Edit</Button>
                </div>
                
                <Button variant="outline" className="w-full">
                  Add Payment Method
                </Button>
              </div>
            </div>
            
            <div className="border-t pt-4 border-border">
              <h3 className="text-lg font-semibold text-primary mb-2">Billing History</h3>
              <div className="text-sm text-center p-6 border border-dashed border-border rounded-md">
                No billing history available
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
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

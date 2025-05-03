
import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Link, Check, Loader2 } from 'lucide-react';
import { useToast } from './ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from './ui/card';

interface ToolIntegrationProps {
  isActive: boolean;
  onClose: () => void;
}

const ToolIntegration: React.FC<ToolIntegrationProps> = ({ isActive, onClose }) => {
  const [activeTab, setActiveTab] = useState<string>('zapier');
  const [zapierWebhook, setZapierWebhook] = useState<string>('');
  const [slackWorkspace, setSlackWorkspace] = useState<string>('');
  const [notionApi, setNotionApi] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const { toast } = useToast();
  
  const handleConnect = () => {
    setIsConnecting(true);
    
    setTimeout(() => {
      setIsConnecting(false);
      
      toast({
        title: "Integration successful",
        description: `Connected to ${activeTab} successfully`,
      });
    }, 1500);
  };
  
  const integrationTools = [
    {
      id: 'zapier',
      name: 'Zapier',
      description: 'Connect with thousands of apps through Zapier workflows',
      input: {
        label: 'Webhook URL',
        placeholder: 'Enter your Zapier webhook URL',
        value: zapierWebhook,
        onChange: setZapierWebhook,
      }
    },
    {
      id: 'slack',
      name: 'Slack',
      description: 'Connect your Slack workspace for seamless communication',
      input: {
        label: 'Workspace ID',
        placeholder: 'Enter your Slack workspace ID',
        value: slackWorkspace,
        onChange: setSlackWorkspace,
      }
    },
    {
      id: 'notion',
      name: 'Notion',
      description: 'Connect with Notion for document management',
      input: {
        label: 'API Key',
        placeholder: 'Enter your Notion API key',
        value: notionApi,
        onChange: setNotionApi,
      }
    },
  ];

  return (
    <Sheet open={isActive} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Link className="h-5 w-5" />
            Tool Integration
          </SheetTitle>
          <SheetDescription>
            Connect external tools to enhance your assistant's capabilities
          </SheetDescription>
        </SheetHeader>
        
        <div className="mt-6">
          <Tabs defaultValue="zapier" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              {integrationTools.map(tool => (
                <TabsTrigger key={tool.id} value={tool.id}>
                  {tool.name}
                </TabsTrigger>
              ))}
            </TabsList>
            
            {integrationTools.map(tool => (
              <TabsContent key={tool.id} value={tool.id}>
                <Card>
                  <CardHeader>
                    <CardTitle>{tool.name}</CardTitle>
                    <CardDescription>{tool.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor={`${tool.id}-input`}>{tool.input.label}</Label>
                        <Input
                          id={`${tool.id}-input`}
                          placeholder={tool.input.placeholder}
                          value={tool.input.value}
                          onChange={(e) => tool.input.onChange(e.target.value)}
                        />
                      </div>
                      
                      <Button 
                        className="w-full" 
                        onClick={handleConnect}
                        disabled={isConnecting || !tool.input.value}
                      >
                        {isConnecting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Connecting...
                          </>
                        ) : tool.input.value ? (
                          <>
                            <Check className="mr-2 h-4 w-4" />
                            Connect
                          </>
                        ) : (
                          "Connect"
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ToolIntegration;


import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Check, CreditCard, Lock, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Plan } from '@/types';

const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0/month',
    features: [
      'Basic conversation capabilities',
      '5 files per day',
      'Standard response speed',
      'Limited access to tools'
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    price: '$20/month',
    features: [
      'Enhanced conversation capabilities',
      'Unlimited files',
      'Priority response speed',
      'Full access to tools',
      'End-to-end encryption'
    ],
    popular: true,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$40/month',
    features: [
      'Everything in Plus',
      'Highest priority response speed',
      'Advanced analytics',
      'Custom AI training',
      'End-to-end encryption',
      'API access'
    ],
  },
];

const BillingPage = () => {
  const [selectedPlan, setSelectedPlan] = useState('free');
  const [encryptionEnabled, setEncryptionEnabled] = useState(false);
  const [encryptionKey, setEncryptionKey] = useState('');
  const [showEncryptionKey, setShowEncryptionKey] = useState(false);
  const { toast } = useToast();

  const handleSaveBilling = () => {
    // In a real app, this would submit to backend
    localStorage.setItem('selectedPlan', selectedPlan);
    
    if (encryptionEnabled && encryptionKey) {
      localStorage.setItem('encryptionEnabled', 'true');
      // In a real app, we would securely store this key
      localStorage.setItem('encryptionKey', encryptionKey);
    }
    
    toast({
      title: "Billing settings updated",
      description: `Your subscription has been updated to the ${selectedPlan} plan.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="flex items-center p-4 border-b border-border/40">
        <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Chat</span>
        </Link>
        <h1 className="text-xl font-semibold mx-auto">Billing & Subscription</h1>
      </header>
      
      <main className="container max-w-4xl py-8 px-4">
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Choose a Plan</h2>
            <p className="text-muted-foreground mb-6">
              Select the plan that best fits your needs
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {plans.map((plan) => (
                <Card 
                  key={plan.id}
                  className={`plan-card ${selectedPlan === plan.id ? 'active' : ''} ${plan.popular ? 'shadow-glow' : ''}`}
                  onClick={() => setSelectedPlan(plan.id)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <CardTitle>{plan.name}</CardTitle>
                      {plan.popular && (
                        <span className="bg-primary/20 text-primary text-xs px-2 py-1 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <CardDescription>
                      <span className="text-xl font-bold">{plan.price}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {plan.features.map((feature, i) => (
                      <div key={i} className="plan-feature">
                        <Check className="plan-feature-icon" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full" 
                      variant={selectedPlan === plan.id ? 'default' : 'outline'}
                      onClick={() => setSelectedPlan(plan.id)}
                    >
                      {selectedPlan === plan.id ? 'Selected' : 'Select'}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
          
          <Separator />
          
          <section>
            <h2 className="text-2xl font-bold mb-4">Payment Information</h2>
            <Tabs defaultValue="card">
              <TabsList className="mb-4">
                <TabsTrigger value="card">Credit Card</TabsTrigger>
                <TabsTrigger value="paypal">PayPal</TabsTrigger>
              </TabsList>
              
              <TabsContent value="card" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Name on Card</Label>
                    <Input id="cardName" placeholder="John Smith" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                      <CreditCard className="absolute right-3 top-2.5 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input id="expiry" placeholder="MM/YY" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input id="cvv" placeholder="123" />
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="paypal">
                <div className="p-6 text-center">
                  <p className="text-muted-foreground">
                    You will be redirected to PayPal to complete your payment.
                  </p>
                  <Button className="mt-4">Connect with PayPal</Button>
                </div>
              </TabsContent>
            </Tabs>
          </section>
          
          <Separator />
          
          {selectedPlan !== 'free' && (
            <section className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" /> 
                    End-to-End Encryption
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Enable end-to-end encryption for maximum security
                  </p>
                </div>
                <Switch 
                  checked={encryptionEnabled} 
                  onCheckedChange={setEncryptionEnabled}
                />
              </div>
              
              {encryptionEnabled && (
                <div className="bg-muted/40 border border-border rounded-md p-4 space-y-4">
                  <div className="flex items-start gap-3">
                    <Lock className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Set Encryption Key</h4>
                      <p className="text-sm text-muted-foreground mt-1">
                        This key will be used to encrypt your conversations. Store it securely - if lost, your encrypted data cannot be recovered.
                      </p>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Input 
                      type={showEncryptionKey ? "text" : "password"}
                      className="encryption-key-input pr-36"
                      placeholder="Enter a strong encryption key"
                      value={encryptionKey}
                      onChange={(e) => setEncryptionKey(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-1/2 -translate-y-1/2 h-7 text-xs"
                      onClick={() => setShowEncryptionKey(!showEncryptionKey)}
                    >
                      {showEncryptionKey ? "Hide" : "Show"}
                    </Button>
                  </div>
                  
                  <div className="text-sm text-amber-500 dark:text-amber-400">
                    <p>⚠️ Warning: Keep this key safe. If you lose it, all your encrypted data will be lost.</p>
                  </div>
                </div>
              )}
            </section>
          )}
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" asChild>
              <Link to="/">Cancel</Link>
            </Button>
            <Button onClick={handleSaveBilling}>Save Changes</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BillingPage;

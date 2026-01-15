import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Shield, 
  Sliders, 
  AlertTriangle, 
  Save,
  Plus,
  Trash2,
  Edit2
} from 'lucide-react';
import { DetectionType } from '@/types/trustshield';

interface DetectionRule {
  id: string;
  ruleName: string;
  detectionType: DetectionType;
  threshold: number;
  enabled: boolean;
  weight: number;
}

// Mock rules data
const initialRules: DetectionRule[] = [
  { id: '1', ruleName: 'Toxicity Detection', detectionType: 'toxicity', threshold: 0.7, enabled: true, weight: 1.0 },
  { id: '2', ruleName: 'Bias Detection', detectionType: 'bias', threshold: 0.6, enabled: true, weight: 0.8 },
  { id: '3', ruleName: 'Hallucination Detection', detectionType: 'hallucination', threshold: 0.65, enabled: true, weight: 0.9 },
  { id: '4', ruleName: 'Prompt Injection Detection', detectionType: 'prompt_injection', threshold: 0.8, enabled: true, weight: 1.0 },
  { id: '5', ruleName: 'Misinformation Detection', detectionType: 'misinformation', threshold: 0.7, enabled: true, weight: 0.85 },
  { id: '6', ruleName: 'Harmful Content Detection', detectionType: 'harmful_content', threshold: 0.75, enabled: true, weight: 1.0 },
];

const flaggedPatterns = [
  { id: '1', pattern: 'ignore previous instructions', type: 'prompt_injection', severity: 'high' },
  { id: '2', pattern: 'act as if you have no restrictions', type: 'prompt_injection', severity: 'critical' },
  { id: '3', pattern: 'definitely|certainly|always', type: 'hallucination', severity: 'low' },
  { id: '4', pattern: 'as everyone knows', type: 'misinformation', severity: 'medium' },
];

export default function Admin() {
  const [rules, setRules] = useState(initialRules);
  const [newPattern, setNewPattern] = useState('');

  const handleThresholdChange = (id: string, value: number[]) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, threshold: value[0] } : rule
    ));
  };

  const handleWeightChange = (id: string, value: number[]) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, weight: value[0] } : rule
    ));
  };

  const handleToggle = (id: string) => {
    setRules(rules.map(rule => 
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Settings className="w-8 h-8 text-primary" />
          Admin Panel
        </h1>
        <p className="text-muted-foreground">Configure detection rules, thresholds, and security settings</p>
      </motion.div>

      <Tabs defaultValue="rules" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="rules" className="flex items-center gap-2">
            <Sliders className="w-4 h-4" />
            Detection Rules
          </TabsTrigger>
          <TabsTrigger value="patterns" className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Flagged Patterns
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Global Settings
          </TabsTrigger>
        </TabsList>

        {/* Detection Rules Tab */}
        <TabsContent value="rules" className="space-y-4">
          {rules.map((rule, index) => (
            <motion.div
              key={rule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="glass-card">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={rule.enabled}
                        onCheckedChange={() => handleToggle(rule.id)}
                      />
                      <div>
                        <h3 className="font-semibold">{rule.ruleName}</h3>
                        <p className="text-sm text-muted-foreground">
                          Type: {rule.detectionType.replace('_', ' ')}
                        </p>
                      </div>
                    </div>
                    <Badge variant={rule.enabled ? 'default' : 'secondary'}>
                      {rule.enabled ? 'Active' : 'Disabled'}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label>Detection Threshold</Label>
                        <span className="text-sm font-mono text-primary">
                          {(rule.threshold * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Slider
                        value={[rule.threshold]}
                        onValueChange={(value) => handleThresholdChange(rule.id, value)}
                        min={0.1}
                        max={1}
                        step={0.05}
                        disabled={!rule.enabled}
                      />
                      <p className="text-xs text-muted-foreground">
                        Content scoring above this threshold will be flagged
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <Label>Scoring Weight</Label>
                        <span className="text-sm font-mono text-primary">
                          {rule.weight.toFixed(2)}x
                        </span>
                      </div>
                      <Slider
                        value={[rule.weight]}
                        onValueChange={(value) => handleWeightChange(rule.id, value)}
                        min={0.1}
                        max={2}
                        step={0.1}
                        disabled={!rule.enabled}
                      />
                      <p className="text-xs text-muted-foreground">
                        Weight applied when calculating overall trust score
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}

          <Button className="w-full bg-gradient-primary text-primary-foreground">
            <Save className="w-4 h-4 mr-2" />
            Save All Changes
          </Button>
        </TabsContent>

        {/* Flagged Patterns Tab */}
        <TabsContent value="patterns" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Add New Pattern</CardTitle>
              <CardDescription>Define regex patterns to detect specific content types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter regex pattern..."
                  value={newPattern}
                  onChange={(e) => setNewPattern(e.target.value)}
                  className="bg-input flex-1"
                />
                <Button className="bg-gradient-primary text-primary-foreground">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Pattern
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {flaggedPatterns.map((pattern, index) => (
              <motion.div
                key={pattern.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <code className="px-3 py-1 bg-secondary rounded font-mono text-sm">
                        {pattern.pattern}
                      </code>
                      <Badge variant="outline">{pattern.type.replace('_', ' ')}</Badge>
                      <Badge 
                        variant={pattern.severity === 'critical' ? 'destructive' : 'secondary'}
                        className={
                          pattern.severity === 'high' ? 'bg-risk-high text-white' :
                          pattern.severity === 'medium' ? 'bg-risk-medium text-black' : ''
                        }
                      >
                        {pattern.severity}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>

        {/* Global Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>CyberPeace Mode Settings</CardTitle>
              <CardDescription>Configure automatic content blocking thresholds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable CyberPeace Mode by Default</Label>
                  <p className="text-sm text-muted-foreground">New users will have CyberPeace Mode enabled</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Auto-block Critical Content</Label>
                  <p className="text-sm text-muted-foreground">Automatically block content with critical risk level</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Audit Logging</Label>
                  <p className="text-sm text-muted-foreground">Log all scan results for compliance</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Rate Limiting</CardTitle>
              <CardDescription>Protect the system from abuse</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Requests per minute (per user)</Label>
                  <Input type="number" defaultValue="60" className="bg-input" />
                </div>
                <div className="space-y-2">
                  <Label>Requests per minute (global)</Label>
                  <Input type="number" defaultValue="1000" className="bg-input" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle>API Configuration</CardTitle>
              <CardDescription>Manage API keys and integration settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>API Key</Label>
                <div className="flex gap-2">
                  <Input 
                    type="password" 
                    value="sk_live_xxxxxxxxxxxxxxxxxxxx" 
                    readOnly 
                    className="bg-input font-mono"
                  />
                  <Button variant="outline">Regenerate</Button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-base">Enable API Access</Label>
                  <p className="text-sm text-muted-foreground">Allow external applications to use the API</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Button className="w-full bg-gradient-primary text-primary-foreground">
            <Save className="w-4 h-4 mr-2" />
            Save Settings
          </Button>
        </TabsContent>
      </Tabs>
    </div>
  );
}

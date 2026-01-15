import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  FileText, 
  Code, 
  Server, 
  Database, 
  Workflow,
  Shield,
  Zap,
  Lock,
  Globe,
  Terminal
} from 'lucide-react';

export default function Docs() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <FileText className="w-8 h-8 text-primary" />
          API Documentation
        </h1>
        <p className="text-muted-foreground">Integrate AI TrustShield into your applications</p>
      </motion.div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary flex-wrap">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="architecture">Architecture</TabsTrigger>
          <TabsTrigger value="formulas">Formulas</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { icon: Zap, title: 'Real-time Analysis', desc: 'Sub-second response times' },
              { icon: Shield, title: '6 Detection Types', desc: 'Comprehensive risk scanning' },
              { icon: Lock, title: 'JWT Authentication', desc: 'Secure API access' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="glass-card h-full">
                  <CardContent className="pt-6">
                    <item.icon className="w-10 h-10 text-primary mb-3" />
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-primary" />
                Quick Start
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto font-mono text-sm">
{`curl -X POST https://api.trustshield.ai/v1/analyze \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "text": "Your AI-generated content here...",
    "cyberPeaceMode": true
  }'`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endpoints Tab */}
        <TabsContent value="endpoints" className="space-y-4">
          {[
            {
              method: 'POST',
              path: '/v1/analyze',
              desc: 'Analyze text content for risks',
              body: '{ "text": string, "cyberPeaceMode": boolean }',
            },
            {
              method: 'GET',
              path: '/v1/history',
              desc: 'Get scan history for authenticated user',
              body: 'Query: ?limit=50&offset=0&riskLevel=high',
            },
            {
              method: 'GET',
              path: '/v1/rules',
              desc: 'Get detection rules configuration',
              body: 'No body required',
            },
            {
              method: 'PUT',
              path: '/v1/rules/:id',
              desc: 'Update detection rule (Admin only)',
              body: '{ "threshold": number, "enabled": boolean, "weight": number }',
            },
            {
              method: 'GET',
              path: '/v1/analytics',
              desc: 'Get analytics dashboard data',
              body: 'Query: ?startDate=2024-01-01&endDate=2024-01-31',
            },
          ].map((endpoint, i) => (
            <motion.div
              key={endpoint.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="glass-card">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <Badge 
                      className={
                        endpoint.method === 'GET' ? 'bg-success' :
                        endpoint.method === 'POST' ? 'bg-primary' :
                        'bg-warning'
                      }
                    >
                      {endpoint.method}
                    </Badge>
                    <div className="flex-1">
                      <code className="font-mono text-primary">{endpoint.path}</code>
                      <p className="text-sm text-muted-foreground mt-1">{endpoint.desc}</p>
                      <div className="mt-2 text-xs bg-secondary/50 p-2 rounded font-mono">
                        {endpoint.body}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </TabsContent>

        {/* Architecture Tab */}
        <TabsContent value="architecture" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-primary" />
                System Architecture
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto font-mono text-xs leading-relaxed">
{`┌─────────────────────────────────────────────────────────────────────────┐
│                           AI TRUSTSHIELD ARCHITECTURE                    │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────┐     ┌─────────────┐     ┌─────────────────────────────────┐
│   Frontend  │────▶│   Backend   │────▶│      AI Safety Engine          │
│  (React)    │◀────│  (Node.js)  │◀────│       (FastAPI)                │
└─────────────┘     └─────────────┘     └─────────────────────────────────┘
       │                   │                          │
       │                   │                          │
       ▼                   ▼                          ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────────────────────────┐
│   Browser   │     │   MongoDB   │     │        ML Models                │
│  Extension  │     │   (Logs)    │     │  ┌─────────┐ ┌─────────┐       │
└─────────────┘     └─────────────┘     │  │Toxicity │ │  Bias   │       │
                           │            │  └─────────┘ └─────────┘       │
                           ▼            │  ┌─────────┐ ┌─────────┐       │
                    ┌─────────────┐     │  │Halluc.  │ │Prompt   │       │
                    │    Redis    │     │  └─────────┘ │Injection│       │
                    │  (Cache)    │     │              └─────────┘       │
                    └─────────────┘     └─────────────────────────────────┘

DATA FLOW:
1. User submits content via Frontend or API
2. Backend validates request and applies rate limiting
3. Content sent to AI Safety Engine for analysis
4. ML models process in parallel (ensemble scoring)
5. Trust Score calculated with weighted formula
6. Results cached and logged
7. Response returned with detections and explanations`}
              </pre>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-primary" />
                Database Schema
              </CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-secondary/50 p-4 rounded-lg overflow-x-auto font-mono text-xs leading-relaxed">
{`┌─────────────────────────────────────────────────────────────────────────┐
│ PROFILES                                                                │
├─────────────────────────────────────────────────────────────────────────┤
│ id            UUID PRIMARY KEY                                          │
│ user_id       UUID REFERENCES auth.users                                │
│ full_name     TEXT                                                      │
│ role          ENUM('user', 'admin')                                     │
│ cyber_peace   BOOLEAN DEFAULT true                                      │
│ created_at    TIMESTAMP                                                 │
│ updated_at    TIMESTAMP                                                 │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ SCAN_LOGS                                                               │
├─────────────────────────────────────────────────────────────────────────┤
│ id                  UUID PRIMARY KEY                                    │
│ user_id             UUID REFERENCES auth.users                          │
│ input_text          TEXT                                                │
│ trust_score         INTEGER (0-100)                                     │
│ risk_level          ENUM('safe','low','medium','high','critical')       │
│ detection_results   JSONB                                               │
│ flagged_content     TEXT[]                                              │
│ explanation         TEXT                                                │
│ cyber_peace_blocked BOOLEAN                                             │
│ processing_time_ms  INTEGER                                             │
│ created_at          TIMESTAMP                                           │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ DETECTION_RULES                                                         │
├─────────────────────────────────────────────────────────────────────────┤
│ id              UUID PRIMARY KEY                                        │
│ rule_name       TEXT                                                    │
│ detection_type  ENUM(toxicity, bias, hallucination, ...)               │
│ threshold       DECIMAL(3,2)                                            │
│ enabled         BOOLEAN                                                 │
│ weight          DECIMAL(3,2)                                            │
│ created_by      UUID REFERENCES auth.users                              │
│ created_at      TIMESTAMP                                               │
└─────────────────────────────────────────────────────────────────────────┘`}
              </pre>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Formulas Tab */}
        <TabsContent value="formulas" className="space-y-6">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-primary" />
                Trust Score Calculation
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-secondary/50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4">Formula:</h3>
                <pre className="font-mono text-primary text-lg">
{`Trust Score = Σ[(1 - score_i) × weight_i × confidence_i] / Σ[weight_i] × 100`}
                </pre>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Detection Weights:</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { type: 'Prompt Injection', weight: 1.0 },
                    { type: 'Harmful Content', weight: 1.0 },
                    { type: 'Toxicity', weight: 0.9 },
                    { type: 'Misinformation', weight: 0.85 },
                    { type: 'Hallucination', weight: 0.8 },
                    { type: 'Bias', weight: 0.75 },
                  ].map((item) => (
                    <div key={item.type} className="bg-secondary/30 p-3 rounded-lg">
                      <div className="text-sm text-muted-foreground">{item.type}</div>
                      <div className="text-xl font-bold text-primary">{item.weight}x</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold">Risk Level Thresholds:</h3>
                <div className="space-y-2">
                  {[
                    { level: 'Safe', range: '85-100', color: 'bg-risk-safe' },
                    { level: 'Low', range: '70-84', color: 'bg-risk-low' },
                    { level: 'Medium', range: '50-69', color: 'bg-risk-medium' },
                    { level: 'High', range: '30-49', color: 'bg-risk-high' },
                    { level: 'Critical', range: '0-29', color: 'bg-risk-critical' },
                  ].map((item) => (
                    <div key={item.level} className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded ${item.color}`} />
                      <span className="font-medium w-20">{item.level}</span>
                      <span className="text-muted-foreground font-mono">{item.range}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
                CyberPeace Mode Use Cases
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { title: 'Hate Speech Prevention', desc: 'Blocks content promoting discrimination or violence' },
                  { title: 'Scam Detection', desc: 'Identifies phishing attempts and fraudulent content' },
                  { title: 'Jailbreak Protection', desc: 'Prevents prompt injection attacks' },
                  { title: 'Child Safety', desc: 'Filters inappropriate content for younger users' },
                  { title: 'Misinformation Guard', desc: 'Flags false medical/scientific claims' },
                  { title: 'Cybercrime Prevention', desc: 'Detects hacking tutorials and malware instructions' },
                ].map((item, i) => (
                  <div key={i} className="bg-secondary/30 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary mb-1">{item.title}</h4>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

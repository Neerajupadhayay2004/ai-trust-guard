import { useState } from 'react';
import { motion } from 'framer-motion';
import { ScannerInput } from '@/components/ScannerInput';
import { ScanResults } from '@/components/ScanResults';
import { useAnalyzeContent } from '@/hooks/useScanLogs';
import { ScanResult } from '@/types/trustshield';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Sparkles, Zap, Lock, Brain } from 'lucide-react';

export default function Scanner() {
  const [cyberPeaceMode, setCyberPeaceMode] = useState(true);
  const [scanResult, setScanResult] = useState<Omit<ScanResult, 'id' | 'createdAt'> | null>(null);
  
  const analyzeContent = useAnalyzeContent();

  const handleScan = async (text: string, cyberPeace: boolean) => {
    try {
      const result = await analyzeContent.mutateAsync({ text, cyberPeaceMode: cyberPeace });
      setScanResult(result);
    } catch (error) {
      console.error('Scan failed:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4 py-8"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20"
        >
          <Brain className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium text-primary">Powered by Gemini AI</span>
        </motion.div>
        
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
          <span className="text-gradient">AI TrustShield</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Detect AI misuse, hallucinations, bias, and prompt injection in real-time.
          Get instant Trust Scores for responsible AI usage.
        </p>
      </motion.section>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      >
        {[
          { icon: Shield, title: 'AI-Powered Detection', desc: 'Advanced ML models analyze your content' },
          { icon: Zap, title: 'Real-time Analysis', desc: 'Get comprehensive results in seconds' },
          { icon: Lock, title: 'CyberPeace Mode', desc: 'Block harmful content automatically' },
        ].map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
          >
            <Card className="glass-card h-full hover:border-primary/30 transition-colors">
              <CardContent className="pt-6 flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10">
                  <feature.icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.desc}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Scanner Input */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="glass-card glow-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              AI Output Scanner
            </CardTitle>
            <CardDescription>
              Paste AI-generated content to analyze for potential risks and get a trust score
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScannerInput
              onScan={handleScan}
              isScanning={analyzeContent.isPending}
              cyberPeaceMode={cyberPeaceMode}
              onCyberPeaceModeChange={setCyberPeaceMode}
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Scan Results */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <ScanResults result={scanResult} />
        </motion.div>
      )}

      {/* How It Works - Only show when no results */}
      {!scanResult && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="py-8"
        >
          <h2 className="text-2xl font-bold text-center mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { step: '01', title: 'Input', desc: 'Paste AI-generated text' },
              { step: '02', title: 'AI Analysis', desc: 'Gemini AI scans for risks' },
              { step: '03', title: 'Score', desc: 'Calculate trust score' },
              { step: '04', title: 'Report', desc: 'Get actionable insights' },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary/30 mb-2">{item.step}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      )}
    </div>
  );
}

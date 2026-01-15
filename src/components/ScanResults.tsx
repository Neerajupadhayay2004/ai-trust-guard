import { motion } from 'framer-motion';
import { ScanResult, DetectionType } from '@/types/trustshield';
import { TrustScoreGauge } from './TrustScoreGauge';
import { RiskBadge } from './RiskBadge';
import { DetectionCard } from './DetectionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, Clock, Shield, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScanResultsProps {
  result: Omit<ScanResult, 'id' | 'createdAt'>;
}

export function ScanResults({ result }: ScanResultsProps) {
  const detectionTypes: DetectionType[] = [
    'toxicity',
    'bias',
    'hallucination',
    'prompt_injection',
    'misinformation',
    'harmful_content',
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* CyberPeace Block Alert */}
      {result.cyberPeaceBlocked && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-4 bg-destructive/10 border border-destructive/50 rounded-lg flex items-start gap-3"
        >
          <Shield className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-destructive">Content Blocked by CyberPeace Mode</h4>
            <p className="text-sm text-destructive/80 mt-1">
              This content has been flagged as potentially harmful and blocked to protect users.
              Review the detection results below for details.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Score Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trust Score Gauge */}
        <Card className="glass-card lg:col-span-1">
          <CardContent className="pt-6 flex flex-col items-center justify-center">
            <TrustScoreGauge 
              score={result.trustScore} 
              riskLevel={result.riskLevel}
              size="lg"
            />
            <div className="mt-4 flex flex-col items-center gap-2">
              <RiskBadge level={result.riskLevel} size="lg" />
              <div className="flex items-center gap-2 text-muted-foreground text-sm mt-2">
                <Clock className="w-4 h-4" />
                <span>{result.processingTimeMs}ms</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="glass-card lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {result.flaggedContent.length > 0 ? (
                <AlertTriangle className="w-5 h-5 text-warning" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-success" />
              )}
              Analysis Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className={cn(
              'text-sm p-3 rounded-lg',
              result.flaggedContent.length > 0 
                ? 'bg-warning/10 text-warning border border-warning/20' 
                : 'bg-success/10 text-success border border-success/20'
            )}>
              {result.explanation}
            </p>

            {result.flaggedContent.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Flagged Categories:</h4>
                <div className="flex flex-wrap gap-2">
                  {result.flaggedContent.map((type) => (
                    <span 
                      key={type}
                      className="px-3 py-1 bg-risk-high/20 text-risk-high text-xs rounded-full font-medium uppercase"
                    >
                      {type.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-border">
              <h4 className="text-sm font-medium text-muted-foreground mb-2">Analyzed Text Preview:</h4>
              <p className="text-sm text-foreground/80 bg-secondary/50 p-3 rounded-lg font-mono line-clamp-3">
                {result.inputText}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detection Cards Grid */}
      <div>
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          Detection Analysis
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {detectionTypes.map((type, index) => (
            <DetectionCard 
              key={type}
              detection={result.detectionResults[type]}
              index={index}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

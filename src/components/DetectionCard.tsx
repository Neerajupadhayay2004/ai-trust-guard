import { motion } from 'framer-motion';
import { DetectionResult, DetectionType } from '@/types/trustshield';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';
import { 
  AlertTriangle, 
  Brain, 
  Scale, 
  Shield, 
  Bug, 
  AlertCircle,
  CheckCircle
} from 'lucide-react';

interface DetectionCardProps {
  detection: DetectionResult;
  index?: number;
}

const detectionConfig: Record<DetectionType, {
  label: string;
  description: string;
  Icon: typeof Shield;
  color: string;
}> = {
  toxicity: {
    label: 'Toxicity',
    description: 'Harmful, offensive, or hateful content',
    Icon: AlertTriangle,
    color: 'text-red-400',
  },
  bias: {
    label: 'Bias',
    description: 'Unfair stereotypes or prejudiced content',
    Icon: Scale,
    color: 'text-orange-400',
  },
  hallucination: {
    label: 'Hallucination',
    description: 'Fabricated or unverifiable claims',
    Icon: Brain,
    color: 'text-purple-400',
  },
  prompt_injection: {
    label: 'Prompt Injection',
    description: 'Attempts to manipulate AI behavior',
    Icon: Bug,
    color: 'text-cyan-400',
  },
  misinformation: {
    label: 'Misinformation',
    description: 'False or misleading information',
    Icon: AlertCircle,
    color: 'text-yellow-400',
  },
  harmful_content: {
    label: 'Harmful Content',
    description: 'Content that may cause real-world harm',
    Icon: Shield,
    color: 'text-pink-400',
  },
};

function getScoreColor(score: number): string {
  if (score < 0.3) return 'bg-risk-safe';
  if (score < 0.5) return 'bg-risk-low';
  if (score < 0.7) return 'bg-risk-medium';
  if (score < 0.85) return 'bg-risk-high';
  return 'bg-risk-critical';
}

export function DetectionCard({ detection, index = 0 }: DetectionCardProps) {
  const config = detectionConfig[detection.type];
  const Icon = config.Icon;
  const scorePercent = Math.round(detection.score * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={cn(
        'glass-card p-4 hover:border-primary/30 transition-all duration-300',
        detection.flagged && 'border-risk-high/50'
      )}
    >
      <div className="flex items-start gap-3">
        <div className={cn(
          'p-2 rounded-lg bg-secondary',
          config.color
        )}>
          <Icon size={20} />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-semibold text-foreground">{config.label}</h4>
            <div className="flex items-center gap-2">
              {detection.flagged ? (
                <AlertTriangle size={16} className="text-risk-high" />
              ) : (
                <CheckCircle size={16} className="text-risk-safe" />
              )}
              <span className={cn(
                'font-mono text-sm font-semibold',
                detection.flagged ? 'text-risk-high' : 'text-risk-safe'
              )}>
                {scorePercent}%
              </span>
            </div>
          </div>
          
          <p className="text-xs text-muted-foreground mt-0.5 mb-2">
            {config.description}
          </p>
          
          <div className="space-y-2">
            <div className="h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className={cn('h-full rounded-full', getScoreColor(detection.score))}
                initial={{ width: 0 }}
                animate={{ width: `${scorePercent}%` }}
                transition={{ duration: 0.8, delay: index * 0.1 + 0.3 }}
              />
            </div>
            
            <p className="text-xs text-muted-foreground">
              {detection.explanation}
            </p>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Confidence:</span>
              <span className="font-mono">{Math.round(detection.confidence * 100)}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

import { motion } from 'framer-motion';
import { RiskLevel } from '@/types/trustshield';
import { cn } from '@/lib/utils';

interface TrustScoreGaugeProps {
  score: number;
  riskLevel: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

const riskColors: Record<RiskLevel, string> = {
  safe: 'text-risk-safe',
  low: 'text-risk-low',
  medium: 'text-risk-medium',
  high: 'text-risk-high',
  critical: 'text-risk-critical',
};

const riskGlows: Record<RiskLevel, string> = {
  safe: 'drop-shadow-[0_0_20px_hsl(142,76%,36%,0.5)]',
  low: 'drop-shadow-[0_0_20px_hsl(174,72%,56%,0.5)]',
  medium: 'drop-shadow-[0_0_20px_hsl(38,92%,50%,0.5)]',
  high: 'drop-shadow-[0_0_20px_hsl(25,95%,53%,0.5)]',
  critical: 'drop-shadow-[0_0_20px_hsl(0,84%,60%,0.5)]',
};

const sizes = {
  sm: { width: 120, strokeWidth: 8, fontSize: 'text-2xl' },
  md: { width: 180, strokeWidth: 12, fontSize: 'text-4xl' },
  lg: { width: 240, strokeWidth: 16, fontSize: 'text-5xl' },
};

export function TrustScoreGauge({ 
  score, 
  riskLevel, 
  size = 'md',
  animated = true 
}: TrustScoreGaugeProps) {
  const { width, strokeWidth, fontSize } = sizes[size];
  const radius = (width - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg
        width={width}
        height={width}
        className={cn('transform -rotate-90', riskGlows[riskLevel])}
      >
        {/* Background circle */}
        <circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-secondary"
        />
        
        {/* Progress circle */}
        <motion.circle
          cx={width / 2}
          cy={width / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={riskColors[riskLevel]}
          strokeDasharray={circumference}
          initial={animated ? { strokeDashoffset: circumference } : { strokeDashoffset }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          className={cn('font-bold', fontSize, riskColors[riskLevel])}
          initial={animated ? { scale: 0 } : { scale: 1 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
        >
          {score}
        </motion.span>
        <span className="text-muted-foreground text-sm uppercase tracking-wider">
          Trust Score
        </span>
      </div>
    </div>
  );
}

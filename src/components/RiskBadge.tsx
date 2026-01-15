import { RiskLevel } from '@/types/trustshield';
import { cn } from '@/lib/utils';
import { Shield, ShieldAlert, ShieldCheck, ShieldX } from 'lucide-react';

interface RiskBadgeProps {
  level: RiskLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const levelConfig: Record<RiskLevel, {
  label: string;
  bgClass: string;
  textClass: string;
  Icon: typeof Shield;
}> = {
  safe: {
    label: 'SAFE',
    bgClass: 'bg-risk-safe/20 border-risk-safe/50',
    textClass: 'text-risk-safe',
    Icon: ShieldCheck,
  },
  low: {
    label: 'LOW',
    bgClass: 'bg-risk-low/20 border-risk-low/50',
    textClass: 'text-risk-low',
    Icon: Shield,
  },
  medium: {
    label: 'MEDIUM',
    bgClass: 'bg-risk-medium/20 border-risk-medium/50',
    textClass: 'text-risk-medium',
    Icon: ShieldAlert,
  },
  high: {
    label: 'HIGH',
    bgClass: 'bg-risk-high/20 border-risk-high/50',
    textClass: 'text-risk-high',
    Icon: ShieldAlert,
  },
  critical: {
    label: 'CRITICAL',
    bgClass: 'bg-risk-critical/20 border-risk-critical/50',
    textClass: 'text-risk-critical',
    Icon: ShieldX,
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-1.5',
};

const iconSizes = {
  sm: 12,
  md: 14,
  lg: 16,
};

export function RiskBadge({ level, showIcon = true, size = 'md', className }: RiskBadgeProps) {
  const config = levelConfig[level];
  const Icon = config.Icon;

  return (
    <div 
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold uppercase tracking-wider',
        config.bgClass,
        config.textClass,
        sizeClasses[size],
        className
      )}
    >
      {showIcon && <Icon size={iconSizes[size]} />}
      <span>{config.label}</span>
    </div>
  );
}

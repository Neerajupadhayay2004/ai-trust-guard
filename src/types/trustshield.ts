export type RiskLevel = 'safe' | 'low' | 'medium' | 'high' | 'critical';

export type DetectionType = 'toxicity' | 'bias' | 'hallucination' | 'prompt_injection' | 'misinformation' | 'harmful_content';

export interface DetectionResult {
  type: DetectionType;
  score: number;
  confidence: number;
  flagged: boolean;
  explanation: string;
}

export interface ScanResult {
  id: string;
  inputText: string;
  trustScore: number;
  riskLevel: RiskLevel;
  detectionResults: Record<DetectionType, DetectionResult>;
  flaggedContent: string[];
  explanation: string;
  cyberPeaceBlocked: boolean;
  processingTimeMs: number;
  createdAt: Date;
}

export interface DetectionRule {
  id: string;
  ruleName: string;
  detectionType: DetectionType;
  threshold: number;
  enabled: boolean;
  weight: number;
}

export interface UserProfile {
  id: string;
  userId: string;
  fullName: string | null;
  role: 'user' | 'admin';
  cyberPeaceMode: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AnalyticsData {
  totalScans: number;
  averageTrustScore: number;
  riskDistribution: Record<RiskLevel, number>;
  detectionBreakdown: Record<DetectionType, number>;
  recentTrend: Array<{
    date: string;
    scans: number;
    avgScore: number;
  }>;
}

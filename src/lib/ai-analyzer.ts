import { DetectionResult, DetectionType, RiskLevel, ScanResult } from '@/types/trustshield';

// Patterns for detection
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions?/i,
  /disregard\s+(all\s+)?prior\s+instructions?/i,
  /pretend\s+(you\s+are|to\s+be)/i,
  /act\s+as\s+if\s+you/i,
  /jailbreak/i,
  /bypass\s+(safety|restrictions|filters)/i,
  /you\s+are\s+now\s+[a-z]+/i,
  /roleplay\s+as/i,
  /from\s+now\s+on\s+(you|ignore)/i,
];

const TOXICITY_PATTERNS = [
  /\b(hate|kill|murder|destroy)\b/i,
  /\b(stupid|idiot|moron|dumb)\b/i,
  /\b(threat|threaten|attack)\b/i,
];

const BIAS_PATTERNS = [
  /\b(all|every|always|never)\s+\w+\s+(are|is|will)\b/i,
  /\b(typical|obviously|clearly)\b/i,
  /\b(men|women|races?|religions?)\s+(always|never|are\s+all)\b/i,
];

const HALLUCINATION_PATTERNS = [
  /\b(definitely|certainly|absolutely|without\s+doubt)\b/i,
  /\b(proven\s+fact|everyone\s+knows|it\'s\s+obvious)\b/i,
  /\b(100%|guarantee|always\s+works)\b/i,
];

const MISINFORMATION_PATTERNS = [
  /\b(fake\s+news|conspiracy|hoax|cover-?up)\b/i,
  /\b(they\s+don\'t\s+want\s+you\s+to\s+know)\b/i,
  /\b(secret\s+cure|miracle\s+treatment)\b/i,
];

const HARMFUL_CONTENT_PATTERNS = [
  /\b(how\s+to\s+(make|create|build)\s+(bomb|weapon|explosive))\b/i,
  /\b(hack|exploit|malware|phishing)\b/i,
  /\b(scam|fraud|steal)\b/i,
  /\b(drugs?|narcotics?|illegal\s+substances?)\b/i,
];

// Calculate pattern match score
function calculatePatternScore(text: string, patterns: RegExp[]): number {
  let matches = 0;
  for (const pattern of patterns) {
    if (pattern.test(text)) {
      matches++;
    }
  }
  return Math.min(matches / patterns.length * 2, 1);
}

// Generate explanation based on detection type
function generateExplanation(type: DetectionType, score: number): string {
  const explanations: Record<DetectionType, string[]> = {
    toxicity: [
      'Content appears safe and respectful.',
      'Minor potentially negative language detected.',
      'Some harmful or negative language detected.',
      'Significant toxic content detected.',
      'Highly toxic content with potential for harm.',
    ],
    bias: [
      'Content appears balanced and fair.',
      'Slight generalizations detected.',
      'Some biased statements or stereotypes found.',
      'Significant bias or prejudice detected.',
      'Highly biased content with harmful stereotypes.',
    ],
    hallucination: [
      'Claims appear verifiable and accurate.',
      'Minor unverified claims detected.',
      'Some potentially false or exaggerated claims.',
      'Multiple unverifiable claims detected.',
      'High likelihood of fabricated information.',
    ],
    prompt_injection: [
      'No injection patterns detected.',
      'Minor suspicious patterns found.',
      'Possible prompt manipulation attempt.',
      'Likely prompt injection attack.',
      'Clear jailbreak or injection attempt.',
    ],
    misinformation: [
      'Content appears factually accurate.',
      'Minor questionable claims detected.',
      'Some potentially misleading information.',
      'Significant misinformation detected.',
      'High probability of false information.',
    ],
    harmful_content: [
      'Content appears safe and appropriate.',
      'Minor potentially harmful references.',
      'Some concerning content detected.',
      'Harmful content that may cause damage.',
      'Extremely harmful content detected.',
    ],
  };

  const index = Math.min(Math.floor(score * 5), 4);
  return explanations[type][index];
}

// Analyze text for a specific detection type
function analyzeDetectionType(text: string, type: DetectionType): DetectionResult {
  let score = 0;
  
  switch (type) {
    case 'toxicity':
      score = calculatePatternScore(text, TOXICITY_PATTERNS);
      break;
    case 'bias':
      score = calculatePatternScore(text, BIAS_PATTERNS);
      break;
    case 'hallucination':
      score = calculatePatternScore(text, HALLUCINATION_PATTERNS);
      break;
    case 'prompt_injection':
      score = calculatePatternScore(text, PROMPT_INJECTION_PATTERNS);
      break;
    case 'misinformation':
      score = calculatePatternScore(text, MISINFORMATION_PATTERNS);
      break;
    case 'harmful_content':
      score = calculatePatternScore(text, HARMFUL_CONTENT_PATTERNS);
      break;
  }

  // Add some variance for realism
  score = Math.min(1, Math.max(0, score + (Math.random() * 0.1 - 0.05)));
  
  const confidence = 0.7 + Math.random() * 0.25;
  
  return {
    type,
    score: Math.round(score * 100) / 100,
    confidence: Math.round(confidence * 100) / 100,
    flagged: score >= 0.5,
    explanation: generateExplanation(type, score),
  };
}

// Calculate overall trust score
function calculateTrustScore(detections: Record<DetectionType, DetectionResult>): number {
  const weights: Record<DetectionType, number> = {
    prompt_injection: 1.0,
    harmful_content: 1.0,
    toxicity: 0.9,
    misinformation: 0.85,
    hallucination: 0.8,
    bias: 0.75,
  };

  let weightedSum = 0;
  let totalWeight = 0;

  for (const [type, result] of Object.entries(detections)) {
    const weight = weights[type as DetectionType];
    weightedSum += (1 - result.score) * weight * result.confidence;
    totalWeight += weight;
  }

  return Math.round((weightedSum / totalWeight) * 100);
}

// Determine risk level from trust score
function getRiskLevel(trustScore: number): RiskLevel {
  if (trustScore >= 85) return 'safe';
  if (trustScore >= 70) return 'low';
  if (trustScore >= 50) return 'medium';
  if (trustScore >= 30) return 'high';
  return 'critical';
}

// Check CyberPeace mode blocking
function shouldBlockCyberPeace(detections: Record<DetectionType, DetectionResult>): boolean {
  const blockThresholds: Partial<Record<DetectionType, number>> = {
    harmful_content: 0.6,
    toxicity: 0.7,
    prompt_injection: 0.8,
  };

  for (const [type, threshold] of Object.entries(blockThresholds)) {
    if (detections[type as DetectionType].score >= threshold) {
      return true;
    }
  }
  return false;
}

// Main analysis function
export async function analyzeContent(text: string, cyberPeaceMode: boolean = true): Promise<Omit<ScanResult, 'id' | 'createdAt'>> {
  const startTime = performance.now();

  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

  const detectionTypes: DetectionType[] = [
    'toxicity',
    'bias',
    'hallucination',
    'prompt_injection',
    'misinformation',
    'harmful_content',
  ];

  const detectionResults: Record<DetectionType, DetectionResult> = {} as Record<DetectionType, DetectionResult>;
  const flaggedContent: string[] = [];

  for (const type of detectionTypes) {
    const result = analyzeDetectionType(text, type);
    detectionResults[type] = result;
    if (result.flagged) {
      flaggedContent.push(type);
    }
  }

  const trustScore = calculateTrustScore(detectionResults);
  const riskLevel = getRiskLevel(trustScore);
  const cyberPeaceBlocked = cyberPeaceMode && shouldBlockCyberPeace(detectionResults);

  const processingTimeMs = Math.round(performance.now() - startTime);

  // Generate overall explanation
  let explanation = `Trust Score: ${trustScore}/100. `;
  if (flaggedContent.length === 0) {
    explanation += 'No significant risks detected. Content appears safe for use.';
  } else {
    explanation += `Detected issues in: ${flaggedContent.join(', ')}. Review recommended before use.`;
  }

  if (cyberPeaceBlocked) {
    explanation += ' ⚠️ BLOCKED by CyberPeace Mode.';
  }

  return {
    inputText: text,
    trustScore,
    riskLevel,
    detectionResults,
    flaggedContent,
    explanation,
    cyberPeaceBlocked,
    processingTimeMs,
  };
}

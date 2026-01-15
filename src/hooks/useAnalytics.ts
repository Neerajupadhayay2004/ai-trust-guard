import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RiskLevel, DetectionType, AnalyticsData } from '@/types/trustshield';

interface DbScanLog {
  trust_score: number;
  risk_level: string;
  detection_results: Record<string, { flagged?: boolean }>;
  created_at: string;
}

export function useAnalytics() {
  return useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      // Fetch all scan logs for analytics
      const { data: logs, error } = await supabase
        .from('scan_logs')
        .select('trust_score, risk_level, detection_results, created_at')
        .order('created_at', { ascending: false })
        .limit(1000);

      if (error) {
        console.error('Error fetching analytics:', error);
        throw error;
      }

      const typedLogs = logs as DbScanLog[];

      // Calculate analytics
      const totalScans = typedLogs.length;
      const averageTrustScore = totalScans > 0
        ? Math.round(typedLogs.reduce((sum, log) => sum + log.trust_score, 0) / totalScans)
        : 0;

      // Risk distribution
      const riskDistribution: Record<RiskLevel, number> = {
        safe: 0,
        low: 0,
        medium: 0,
        high: 0,
        critical: 0,
      };

      typedLogs.forEach(log => {
        const level = log.risk_level as RiskLevel;
        if (level in riskDistribution) {
          riskDistribution[level]++;
        }
      });

      // Detection breakdown
      const detectionBreakdown: Record<DetectionType, number> = {
        toxicity: 0,
        bias: 0,
        hallucination: 0,
        prompt_injection: 0,
        misinformation: 0,
        harmful_content: 0,
      };

      typedLogs.forEach(log => {
        if (log.detection_results) {
          Object.entries(log.detection_results).forEach(([type, result]) => {
            if (type in detectionBreakdown && result?.flagged) {
              detectionBreakdown[type as DetectionType]++;
            }
          });
        }
      });

      // Recent trend (last 7 days)
      const now = new Date();
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const recentTrend: Array<{ date: string; scans: number; avgScore: number }> = [];

      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        const dayName = days[date.getDay()];

        const dayLogs = typedLogs.filter(log => 
          log.created_at.startsWith(dateStr)
        );

        recentTrend.push({
          date: dayName,
          scans: dayLogs.length,
          avgScore: dayLogs.length > 0
            ? Math.round(dayLogs.reduce((sum, log) => sum + log.trust_score, 0) / dayLogs.length)
            : 0,
        });
      }

      const analytics: AnalyticsData = {
        totalScans,
        averageTrustScore,
        riskDistribution,
        detectionBreakdown,
        recentTrend,
      };

      return analytics;
    },
  });
}

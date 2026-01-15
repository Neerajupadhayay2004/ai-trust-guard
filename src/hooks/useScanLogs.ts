import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { ScanResult, RiskLevel, DetectionType, DetectionResult } from '@/types/trustshield';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

// Type for the database response
interface DbScanLog {
  id: string;
  user_id: string;
  input_text: string;
  trust_score: number;
  risk_level: string;
  detection_results: Record<string, unknown>;
  flagged_content: string[] | null;
  explanation: string | null;
  cyber_peace_blocked: boolean;
  processing_time_ms: number | null;
  created_at: string;
}

// Convert database record to ScanResult
function toScanResult(db: DbScanLog): ScanResult {
  return {
    id: db.id,
    inputText: db.input_text,
    trustScore: db.trust_score,
    riskLevel: db.risk_level as RiskLevel,
    detectionResults: db.detection_results as Record<DetectionType, DetectionResult>,
    flaggedContent: db.flagged_content || [],
    explanation: db.explanation || '',
    cyberPeaceBlocked: db.cyber_peace_blocked,
    processingTimeMs: db.processing_time_ms || 0,
    createdAt: new Date(db.created_at),
  };
}

export function useScanLogs(limit = 50) {
  return useQuery({
    queryKey: ['scan-logs', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('scan_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) {
        console.error('Error fetching scan logs:', error);
        throw error;
      }

      return (data as DbScanLog[]).map(toScanResult);
    },
  });
}

export function useSaveScanLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (scanResult: Omit<ScanResult, 'id' | 'createdAt'>) => {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        // For demo purposes, we'll still save but with a placeholder user_id
        // In production, you'd require authentication
        console.log('No authenticated user, saving to local storage instead');
        return scanResult;
      }

      const insertData = {
        user_id: user.id,
        input_text: scanResult.inputText,
        trust_score: scanResult.trustScore,
        risk_level: scanResult.riskLevel as 'safe' | 'low' | 'medium' | 'high' | 'critical',
        detection_results: JSON.parse(JSON.stringify(scanResult.detectionResults)) as Json,
        flagged_content: scanResult.flaggedContent,
        explanation: scanResult.explanation,
        cyber_peace_blocked: scanResult.cyberPeaceBlocked,
        processing_time_ms: scanResult.processingTimeMs,
      };

      const { data, error } = await supabase
        .from('scan_logs')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error saving scan log:', error);
        throw error;
      }

      return toScanResult(data as DbScanLog);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scan-logs'] });
    },
    onError: (error) => {
      console.error('Failed to save scan log:', error);
      // Don't show error toast for unauthenticated users
    },
  });
}

export function useAnalyzeContent() {
  const saveScanLog = useSaveScanLog();

  return useMutation({
    mutationFn: async ({ text, cyberPeaceMode }: { text: string; cyberPeaceMode: boolean }) => {
      const response = await supabase.functions.invoke('analyze-content', {
        body: { text, cyberPeaceMode },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Analysis failed');
      }

      const result = response.data as Omit<ScanResult, 'id' | 'createdAt'>;
      
      // Try to save to database (will work if user is authenticated)
      try {
        await saveScanLog.mutateAsync(result);
      } catch (e) {
        // Silently fail for unauthenticated users
        console.log('Could not save to database (user may not be authenticated)');
      }

      return result;
    },
    onError: (error: Error) => {
      if (error.message.includes('429')) {
        toast.error('Rate limit exceeded. Please try again later.');
      } else if (error.message.includes('402')) {
        toast.error('AI credits depleted. Please add credits to continue.');
      } else {
        toast.error(`Analysis failed: ${error.message}`);
      }
    },
  });
}

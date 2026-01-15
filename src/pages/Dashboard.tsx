import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrustScoreGauge } from '@/components/TrustScoreGauge';
import { RiskBadge } from '@/components/RiskBadge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useScanLogs } from '@/hooks/useScanLogs';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { Shield, TrendingUp, AlertTriangle, Activity, Zap, Database } from 'lucide-react';

const riskColors: Record<string, string> = {
  safe: 'hsl(142, 76%, 36%)',
  low: 'hsl(174, 72%, 56%)',
  medium: 'hsl(38, 92%, 50%)',
  high: 'hsl(25, 95%, 53%)',
  critical: 'hsl(0, 84%, 60%)',
};

export default function Dashboard() {
  const { data: analytics, isLoading: analyticsLoading } = useAnalytics();
  const { data: recentScans, isLoading: scansLoading } = useScanLogs(5);

  const riskDistributionData = analytics ? [
    { name: 'Safe', value: analytics.riskDistribution.safe, color: riskColors.safe },
    { name: 'Low', value: analytics.riskDistribution.low, color: riskColors.low },
    { name: 'Medium', value: analytics.riskDistribution.medium, color: riskColors.medium },
    { name: 'High', value: analytics.riskDistribution.high, color: riskColors.high },
    { name: 'Critical', value: analytics.riskDistribution.critical, color: riskColors.critical },
  ] : [];

  const detectionBreakdownData = analytics ? [
    { type: 'Toxicity', count: analytics.detectionBreakdown.toxicity },
    { type: 'Bias', count: analytics.detectionBreakdown.bias },
    { type: 'Hallucination', count: analytics.detectionBreakdown.hallucination },
    { type: 'Prompt Inj.', count: analytics.detectionBreakdown.prompt_injection },
    { type: 'Misinfo', count: analytics.detectionBreakdown.misinformation },
    { type: 'Harmful', count: analytics.detectionBreakdown.harmful_content },
  ] : [];

  const flaggedCount = analytics 
    ? Object.values(analytics.detectionBreakdown).reduce((a, b) => a + b, 0) 
    : 0;

  const blockedCount = recentScans?.filter(s => s.cyberPeaceBlocked).length || 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" />
          Analytics Dashboard
        </h1>
        <p className="text-muted-foreground">Real-time data from your AI content safety scans</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { 
            icon: Activity, 
            label: 'Total Scans', 
            value: analyticsLoading ? '...' : analytics?.totalScans.toString() || '0',
            color: 'text-primary' 
          },
          { 
            icon: TrendingUp, 
            label: 'Avg Trust Score', 
            value: analyticsLoading ? '...' : analytics?.averageTrustScore.toString() || '0',
            color: 'text-success' 
          },
          { 
            icon: AlertTriangle, 
            label: 'Flagged Content', 
            value: analyticsLoading ? '...' : flaggedCount.toString(),
            color: 'text-warning' 
          },
          { 
            icon: Shield, 
            label: 'Blocked by CyberPeace', 
            value: scansLoading ? '...' : blockedCount.toString(),
            color: 'text-destructive' 
          },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="glass-card">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    {analyticsLoading || scansLoading ? (
                      <Skeleton className="h-9 w-16 mt-1" />
                    ) : (
                      <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    )}
                  </div>
                  <stat.icon className={`w-10 h-10 ${stat.color} opacity-20`} />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2"
        >
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                Weekly Scan Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={analytics?.recentTrend || []}>
                      <defs>
                        <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(174, 72%, 56%)" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" />
                      <XAxis dataKey="date" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                      <YAxis stroke="hsl(215, 20%, 55%)" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(222, 47%, 10%)', 
                          border: '1px solid hsl(217, 33%, 20%)',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="scans" 
                        stroke="hsl(174, 72%, 56%)" 
                        fillOpacity={1} 
                        fill="url(#colorScans)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Risk Distribution Pie */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="glass-card h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Risk Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Skeleton className="h-[300px] w-full" />
              ) : (
                <>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={riskDistributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={2}
                          dataKey="value"
                        >
                          {riskDistributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(222, 47%, 10%)', 
                            border: '1px solid hsl(217, 33%, 20%)',
                            borderRadius: '8px'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 mt-4">
                    {riskDistributionData.map((item) => (
                      <div key={item.name} className="flex items-center gap-1 text-xs">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-muted-foreground">{item.name}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Detection Breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                Detection Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              {analyticsLoading ? (
                <Skeleton className="h-[250px] w-full" />
              ) : (
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={detectionBreakdownData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 20%)" horizontal={false} />
                      <XAxis type="number" stroke="hsl(215, 20%, 55%)" fontSize={12} />
                      <YAxis dataKey="type" type="category" stroke="hsl(215, 20%, 55%)" fontSize={11} width={80} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(222, 47%, 10%)', 
                          border: '1px solid hsl(217, 33%, 20%)',
                          borderRadius: '8px'
                        }}
                      />
                      <Bar dataKey="count" fill="hsl(174, 72%, 56%)" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Scans */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Recent Scans
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scansLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Skeleton key={i} className="h-20 w-full" />
                  ))}
                </div>
              ) : recentScans && recentScans.length > 0 ? (
                <div className="space-y-3">
                  {recentScans.map((scan) => (
                    <div 
                      key={scan.id}
                      className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <p className="text-sm truncate">{scan.inputText}</p>
                        <p className="text-xs text-muted-foreground">
                          {scan.createdAt.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <TrustScoreGauge score={scan.trustScore} riskLevel={scan.riskLevel} size="sm" animated={false} />
                        <RiskBadge level={scan.riskLevel} size="sm" showIcon={false} />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Activity className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No scans yet. Start analyzing content!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

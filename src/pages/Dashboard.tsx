import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrustScoreGauge } from '@/components/TrustScoreGauge';
import { RiskBadge } from '@/components/RiskBadge';
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
import { Shield, TrendingUp, AlertTriangle, Activity, Users, Zap } from 'lucide-react';

// Mock data for the dashboard
const trendData = [
  { date: 'Mon', scans: 120, avgScore: 78 },
  { date: 'Tue', scans: 145, avgScore: 82 },
  { date: 'Wed', scans: 98, avgScore: 75 },
  { date: 'Thu', scans: 167, avgScore: 85 },
  { date: 'Fri', scans: 189, avgScore: 79 },
  { date: 'Sat', scans: 76, avgScore: 88 },
  { date: 'Sun', scans: 54, avgScore: 91 },
];

const riskDistribution = [
  { name: 'Safe', value: 45, color: 'hsl(142, 76%, 36%)' },
  { name: 'Low', value: 28, color: 'hsl(174, 72%, 56%)' },
  { name: 'Medium', value: 15, color: 'hsl(38, 92%, 50%)' },
  { name: 'High', value: 8, color: 'hsl(25, 95%, 53%)' },
  { name: 'Critical', value: 4, color: 'hsl(0, 84%, 60%)' },
];

const detectionBreakdown = [
  { type: 'Toxicity', count: 23 },
  { type: 'Bias', count: 45 },
  { type: 'Hallucination', count: 67 },
  { type: 'Prompt Inj.', count: 12 },
  { type: 'Misinfo', count: 34 },
  { type: 'Harmful', count: 8 },
];

const recentScans = [
  { id: 1, text: 'AI response about climate change...', score: 92, risk: 'safe' as const, time: '2 min ago' },
  { id: 2, text: 'Generated code snippet for auth...', score: 78, risk: 'low' as const, time: '5 min ago' },
  { id: 3, text: 'Marketing copy with claims...', score: 54, risk: 'medium' as const, time: '12 min ago' },
  { id: 4, text: 'Response with bias patterns...', score: 35, risk: 'high' as const, time: '18 min ago' },
  { id: 5, text: 'Safe educational content...', score: 95, risk: 'safe' as const, time: '25 min ago' },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Analytics Dashboard</h1>
        <p className="text-muted-foreground">Monitor AI content safety across your organization</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Activity, label: 'Total Scans', value: '849', change: '+12%', color: 'text-primary' },
          { icon: TrendingUp, label: 'Avg Trust Score', value: '82.4', change: '+5.2%', color: 'text-success' },
          { icon: AlertTriangle, label: 'Flagged Content', value: '27', change: '-8%', color: 'text-warning' },
          { icon: Shield, label: 'Blocked by CyberPeace', value: '12', change: '-15%', color: 'text-destructive' },
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
                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                    <p className={`text-sm mt-1 ${stat.change.startsWith('+') ? 'text-success' : 'text-destructive'}`}>
                      {stat.change} from last week
                    </p>
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
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
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
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {riskDistribution.map((entry, index) => (
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
                {riskDistribution.map((item) => (
                  <div key={item.name} className="flex items-center gap-1 text-xs">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
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
              <div className="h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={detectionBreakdown} layout="vertical">
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
              <div className="space-y-3">
                {recentScans.map((scan) => (
                  <div 
                    key={scan.id}
                    className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg"
                  >
                    <div className="flex-1 min-w-0 mr-4">
                      <p className="text-sm truncate">{scan.text}</p>
                      <p className="text-xs text-muted-foreground">{scan.time}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrustScoreGauge score={scan.score} riskLevel={scan.risk} size="sm" animated={false} />
                      <RiskBadge level={scan.risk} size="sm" showIcon={false} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

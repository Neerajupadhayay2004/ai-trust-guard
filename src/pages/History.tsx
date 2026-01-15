import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrustScoreGauge } from '@/components/TrustScoreGauge';
import { RiskBadge } from '@/components/RiskBadge';
import { useScanLogs } from '@/hooks/useScanLogs';
import { Skeleton } from '@/components/ui/skeleton';
import { Search, Filter, Calendar, ChevronDown, ChevronUp, Clock, Shield, Database } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: scanLogs, isLoading, error } = useScanLogs(100);

  const filteredHistory = scanLogs?.filter((item) => {
    const matchesSearch = item.inputText.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRisk = riskFilter === 'all' || item.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  }) || [];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" />
          Scan History
        </h1>
        <p className="text-muted-foreground">View and analyze all past content scans from the database</p>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search scan history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input"
          />
        </div>
        
        <Select value={riskFilter} onValueChange={setRiskFilter}>
          <SelectTrigger className="w-full sm:w-[180px] bg-input">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filter by risk" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Risks</SelectItem>
            <SelectItem value="safe">Safe</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
            <SelectItem value="critical">Critical</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <Card className="glass-card">
          <CardContent className="py-12 text-center">
            <Shield className="w-12 h-12 mx-auto text-destructive/50 mb-4" />
            <p className="text-destructive">Failed to load scan history</p>
            <p className="text-sm text-muted-foreground mt-2">
              Make sure you're logged in to see your scan history
            </p>
          </CardContent>
        </Card>
      )}

      {/* History List */}
      {!isLoading && !error && (
        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Card className={cn(
                'glass-card overflow-hidden transition-all',
                item.cyberPeaceBlocked && 'border-destructive/50'
              )}>
                <CardContent className="p-0">
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full text-left p-4 hover:bg-secondary/20 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <RiskBadge level={item.riskLevel} size="sm" />
                          {item.cyberPeaceBlocked && (
                            <span className="px-2 py-0.5 text-xs bg-destructive/20 text-destructive rounded-full flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              Blocked
                            </span>
                          )}
                        </div>
                        <p className="text-sm line-clamp-2 mb-2">{item.inputText}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.createdAt.toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.createdAt.toLocaleTimeString()}
                          </span>
                          <span>{item.processingTimeMs}ms</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <TrustScoreGauge 
                          score={item.trustScore} 
                          riskLevel={item.riskLevel}
                          size="sm"
                          animated={false}
                        />
                        {expandedId === item.id ? (
                          <ChevronUp className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </button>
                  
                  {expandedId === item.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border"
                    >
                      <div className="p-4 space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Full Text</h4>
                          <p className="text-sm bg-secondary/30 p-3 rounded-lg font-mono">
                            {item.inputText}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium mb-2">Analysis</h4>
                          <p className="text-sm text-muted-foreground">
                            {item.explanation}
                          </p>
                        </div>
                        
                        {item.flaggedContent.length > 0 && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Flagged Categories</h4>
                            <div className="flex flex-wrap gap-2">
                              {item.flaggedContent.map((type) => (
                                <span 
                                  key={type}
                                  className="px-2 py-1 bg-risk-high/20 text-risk-high text-xs rounded-full uppercase"
                                >
                                  {type.replace('_', ' ')}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Detection Details */}
                        <div>
                          <h4 className="text-sm font-medium mb-2">Detection Scores</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {Object.entries(item.detectionResults).map(([type, result]) => (
                              <div key={type} className="bg-secondary/30 p-2 rounded text-xs">
                                <div className="flex justify-between items-center">
                                  <span className="capitalize">{type.replace('_', ' ')}</span>
                                  <span className={cn(
                                    'font-mono font-semibold',
                                    result.flagged ? 'text-risk-high' : 'text-risk-safe'
                                  )}>
                                    {Math.round(result.score * 100)}%
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}

          {filteredHistory.length === 0 && !isLoading && (
            <Card className="glass-card">
              <CardContent className="py-12 text-center">
                <Search className="w-12 h-12 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground">
                  {scanLogs?.length === 0 
                    ? "No scans yet. Start analyzing content to build your history!" 
                    : "No scans found matching your criteria"}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}

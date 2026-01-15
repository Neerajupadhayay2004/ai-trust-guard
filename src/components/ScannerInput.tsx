import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Shield, Loader2, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScannerInputProps {
  onScan: (text: string, cyberPeaceMode: boolean) => Promise<void>;
  isScanning: boolean;
  cyberPeaceMode: boolean;
  onCyberPeaceModeChange: (enabled: boolean) => void;
}

export function ScannerInput({ 
  onScan, 
  isScanning, 
  cyberPeaceMode,
  onCyberPeaceModeChange 
}: ScannerInputProps) {
  const [text, setText] = useState('');

  const handleScan = async () => {
    if (text.trim() && !isScanning) {
      await onScan(text, cyberPeaceMode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleScan();
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Paste AI-generated text here to analyze for risks, bias, hallucinations, and prompt injection attempts..."
          className={cn(
            'min-h-[160px] bg-input border-border/50 resize-none',
            'focus:border-primary focus:ring-2 focus:ring-primary/20',
            'placeholder:text-muted-foreground/50',
            isScanning && 'opacity-50 cursor-not-allowed'
          )}
          disabled={isScanning}
        />
        
        {isScanning && (
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-lg"
            animate={{
              backgroundPosition: ['0% 0%', '100% 0%'],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: 'linear',
            }}
            style={{
              backgroundSize: '200% 100%',
            }}
          />
        )}
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2">
            <Switch
              id="cyber-peace-mode"
              checked={cyberPeaceMode}
              onCheckedChange={onCyberPeaceModeChange}
              disabled={isScanning}
            />
            <Label 
              htmlFor="cyber-peace-mode" 
              className="flex items-center gap-2 cursor-pointer"
            >
              <Shield className={cn(
                'w-4 h-4 transition-colors',
                cyberPeaceMode ? 'text-primary' : 'text-muted-foreground'
              )} />
              <span className="text-sm">CyberPeace Mode</span>
            </Label>
          </div>
          
          <AnimatePresence>
            {cyberPeaceMode && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full"
              >
                <Sparkles className="w-3 h-3 inline mr-1" />
                Active Protection
              </motion.span>
            )}
          </AnimatePresence>
        </div>
        
        <Button
          onClick={handleScan}
          disabled={!text.trim() || isScanning}
          size="lg"
          className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 shadow-glow"
        >
          {isScanning ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 mr-2" />
              Analyze Content
            </>
          )}
        </Button>
      </div>
      
      <p className="text-xs text-muted-foreground">
        Press <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-secondary rounded text-xs font-mono">Enter</kbd> to analyze
      </p>
    </div>
  );
}

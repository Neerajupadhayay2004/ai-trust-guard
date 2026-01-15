import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  LayoutDashboard, 
  History, 
  Settings, 
  FileText,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', label: 'Scanner', icon: Shield },
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/history', label: 'History', icon: History },
  { path: '/admin', label: 'Admin', icon: Settings },
  { path: '/docs', label: 'API Docs', icon: FileText },
];

export function Header() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-glow">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <motion.div 
                className="absolute inset-0 rounded-xl bg-gradient-primary opacity-50 blur-lg -z-10"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gradient">AI TrustShield</h1>
              <p className="text-xs text-muted-foreground">Guardrails for Trustworthy AI</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant="ghost"
                    size="sm"
                    className={cn(
                      'relative flex items-center gap-2 transition-colors',
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute inset-0 bg-primary/10 rounded-md -z-10"
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Button>
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-border/50"
          >
            <div className="flex flex-col gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link 
                    key={item.path} 
                    to={item.path}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Button
                      variant="ghost"
                      className={cn(
                        'w-full justify-start gap-3',
                        isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Button>
                  </Link>
                );
              })}
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}

import { cn } from './Button';
import type { ErrorType, Severity } from '@/types';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'error' | 'warning' | 'success' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  const variants = {
    default: 'bg-gray-100 text-gray-700',
    error: 'bg-error/10 text-error',
    warning: 'bg-warningYellow/10 text-warningYellow',
    success: 'bg-success/10 text-success',
    info: 'bg-accent/10 text-accent',
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <span className={cn('inline-flex items-center rounded-full font-medium', variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
}

interface ErrorBadgeProps {
  type: ErrorType;
}

export function ErrorBadge({ type }: ErrorBadgeProps) {
  const config: Record<ErrorType, { label: string; variant: BadgeProps['variant'] }> = {
    format: { label: '格式', variant: 'info' },
    logic: { label: '逻辑', variant: 'warning' },
    compliance: { label: '合规', variant: 'error' },
    technical: { label: '技术', variant: 'info' },
    typo: { label: '文案', variant: 'default' },
  };

  return <Badge variant={config[type].variant}>{config[type].label}</Badge>;
}

interface SeverityBadgeProps {
  severity: Severity;
}

export function SeverityBadge({ severity }: SeverityBadgeProps) {
  const config: Record<Severity, { label: string; icon: React.ReactNode; variant: BadgeProps['variant'] }> = {
    high: { label: '严重', icon: <AlertCircle className="w-3 h-3 mr-1" />, variant: 'error' },
    medium: { label: '中等', icon: <AlertTriangle className="w-3 h-3 mr-1" />, variant: 'warning' },
    low: { label: '轻微', icon: <Info className="w-3 h-3 mr-1" />, variant: 'default' },
  };

  const { label, icon, variant } = config[severity];

  return (
    <Badge variant={variant}>
      {icon}
      {label}
    </Badge>
  );
}

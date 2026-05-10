import { cn } from './Button';

interface ProgressProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'accent' | 'warning' | 'success';
}

export function Progress({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'accent',
}: ProgressProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const heights = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    accent: 'bg-accent',
    warning: 'bg-warning',
    success: 'bg-success',
  };

  return (
    <div className="w-full">
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', heights[size])}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-300 ease-expert',
            colors[color]
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="mt-1 text-sm text-gray-600 text-right">
          {Math.round(percentage)}%
        </div>
      )}
    </div>
  );
}

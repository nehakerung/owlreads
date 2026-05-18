import { cn } from '@/lib/utils';

const variantStyles = {
  error: 'bg-red-100 border-red-400 text-red-700',
  success: 'bg-green-100 border-green-400 text-green-700',
} as const;

type AlertBannerProps = {
  variant?: keyof typeof variantStyles;
  children: React.ReactNode;
  className?: string;
};

export function AlertBanner({
  variant = 'error',
  children,
  className,
}: AlertBannerProps) {
  return (
    <div
      className={cn(
        'border px-4 py-3 rounded',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </div>
  );
}

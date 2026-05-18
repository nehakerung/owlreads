import { cn } from '@/lib/utils';

type InlineLoadingCardProps = {
  message: string;
  className?: string;
};

export function InlineLoadingCard({
  message,
  className,
}: InlineLoadingCardProps) {
  return (
    <div
      className={cn(
        'bg-card rounded-lg shadow p-6 text-muted-foreground',
        className
      )}
    >
      {message}
    </div>
  );
}

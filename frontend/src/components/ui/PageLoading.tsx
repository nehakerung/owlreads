import { cn } from '@/lib/utils';

type PageLoadingProps = {
  message?: string;
  className?: string;
};

export function PageLoading({
  message = 'Loading...',
  className,
}: PageLoadingProps) {
  return (
    <div
      className={cn(
        'min-h-screen flex items-center justify-center',
        className
      )}
    >
      <div className="text-xl">{message}</div>
    </div>
  );
}

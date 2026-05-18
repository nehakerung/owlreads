import Image from 'next/image';
import { cn } from '@/lib/utils';

type AuthFormLayoutProps = {
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  description?: React.ReactNode;
  showLogo?: boolean;
  logoSize?: number;
  className?: string;
};

export function AuthFormLayout({
  title,
  children,
  footer,
  description,
  showLogo = false,
  logoSize = 250,
  className,
}: AuthFormLayoutProps) {
  return (
    <div className="p-10 min-h-screen flex items-center justify-center">
      <div
        className={cn(
          'bg-card max-w-md w-full space-y-8 p-8 rounded-lg shadow',
          className
        )}
      >
        {showLogo ? (
          <div className="flex items-center justify-center">
            <Image
              src="/OwlReadsLogo.png"
              alt="OwlReads Logo"
              width={logoSize}
              height={logoSize}
              className="mr-3"
            />
          </div>
        ) : null}

        <h2 className="text-3xl font-bold text-center">{title}</h2>

        {description ? (
          <div className="text-sm text-center text-muted-foreground">
            {description}
          </div>
        ) : null}

        {children}

        {footer ? <div className="text-center text-sm">{footer}</div> : null}
      </div>
    </div>
  );
}

import Link from 'next/link';

type UnauthorizedCardProps = {
  message?: string;
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  className?: string;
};

export function UnauthorizedCard({
  message = 'You are not authorized to view this page.',
  backHref,
  backLabel = 'Go Back',
  onBack,
  className = 'p-8 text-center',
}: UnauthorizedCardProps) {
  return (
    <div className={className}>
      <p className="text-red-500 font-medium">{message}</p>
      {backHref ? (
        <Link
          href={backHref}
          className="mt-4 text-sm text-gray-500 underline inline-block"
        >
          {backLabel}
        </Link>
      ) : onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm text-gray-500 underline"
        >
          {backLabel}
        </button>
      ) : null}
    </div>
  );
}

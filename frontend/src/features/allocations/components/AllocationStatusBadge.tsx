import { allocationStatusMetaFromShelfStatus } from '../mappers';

export function AllocationStatusBadge(props: { shelfStatus: string }) {
  const statusMeta = allocationStatusMetaFromShelfStatus(props.shelfStatus);

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${statusMeta.pill}`}
    >
      <span className={`w-2 h-2 rounded-full ${statusMeta.dot}`} />
      {statusMeta.label}
    </span>
  );
}

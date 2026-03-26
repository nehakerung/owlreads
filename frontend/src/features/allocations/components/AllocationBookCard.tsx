import type { Allocation, AllocationGroup } from '../types';
import { computeAllocationStats } from '../mappers';
import { AllocationStatusBadge } from './AllocationStatusBadge';

export function AllocationBookCard(props: {
  group: AllocationGroup;
  onSelectAllocation: (allocation: Allocation) => void;
}) {
  const { group, onSelectAllocation } = props;
  const bookStats = computeAllocationStats(group.allocations);

  return (
    <div className="bg-white border border-input rounded-2xl shadow-sm overflow-hidden">
      <div className="p-5 bg-gradient-to-r from-slate-50 to-white border-b border-input">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs uppercase tracking-wide text-muted-foreground">
              Book allocation
            </div>
            <div className="text-lg font-semibold truncate">
              {group.book_title}
            </div>

            <div className="mt-2 text-sm text-muted-foreground flex flex-wrap gap-x-3 gap-y-1">
              <span>
                <span className="font-semibold text-slate-900">
                  {bookStats.engaged}/{bookStats.total}
                </span>{' '}
                engaged
              </span>
              <span>
                <span className="font-semibold text-slate-900">
                  {bookStats.read}/{bookStats.total}
                </span>{' '}
                completed
              </span>
              <span>
                <span className="font-semibold text-slate-900">
                  {bookStats.notStarted}/{bookStats.total}
                </span>{' '}
                not started
              </span>
            </div>
          </div>

          <div className="w-full md:w-64">
            <div className="text-xs text-muted-foreground mb-1">Progress</div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${bookStats.engagedPct}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {bookStats.engagedPct}% engaged
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium bg-slate-50 text-slate-700 border-slate-200">
            <span className="w-2 h-2 rounded-full bg-slate-400" />
            Not Started: {bookStats.notStarted}
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium bg-amber-50 text-amber-800 border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            Reading: {bookStats.reading}
          </span>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-medium bg-emerald-50 text-emerald-800 border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Read: {bookStats.read}
          </span>
        </div>
      </div>

      <div className="divide-y divide-input">
        {group.allocations.map((allocation, index) => {
          const rowBackground = index % 2 === 0 ? 'bg-white' : 'bg-slate-50/60';

          return (
            <button
              key={allocation.entry_id}
              type="button"
              onClick={() => onSelectAllocation(allocation)}
              className={`w-full text-left px-5 py-3 ${rowBackground} hover:bg-blue-50/40 transition`}
              title="Click to manage this allocation"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-medium truncate text-slate-900">
                    {allocation.student_name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {allocation.allocated_at
                      ? `Allocated: ${new Date(
                          allocation.allocated_at
                        ).toLocaleString()}`
                      : 'Allocated: —'}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <AllocationStatusBadge shelfStatus={allocation.status} />
                  <span className="text-xs text-muted-foreground">
                    Click to manage
                  </span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

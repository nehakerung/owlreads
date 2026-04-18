import type { AllocationStats } from '../types';

export function TeacherAllocationSummaryCards(props: {
  overallStats: AllocationStats;
}) {
  const { overallStats } = props;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-card-2 border border-input rounded-xl p-4 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Engaged
        </div>
        <div className="mt-1 text-2xl font-bold">
          {overallStats.engaged}/{overallStats.total}
        </div>
        <div className="text-sm text-muted-foreground">
          {overallStats.engagedPct}% engaged (Reading or Read)
        </div>
        <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full"
            style={{ width: `${overallStats.engagedPct}%` }}
          />
        </div>
      </div>

      <div className="bg-card-2 border border-input rounded-xl p-4 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Not Started
        </div>
        <div className="mt-1 text-2xl font-bold">
          {overallStats.notStarted}/{overallStats.total}
        </div>
        <div className="text-sm text-muted-foreground">
          Students who haven’t moved it yet
        </div>
      </div>

      <div className="bg-card-2 border border-input rounded-xl p-4 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Reading
        </div>
        <div className="mt-1 text-2xl font-bold">
          {overallStats.reading}/{overallStats.total}
        </div>
        <div className="text-sm text-muted-foreground">
          {overallStats.reading} out of {overallStats.total} moved to Reading
        </div>
      </div>

      <div className="bg-card-2 border border-input rounded-xl p-4 shadow-sm">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          Read
        </div>
        <div className="mt-1 text-2xl font-bold">
          {overallStats.read}/{overallStats.total}
        </div>
        <div className="text-sm text-muted-foreground">
          {overallStats.readPct}% completed
        </div>
        <div className="mt-3 h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 rounded-full"
            style={{ width: `${overallStats.readPct}%` }}
          />
        </div>
      </div>
    </div>
  );
}

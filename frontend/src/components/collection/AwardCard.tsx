'use client';

import type { LucideIcon } from 'lucide-react';
import { Lock } from 'lucide-react';
import type { Award, DisplayAward } from './types';

type AwardCardProps = {
  award: DisplayAward;
  earned: boolean;
  earnedAward?: Award;
  icon: LucideIcon;
  earnedIconClass: string;
  earnedDateClass: string;
  unlockHint: string;
  subtitle?: string;
};

export function AwardCard({
  award,
  earned,
  earnedAward,
  icon: Icon,
  earnedIconClass,
  earnedDateClass,
  unlockHint,
  subtitle,
}: AwardCardProps) {
  return (
    <div
      className={`bg-card rounded-lg shadow p-5 flex items-start gap-4 transition ${
        earned ? 'opacity-100' : 'opacity-50'
      }`}
    >
      <div
        className={`rounded-full p-3 flex-shrink-0 ${
          earned ? earnedIconClass : 'bg-muted text-muted-foreground'
        }`}
      >
        {earned ? <Icon size={22} /> : <Lock size={22} />}
      </div>

      <div>
        <p className="font-semibold">{award.label}</p>
        {subtitle ? (
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-0.5">
            {subtitle}
          </p>
        ) : null}
        <p className={`text-sm text-muted-foreground ${subtitle ? 'mt-1' : ''}`}>
          {award.description}
        </p>
        {earned && earnedAward ? (
          <p className={`text-xs mt-1 ${earnedDateClass}`}>
            Earned {new Date(earnedAward.earned_at).toLocaleDateString()}
          </p>
        ) : null}
        {!earned ? (
          <p className="text-xs text-muted-foreground mt-1">{unlockHint}</p>
        ) : null}
      </div>
    </div>
  );
}

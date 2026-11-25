'use client';

import { use, useCallback, useEffect, useMemo, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { ApiError, errorMessage, getMatches } from '@/lib/api';
import type { EventType, Match, Team } from '@/lib/types';
import { cn } from '@/lib/utils';
import { BoutCards, STATUS } from './bout-cards';

type Params = {
  eventType: string;
  tourneyId: string;
};

const REFRESH_MS = 20_000;

function sinceLabel(at: Date | null, now: number) {
  if (!at) return 'Loading';
  const s = Math.max(0, Math.round((now - at.getTime()) / 1000));
  return s < 5 ? 'Updated just now' : s < 60 ? `Updated ${s}s ago` : `Updated ${Math.floor(s / 60)} min ago`;
}

export default function MatSchedulePage({ params }: { params: Promise<Params> }) {
  const { eventType, tourneyId } = use(params);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<{ message: string; unavailable: boolean } | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [mat, setMat] = useQueryState('mat', parseAsInteger.withDefault(-1));
  const [schoolId, setSchoolId] = useQueryState('schoolId', parseAsString.withDefault('all'));

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      setMatches(await getMatches(eventType as EventType, tourneyId));
      setUpdatedAt(new Date());
      setError(null);
    } catch (err) {
      setError({
        message: errorMessage(err, 'Could not load the mat schedule.'),
        unavailable: err instanceof ApiError && err.status === 404,
      });
    } finally {
      setLoading(false);
    }
  }, [eventType, tourneyId]);

  useEffect(() => {
    fetchMatches();
    const refresh = setInterval(fetchMatches, REFRESH_MS);
    const tick = setInterval(() => setNow(Date.now()), 5_000);
    return () => { clearInterval(refresh); clearInterval(tick); };
  }, [fetchMatches]);

  const mats = useMemo(() => Array.from(new Set(matches.map(m => m.mat))).sort((a, b) => a - b), [matches]);

  const schools = useMemo(() => {
    const byId = new Map<string, Team>();
    for (const m of matches) {
      for (const team of [m.wrestler1.team, m.wrestler2.team]) {
        if (team.id && !byId.has(team.id)) byId.set(team.id, team);
      }
    }
    return Array.from(byId.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

  const byMat = useMemo(() => {
    const shown = matches.filter(m =>
      (mat === -1 || m.mat === mat) &&
      (schoolId === 'all' || m.wrestler1.team.id === schoolId || m.wrestler2.team.id === schoolId));
    return mats
      .map(n => ({
        mat: n,
        bouts: shown.filter(m => m.mat === n).sort((a, b) => STATUS[a.status].order - STATUS[b.status].order || a.bout - b.bout),
      }))
      .filter(g => g.bouts.length > 0);
  }, [matches, mats, mat, schoolId]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="-mx-4 flex flex-1 gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Mat">
          <button type="button" className="chip" aria-pressed={mat === -1} onClick={() => setMat(null)}>All mats</button>
          {mats.map(n => (
            <button key={n} type="button" className="chip tabular-nums" aria-pressed={mat === n} onClick={() => setMat(n)}>
              Mat {n}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <label className="flex-1 sm:w-64 sm:flex-none">
            <span className="sr-only">School</span>
            <select value={schoolId} onChange={e => setSchoolId(e.target.value === 'all' ? null : e.target.value)} className="field h-9 text-sm">
              <option value="all">All schools</option>
              {schools.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={fetchMatches}
            disabled={loading}
            className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md border border-line bg-white px-3 text-sm text-ink-soft hover:text-ink disabled:opacity-60"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} aria-hidden="true" />
            <span aria-live="polite">{sinceLabel(updatedAt, now)}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className={cn('mt-6 rounded-lg border bg-white p-4', error.unavailable ? 'border-line text-ink-soft' : 'border-corner-red/30 text-ink')}>
          {error.unavailable ? 'This tournament doesn’t publish a mat schedule.' : error.message}
        </div>
      )}

      {!error && updatedAt && byMat.length === 0 && (
        <div className="mt-6 rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center">
          <p className="font-display text-xl font-semibold">
            {matches.length === 0 ? 'No bouts on the mats' : 'No bouts for this filter'}
          </p>
          <p className="mt-1 text-ink-soft">
            {matches.length === 0
              ? 'Bouts appear here once they’re sent to a mat. This page checks again every 20 seconds.'
              : 'Pick another mat or school, or show all mats.'}
          </p>
        </div>
      )}

      <div className="mt-6">
        <BoutCards groups={byMat} schoolId={schoolId} />
      </div>
    </div>
  );
}

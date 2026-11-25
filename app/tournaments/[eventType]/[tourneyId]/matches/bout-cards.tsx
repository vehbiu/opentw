import type { Match, Wrestler } from '@/lib/types';
import { cn } from '@/lib/utils';

export type MatGroup = { mat: number; bouts: Match[] };
type Props = { groups: MatGroup[]; schoolId: string };

export const STATUS = {
  in_progress: { label: 'On the mat', order: 0, text: 'text-corner-red', dot: 'bg-corner-red animate-pulse', badge: 'bg-corner-red text-white' },
  on_deck: { label: 'On deck', order: 1, text: 'text-deck', dot: 'bg-deck', badge: 'bg-deck-bg text-deck' },
  in_hole: { label: 'In the hole', order: 2, text: 'text-ink-faint', dot: 'bg-ink-faint/50', badge: 'bg-paper text-ink-soft' },
} as const;

function fullName(w: Wrestler) {
  return `${w.first_name} ${w.last_name}`.trim() || 'To be decided';
}

function isMine(w: Wrestler, schoolId: string) {
  return schoolId !== 'all' && w.team.id === schoolId;
}

function CornerBar({ corner, className }: { corner: 'red' | 'green'; className?: string }) {
  return <span className={cn('w-1 shrink-0 rounded-full', corner === 'red' ? 'bg-corner-red' : 'bg-corner-green', className)} aria-hidden="true" />;
}

/** A wrestler on two lines: name, then the full team name. */
function WrestlerStacked({ wrestler, corner, schoolId }: { wrestler: Wrestler; corner: 'red' | 'green'; schoolId: string }) {
  return (
    <div className={cn('flex items-stretch gap-3 rounded-r', isMine(wrestler, schoolId) && 'bg-mat-100')}>
      <CornerBar corner={corner} />
      <div className="min-w-0 py-0.5">
        <div className="truncate text-[17px] font-semibold leading-snug text-ink">{fullName(wrestler)}</div>
        {wrestler.team.name && <div className="truncate text-sm text-ink-soft">{wrestler.team.name}</div>}
      </div>
    </div>
  );
}

function BoutMeta({ match, className }: { match: Match; className?: string }) {
  return (
    <span className={cn('flex flex-wrap gap-x-2.5 text-sm text-ink-soft', className)}>
      {match.weight_class && <span className="font-semibold text-ink">{match.weight_class}</span>}
      {match.round && <span>{match.round}</span>}
    </span>
  );
}

/** One card per bout, with its mat, bout number and a status badge. */
export function BoutCards({ groups, schoolId }: Props) {
  const bouts = groups.flatMap(g => g.bouts);
  return (
    <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {bouts.map(m => {
        const s = STATUS[m.status];
        return (
          <li key={`${m.mat}-${m.bout}-${m.wrestler1.id}`} className={cn('rounded-lg border bg-white', m.status === 'in_progress' ? 'border-corner-red/40' : 'border-line')}>
            <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-2.5">
              <div className="flex items-baseline gap-3 font-display">
                <span className="text-2xl font-bold leading-none tabular-nums">Mat {m.mat}</span>
                {m.bout > 0 && <span className="text-base font-medium tabular-nums text-ink-faint">Bout {m.bout}</span>}
              </div>
              <span className={cn('rounded-full px-2.5 py-1 text-xs font-semibold', s.badge)}>{s.label}</span>
            </div>
            <div className="space-y-2 px-4 py-3">
              <BoutMeta match={m} />
              <WrestlerStacked wrestler={m.wrestler1} corner="red" schoolId={schoolId} />
              <WrestlerStacked wrestler={m.wrestler2} corner="green" schoolId={schoolId} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

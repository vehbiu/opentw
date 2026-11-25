import type { BracketBout, BracketSheet, BracketSide } from '@/lib/types';
import { cn } from '@/lib/utils';

type Section = { title: string; rounds: { name: string; bouts: BracketBout[] }[] };

function sectionOf(round: string): 'championship' | 'consolation' | 'placement' {
    if (/place/i.test(round)) return 'placement';
    if (/cons/i.test(round)) return 'consolation';
    return 'championship';
}

function boutNumber(bout: BracketBout): number {
    const n = parseInt(bout.bout_number ?? '', 10);
    return Number.isNaN(n) ? Number.MAX_SAFE_INTEGER : n;
}

/** Group bouts into championship, consolation and placement sections, one column per round in the order they're wrestled. */
function buildSections(bouts: BracketBout[]): Section[] {
    const byRound = new Map<string, BracketBout[]>();
    for (const bout of bouts) {
        const round = bout.round || 'Bouts';
        byRound.set(round, [...(byRound.get(round) ?? []), bout]);
    }

    const sections: Record<string, Section> = {
        championship: { title: 'Championship', rounds: [] },
        consolation: { title: 'Consolation', rounds: [] },
        placement: { title: 'Placement matches', rounds: [] },
    };
    for (const [name, roundBouts] of byRound) {
        const sorted = [...roundBouts].sort((a, b) => (a.y ?? 0) - (b.y ?? 0) || boutNumber(a) - boutNumber(b));
        sections[sectionOf(name)].rounds.push({ name, bouts: sorted });
    }
    for (const section of Object.values(sections)) {
        section.rounds.sort((a, b) => Math.min(...a.bouts.map(boutNumber)) - Math.min(...b.bouts.map(boutNumber)));
    }
    return Object.values(sections).filter(s => s.rounds.length > 0);
}

function resultText(bout: BracketBout): string | null {
    if (!bout.result) return null;
    const winner = bout.top?.winner ? bout.top : bout.bottom?.winner ? bout.bottom : null;
    const loser = winner === bout.top ? bout.bottom : bout.top;
    const parts = [bout.result];
    if (bout.time) {
        // FloWrestling's result sometimes carries the time already ("TF 2:00").
        if (!bout.result.includes(bout.time)) parts.push(bout.time);
    } else if (winner?.score != null && loser?.score != null && bout.win_type !== 'fall') {
        parts.push(`${winner.score}-${loser.score}`);
    }
    return parts.join(' ');
}

// FloWrestling bout states, for bouts not yet wrestled.
const STATES: Record<string, { label: string; className: string }> = {
    'in-progress': { label: 'On the mat', className: 'text-corner-red' },
    'on-deck': { label: 'On deck', className: 'text-deck' },
    'in-hole': { label: 'In the hole', className: 'text-ink-soft' },
    'upcoming': { label: 'Up next', className: 'text-mat-400' },
};

function SideRow({ side, corner, isBye, showScore }: { side: BracketSide | null; corner: 'red' | 'green'; isBye: boolean; showScore: boolean }) {
    return (
        <div className="flex items-center gap-2 py-1 pr-2.5 text-sm">
            <span className={cn('h-5 w-[3px] shrink-0 rounded-full', side ? (corner === 'red' ? 'bg-corner-red' : 'bg-corner-green') : 'bg-line')} aria-hidden="true" />
            {side ? (
                <>
                    <span className="w-5 shrink-0 text-right text-xs tabular-nums text-ink-faint">{side.seed ?? ''}</span>
                    <span
                        className={cn('min-w-0 flex-1 truncate', side.winner ? 'font-semibold text-ink' : 'text-ink-soft')}
                        title={side.team ? `${side.name}, ${side.team}` : side.name}
                    >
                        {side.name}
                        {(side.team_abbreviation || side.team) && side.team !== side.name && (
                            <span className="ml-1.5 text-xs font-normal text-ink-faint">{side.team_abbreviation || side.team}</span>
                        )}
                    </span>
                    {showScore && side.score != null && (
                        <span className={cn('tabular-nums', side.winner ? 'font-semibold text-ink' : 'text-ink-faint')}>{side.score}</span>
                    )}
                </>
            ) : (
                <span className="pl-7 italic text-ink-faint">{isBye ? 'Bye' : 'To be decided'}</span>
            )}
        </div>
    );
}

function BoutCard({ bout }: { bout: BracketBout }) {
    const result = resultText(bout);
    const isBye = bout.state === 'bye';
    // Unwrestled bouts come back with 0-0 scores; only show scores once there's a result.
    const showScore = Boolean(bout.result) && bout.win_type !== 'bye';
    const state = bout.state ? STATES[bout.state] : undefined;
    const busy = bout.state === 'in-progress' || bout.state === 'on-deck';
    return (
        <div className={cn('w-60 rounded-md border bg-white', busy ? 'border-deck/60' : 'border-line', isBye && 'opacity-70')}>
            <div className="flex items-center justify-between gap-2 border-b border-line/70 px-2.5 py-1 text-xs text-ink-faint">
                <span className="tabular-nums">
                    {bout.bout_number && <>Bout {bout.bout_number}</>}
                    {bout.mat && <span className="ml-2">{bout.mat}</span>}
                </span>
                {result ? (
                    <span className="font-semibold text-ink">{result}</span>
                ) : state ? (
                    <span className={cn('font-semibold', state.className)}>{state.label}</span>
                ) : isBye ? (
                    <span>Bye</span>
                ) : null}
            </div>
            <SideRow side={bout.top} corner="red" isBye={isBye} showScore={showScore} />
            <SideRow side={bout.bottom} corner="green" isBye={isBye} showScore={showScore} />
        </div>
    );
}

export function BracketSheetView({ sheet }: Readonly<{ sheet: BracketSheet }>) {
    const sections = buildSections(sheet.bouts);
    const team = sheet.participant_type === 'team';

    return (
        <div className="space-y-8">
            <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="font-display text-3xl font-bold tracking-tight">{sheet.name}</h2>
                {sheet.wrestler_count != null && (
                    <span className="text-ink-soft">{sheet.wrestler_count} {team ? 'teams' : 'wrestlers'}</span>
                )}
            </div>

            {sheet.placements.length > 0 && (
                <section aria-labelledby="placers">
                    <h3 id="placers" className="font-display text-xl font-semibold">Placers</h3>
                    <ol className="mt-2 grid overflow-hidden rounded-lg border border-line bg-white sm:grid-cols-2">
                        {sheet.placements.map(p => (
                            <li key={`${p.place}-${p.id ?? p.name}`} className="flex items-center gap-3 border-b border-line px-4 py-2.5 sm:odd:border-r">
                                <span className={cn(
                                    'w-7 shrink-0 font-display text-2xl font-bold tabular-nums',
                                    p.place === 1 ? 'text-corner-red' : 'text-ink-faint',
                                )}>
                                    {p.place}
                                </span>
                                <div className="min-w-0">
                                    <div className="truncate font-semibold">{p.name || p.team}</div>
                                    {p.team && p.name && <div className="truncate text-sm text-ink-soft">{p.team}</div>}
                                </div>
                            </li>
                        ))}
                    </ol>
                </section>
            )}

            {sections.length === 0 && (
                <p className="text-ink-soft">No bouts have been drawn for this bracket yet.</p>
            )}

            {sections.map(section => (
                <section key={section.title}>
                    <h3 className="font-display text-xl font-semibold">{section.title}</h3>
                    <div className="-mx-4 mt-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
                        <div className="flex min-w-max gap-4">
                            {section.rounds.map(round => (
                                <div key={round.name} className="flex flex-col">
                                    <div className="mb-2 text-sm font-semibold text-ink-soft">{round.name}</div>
                                    <div className="flex flex-1 flex-col justify-around gap-3">
                                        {round.bouts.map(bout => <BoutCard key={bout.id} bout={bout} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            ))}
        </div>
    );
}

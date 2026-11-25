import { Medal } from 'lucide-react';
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
        placement: { title: 'Placement Matches', rounds: [] },
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
        parts.push(bout.time);
    } else if (winner?.score != null && loser?.score != null && bout.win_type !== 'fall') {
        parts.push(`${winner.score}-${loser.score}`);
    }
    return parts.join(' ');
}

// FloWrestling bout states, for bouts not yet wrestled.
const STATE_BADGES: Record<string, { label: string; className: string }> = {
    'in-progress': { label: 'In Progress', className: 'bg-emerald-100 text-emerald-800' },
    'on-deck': { label: 'On Deck', className: 'bg-yellow-100 text-yellow-800' },
    'in-hole': { label: 'In Hole', className: 'bg-gray-200 text-gray-700' },
    'upcoming': { label: 'Upcoming', className: 'bg-blue-50 text-blue-700' },
};

function SideRow({ side, isBye, showScore }: { side: BracketSide | null; isBye: boolean; showScore: boolean }) {
    if (!side) {
        return <div className="px-3 py-1.5 text-sm text-gray-400 italic">{isBye ? 'Bye' : 'TBD'}</div>;
    }
    return (
        <div className={cn('flex items-center gap-2 px-3 py-1.5 text-sm', side.winner ? 'font-semibold text-gray-900' : 'text-gray-600')}>
            {side.seed != null && (
                <span className="w-6 shrink-0 text-xs text-gray-400 tabular-nums text-right">{side.seed}</span>
            )}
            <span className="truncate flex-1" title={side.team ? `${side.name} (${side.team})` : side.name}>
                {side.name}
                {(side.team_abbreviation || side.team) && side.team !== side.name && (
                    <span className="ml-1.5 text-xs font-normal text-gray-400">{side.team_abbreviation || side.team}</span>
                )}
            </span>
            {showScore && side.score != null && <span className="tabular-nums text-gray-500">{side.score}</span>}
        </div>
    );
}

function BoutCard({ bout }: { bout: BracketBout }) {
    const result = resultText(bout);
    const isBye = bout.state === 'bye';
    // Unwrestled bouts come back with 0-0 scores; only show scores once there's a result.
    const showScore = Boolean(bout.result) && bout.win_type !== 'bye';
    const badge = bout.state ? STATE_BADGES[bout.state] : undefined;
    return (
        <div className={cn('w-60 bg-white border', badge && bout.state !== 'upcoming' ? 'border-yellow-300' : 'border-gray-200', ' rounded-lg shadow-sm overflow-hidden')}>
            <div className="flex items-center justify-between px-3 py-1 bg-gray-50 border-b border-gray-100 text-xs text-gray-500">
                <span>{bout.bout_number ? `Bout ${bout.bout_number}` : ' '}{bout.mat ? ` · ${bout.mat}` : ''}</span>
                {result ? (
                    <span className="font-medium text-gray-700">{result}</span>
                ) : badge ? (
                    <span className={cn('px-1.5 py-0.5 rounded font-medium', badge.className)}>{badge.label}</span>
                ) : isBye ? (
                    <span className="text-gray-400">Bye</span>
                ) : null}
            </div>
            <div className="divide-y divide-gray-100">
                <SideRow side={bout.top} isBye={isBye} showScore={showScore} />
                <SideRow side={bout.bottom} isBye={isBye} showScore={showScore} />
            </div>
        </div>
    );
}

export function BracketSheetView({ sheet }: Readonly<{ sheet: BracketSheet }>) {
    const sections = buildSections(sheet.bouts);

    return (
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 space-y-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-xl font-bold text-gray-900">{sheet.name}</h2>
                {sheet.wrestler_count != null && (
                    <span className="text-sm text-gray-500">
                        {sheet.wrestler_count} {sheet.participant_type === 'team' ? 'teams' : 'wrestlers'}
                    </span>
                )}
            </div>

            {sheet.placements.length > 0 && (
                <div>
                    <h3 className="flex items-center gap-2 font-semibold text-gray-800 mb-3">
                        <Medal size={18} className="text-amber-500" /> Placements
                    </h3>
                    <ol className="grid grid-cols-1 sm:grid-cols-2 2xl:grid-cols-4 gap-2">
                        {sheet.placements.map(p => (
                            <li key={`${p.place}-${p.id ?? p.name}`} className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg">
                                <span className="w-6 text-center font-bold text-gray-500 tabular-nums">{p.place}</span>
                                <div className="min-w-0">
                                    <div className="font-medium text-gray-900 truncate">{p.name || p.team}</div>
                                    {p.team && p.name && <div className="text-xs text-gray-500 truncate">{p.team}</div>}
                                </div>
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {sections.length === 0 && (
                <p className="text-gray-500">No bouts have been drawn for this bracket yet.</p>
            )}

            {sections.map(section => (
                <div key={section.title}>
                    <h3 className="font-semibold text-gray-800 mb-3">{section.title}</h3>
                    <div className="overflow-x-auto pb-2">
                        <div className="flex gap-4 min-w-max">
                            {section.rounds.map(round => (
                                <div key={round.name} className="flex flex-col">
                                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">{round.name}</div>
                                    <div className="flex flex-col justify-around gap-3 flex-1">
                                        {round.bouts.map(bout => <BoutCard key={bout.id} bout={bout} />)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

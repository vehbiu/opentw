'use client';

import Link from 'next/link';
import { CalendarDays, ExternalLink, FileText, Globe, MapPin, PenLine, Trophy } from 'lucide-react';
import { useTournament } from '@/components/provider/tournament-provider';
import { formatDateRange, tournamentStatus } from '@/lib/utils';

function LinkRow({ href, icon: Icon, label, detail }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string; detail: string }) {
    return (
        <li>
            <a href={href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 px-4 py-3 hover:bg-mat-100/50">
                <Icon className="h-5 w-5 shrink-0 text-mat-400" />
                <span className="flex-1">
                    <span className="block font-medium text-ink">{label}</span>
                    <span className="block text-sm text-ink-soft">{detail}</span>
                </span>
                <ExternalLink className="h-4 w-4 text-ink-faint" aria-label="Opens in a new tab" />
            </a>
        </li>
    );
}

export default function TournamentOverviewPage() {
    const { tournament } = useTournament();
    const base = `/tournaments/${tournament.event_type}/${tournament.id}`;
    const status = tournamentStatus(tournament);
    const address = [
        tournament.venue_street,
        tournament.venue_city,
        [tournament.venue_state, tournament.venue_zip].filter(Boolean).join(' '),
    ].filter(Boolean).join(', ');
    const mapsUrl = address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([tournament.venue_name, address].filter(Boolean).join(', '))}`
        : null;

    const links = [
        tournament.registration_url && { href: tournament.registration_url, icon: PenLine, label: 'Register', detail: 'Pre-registration for wrestlers' },
        tournament.event_flyer_url && { href: tournament.event_flyer_url, icon: FileText, label: 'Event flyer', detail: 'Schedule, fees and rules from the host' },
        tournament.website_url && { href: tournament.website_url, icon: Globe, label: 'Tournament website', detail: 'Run by the host' },
        tournament.flowrestling_url && { href: tournament.flowrestling_url, icon: Trophy, label: 'FloWrestling', detail: 'This event on FloWrestling' },
    ].filter(Boolean) as { href: string; icon: React.ComponentType<{ className?: string }>; label: string; detail: string }[];

    return (
        <div className="grid gap-8 lg:grid-cols-[1fr_22rem]">
            <div className="space-y-8">
                {status === 'live' && (
                    <Link
                        href={`${base}/matches`}
                        className="flex items-center justify-between gap-4 rounded-lg bg-white p-5 ring-1 ring-line hover:ring-mat-400"
                    >
                        <div>
                            <div className="font-display text-2xl font-semibold">Bouts are on the mats now</div>
                            <div className="text-ink-soft">See what&apos;s wrestling, on deck and in the hole on each mat.</div>
                        </div>
                        <span className="shrink-0 rounded-md bg-corner-red px-4 py-2.5 font-semibold text-white">Open mats</span>
                    </Link>
                )}

                <section>
                    <h2 className="font-display text-2xl font-semibold">When and where</h2>
                    <dl className="mt-3 divide-y divide-line rounded-lg border border-line bg-white">
                        <div className="flex gap-3 px-4 py-3">
                            <dt className="sr-only">Dates</dt>
                            <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-mat-400" aria-hidden="true" />
                            <dd>{formatDateRange(tournament) ?? 'Dates not announced'}</dd>
                        </div>
                        <div className="flex gap-3 px-4 py-3">
                            <dt className="sr-only">Venue</dt>
                            <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-mat-400" aria-hidden="true" />
                            <dd>
                                <div className="font-medium">{tournament.venue_name || 'Venue not announced'}</div>
                                {address && <div className="text-ink-soft">{address}</div>}
                                {mapsUrl && (
                                    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-sm font-medium text-mat-600 underline decoration-mat-100 underline-offset-4 hover:decoration-mat-600">
                                        Get directions
                                    </a>
                                )}
                            </dd>
                        </div>
                    </dl>
                </section>

                <section>
                    <h2 className="font-display text-2xl font-semibold">Brackets</h2>
                    <p className="mt-1 text-ink-soft">
                        Pick a weight to see the draw, results and placers.
                    </p>
                    <Link href={`${base}/brackets`} className="mt-3 inline-block rounded-md bg-mat px-4 py-2.5 font-semibold text-white hover:bg-mat-600">
                        View brackets
                    </Link>
                </section>
            </div>

            <aside className="space-y-8">
                {links.length > 0 && (
                    <section>
                        <h2 className="font-display text-2xl font-semibold">Links</h2>
                        <ul className="mt-3 divide-y divide-line rounded-lg border border-line bg-white">
                            {links.map(l => <LinkRow key={l.label} {...l} />)}
                        </ul>
                    </section>
                )}
                <p className="text-sm text-ink-faint">
                    Schedule and results come from {tournament.source === 'flowrestling' ? 'FloWrestling' : 'TrackWrestling'}.
                </p>
            </aside>
        </div>
    );
}

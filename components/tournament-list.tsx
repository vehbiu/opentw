import Link from 'next/link';
import { MapPin } from 'lucide-react';
import type { Tournament } from '@/lib/types';
import { formatDateRange, getEventTypeDisplay, getLogoUrl, parseDate, tournamentStatus } from '@/lib/utils';

const GROUPS = [
    { status: 'live', title: 'On today' },
    { status: 'upcoming', title: 'Coming up' },
    { status: 'past', title: 'Earlier' },
    { status: 'unknown', title: 'No date' },
] as const;

function time(t: Tournament) {
    return t.start_date ? parseDate(t.start_date).getTime() : 0;
}

export function TournamentLogo({ tournament, size = 44 }: { tournament: Tournament; size?: number }) {
    const logo = getLogoUrl(tournament.logo_url);
    if (logo) {
        return (
            <img
                src={logo}
                alt=""
                width={size}
                height={size}
                className="shrink-0 rounded-md bg-white object-contain p-1 ring-1 ring-line"
                style={{ width: size, height: size }}
            />
        );
    }
    // No logo: the tournament's initials on the mat colour.
    const initials = tournament.name.replace(/^\d+(st|nd|rd|th)?\s+/i, '').split(/\s+/).slice(0, 2).map(w => w[0]).join('');
    return (
        <div
            aria-hidden="true"
            className="flex shrink-0 items-center justify-center rounded-md bg-mat-100 font-display font-semibold text-mat"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
        >
            {initials.toUpperCase()}
        </div>
    );
}

function TournamentRow({ tournament }: { tournament: Tournament }) {
    const place = [tournament.venue_city, tournament.venue_state].filter(Boolean).join(', ');
    const live = tournamentStatus(tournament) === 'live';
    return (
        <li>
            <Link
                href={`/tournaments/${tournament.event_type}/${tournament.id}`}
                className="group flex items-center gap-4 px-4 py-3.5 hover:bg-mat-100/50 sm:px-5"
            >
                <TournamentLogo tournament={tournament} />
                <div className="min-w-0 flex-1">
                    <div className="truncate font-display text-xl font-semibold leading-tight text-ink group-hover:text-mat-600">
                        {tournament.name}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-sm text-ink-soft">
                        <span className="sm:hidden">{formatDateRange(tournament)}</span>
                        {place && (
                            <span className="inline-flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5 text-ink-faint" aria-hidden="true" />
                                {place}
                            </span>
                        )}
                        <span className="text-ink-faint">{getEventTypeDisplay(tournament.event_type)}</span>
                    </div>
                </div>
                <div className="hidden shrink-0 text-right sm:block">
                    <div className="text-sm font-medium text-ink">{formatDateRange(tournament)}</div>
                    {live && (
                        <div className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-medium text-corner-red">
                            <span className="h-2 w-2 rounded-full bg-corner-red" aria-hidden="true" />
                            On today
                        </div>
                    )}
                </div>
            </Link>
        </li>
    );
}

/** Tournaments grouped into on today, coming up and earlier. */
export function TournamentList({ tournaments }: { tournaments: Tournament[] }) {
    const groups = GROUPS.map(g => ({
        ...g,
        items: tournaments
            .filter(t => tournamentStatus(t) === g.status)
            .sort((a, b) => g.status === 'past' ? time(b) - time(a) : time(a) - time(b)),
    })).filter(g => g.items.length > 0);

    return (
        <div className="space-y-8">
            {groups.map(group => (
                <section key={group.status} aria-labelledby={`group-${group.status}`}>
                    <h2 id={`group-${group.status}`} className="mb-2 flex items-baseline gap-2 font-display text-lg font-semibold text-ink-soft">
                        {group.title}
                        <span className="text-sm font-medium text-ink-faint">{group.items.length}</span>
                    </h2>
                    <ul className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
                        {group.items.map(t => <TournamentRow key={`${t.event_type}-${t.id}`} tournament={t} />)}
                    </ul>
                </section>
            ))}
        </div>
    );
}

export function TournamentListSkeleton({ rows = 6 }: { rows?: number }) {
    return (
        <ul aria-busy="true" aria-label="Loading tournaments" className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
            {Array.from({ length: rows }, (_, i) => (
                <li key={i} className="flex items-center gap-4 px-5 py-3.5">
                    <div className="h-11 w-11 animate-pulse rounded-md bg-paper" />
                    <div className="flex-1 space-y-2">
                        <div className="h-4 w-2/3 animate-pulse rounded bg-paper" />
                        <div className="h-3 w-1/3 animate-pulse rounded bg-paper" />
                    </div>
                </li>
            ))}
        </ul>
    );
}

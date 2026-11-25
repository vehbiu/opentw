'use client';

import { Suspense, useEffect, useState } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import { AlertCircle } from 'lucide-react';
import type { EventType, Tournament } from '@/lib/types';
import { errorMessage, queryTournaments } from '@/lib/api';
import { getEventTypeDisplay } from '@/lib/utils';
import { SearchBox } from '@/components/search-box';
import { TournamentList, TournamentListSkeleton } from '@/components/tournament-list';

const TYPES: EventType[] = ['predefined', 'open', 'team', 'freestyle', 'season'];

function TournamentSearch() {
    const [query, setQuery] = useQueryState('q', parseAsString.withDefault(''));
    const [type, setType] = useQueryState('type', parseAsString.withDefault('all'));
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;
        setLoading(true);
        queryTournaments(query)
            .then(data => { if (!cancelled) { setTournaments(data); setError(null); } })
            .catch(err => { if (!cancelled) setError(errorMessage(err, 'Could not load tournaments. Try searching again.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    }, [query]);

    const shown = tournaments.filter(t => type === 'all' || t.event_type === type);
    const typesPresent = TYPES.filter(t => tournaments.some(x => x.event_type === t));

    return (
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
            <h1 className="font-display text-4xl font-bold tracking-tight">
                {query ? <>Tournaments matching “{query}”</> : 'Tournaments'}
            </h1>
            {!query && <p className="mt-1 text-ink-soft">This week&apos;s tournaments. Search to find any other.</p>}

            <div className="mt-6">
                <SearchBox key={query} initial={query} onSearch={q => { setQuery(q || null); setType(null); }} />
            </div>

            {typesPresent.length > 1 && (
                <div className="-mx-4 mt-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Tournament type">
                    <button type="button" className="chip" aria-pressed={type === 'all'} onClick={() => setType(null)}>
                        All
                    </button>
                    {typesPresent.map(t => (
                        <button key={t} type="button" className="chip" aria-pressed={type === t} onClick={() => setType(t)}>
                            {getEventTypeDisplay(t)}
                        </button>
                    ))}
                </div>
            )}

            <div className="mt-8">
                {error ? (
                    <div className="flex items-start gap-3 rounded-lg border border-corner-red/30 bg-white p-4 text-ink">
                        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-corner-red" aria-hidden="true" />
                        <p>{error}</p>
                    </div>
                ) : loading ? (
                    <TournamentListSkeleton />
                ) : shown.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center">
                        <p className="font-display text-xl font-semibold">No tournaments found</p>
                        <p className="mt-1 text-ink-soft">Try the host school, the city, or fewer words.</p>
                    </div>
                ) : (
                    <TournamentList tournaments={shown} />
                )}
            </div>
        </div>
    );
}

// The search lives in the URL, which Next only knows in the browser.
export default function TournamentsPage() {
    return (
        <Suspense fallback={<div className="mx-auto max-w-4xl px-4 py-8 sm:px-6"><TournamentListSkeleton /></div>}>
            <TournamentSearch />
        </Suspense>
    );
}

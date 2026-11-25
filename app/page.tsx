'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { Tournament } from '@/lib/types';
import { queryTournaments } from '@/lib/api';
import { tournamentStatus } from '@/lib/utils';
import { SearchBox } from '@/components/search-box';
import { TournamentList, TournamentListSkeleton } from '@/components/tournament-list';

export default function HomePage() {
  const [today, setToday] = useState<Tournament[] | null>(null);

  useEffect(() => {
    queryTournaments()
      .then(all => setToday(all.filter(t => tournamentStatus(t) === 'live')))
      .catch(() => setToday([]));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden bg-mat text-white">
        {/* The mat's circles, off to the side. */}
        <svg className="pointer-events-none absolute -right-40 -top-24 hidden h-[560px] w-[560px] text-white/[0.07] md:block" viewBox="0 0 560 560" aria-hidden="true">
          <circle cx="280" cy="280" r="270" fill="none" stroke="currentColor" strokeWidth="10" />
          <circle cx="280" cy="280" r="120" fill="none" stroke="currentColor" strokeWidth="10" />
          <circle cx="280" cy="280" r="18" fill="currentColor" />
        </svg>
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 sm:pb-20 sm:pt-16">
          <h1 className="max-w-2xl font-display text-5xl font-bold leading-[0.95] tracking-tight sm:text-7xl">
            Find your mat. Follow the bracket.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/75">
            Mat schedules, brackets and results for TrackWrestling and FloWrestling tournaments, made for your phone.
          </p>
          <div className="mt-8 max-w-2xl">
            <SearchBox size="lg" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {today === null ? (
          <TournamentListSkeleton rows={4} />
        ) : today.length > 0 ? (
          <TournamentList tournaments={today.slice(0, 10)} />
        ) : (
          <p className="text-ink-soft">Nothing is on today.</p>
        )}
        <Link href="/tournaments" className="mt-6 inline-block font-medium text-mat-600 underline decoration-mat-100 underline-offset-4 hover:decoration-mat-600">
          See all of this week&apos;s tournaments
        </Link>
      </section>
    </>
  );
}

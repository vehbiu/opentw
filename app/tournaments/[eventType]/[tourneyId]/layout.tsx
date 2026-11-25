import { ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, MapPin } from "lucide-react";
import { TournamentProvider } from "@/components/provider/tournament-provider";
import { TournamentTabs } from "@/components/tournament-tabs";
import { TournamentLogo } from "@/components/tournament-list";
import { ApiError, errorMessage, getTournamentInfo } from "@/lib/api";
import { EventType, Tournament } from "@/lib/types";
import { formatDateRange, tournamentStatus } from "@/lib/utils";

type Params = {
    children: ReactNode;
    params: Promise<{
        eventType: string;
        tourneyId: string;
    }>;
};

export default async function TournamentLayout({ children, params: _params }: Params) {
    const { eventType, tourneyId } = await _params;
    let tournament: Tournament;
    try {
        tournament = await getTournamentInfo(eventType as EventType, tourneyId);
    } catch (err) {
        if (err instanceof ApiError && (err.status === 404 || err.status === 400)) notFound();
        return (
            <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                <h1 className="font-display text-3xl font-bold">This tournament didn&apos;t load</h1>
                <p className="mt-2 text-ink-soft">{errorMessage(err, "The tournament site didn't answer.")} Reload the page to try again.</p>
            </div>
        );
    }

    const place = [tournament.venue_name, [tournament.venue_city, tournament.venue_state].filter(Boolean).join(", ")].filter(Boolean).join(", ");
    const live = tournamentStatus(tournament) === "live";
    const base = `/tournaments/${tournament.event_type}/${tournament.id}`;

    return (
        <TournamentProvider tournament={tournament}>
            <header className="bg-mat text-white">
                <div className="mx-auto max-w-6xl px-4 pb-6 pt-3 sm:px-6 sm:pb-8">
                    <Link href="/tournaments" className="-ml-1 inline-flex items-center gap-0.5 text-sm text-white/70 hover:text-white">
                        <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                        Tournaments
                    </Link>
                    <div className="mt-3 flex items-start gap-4">
                        <div className="hidden sm:block"><TournamentLogo tournament={tournament} size={64} /></div>
                        <div className="min-w-0">
                            <h1 className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                                {tournament.name}
                            </h1>
                            <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-white/75">
                                {live && (
                                    <span className="inline-flex items-center gap-1.5 font-semibold text-white">
                                        <span className="h-2 w-2 animate-pulse rounded-full bg-corner-red" aria-hidden="true" />
                                        On today
                                    </span>
                                )}
                                {formatDateRange(tournament) && <span>{formatDateRange(tournament)}</span>}
                                {place && (
                                    <span className="inline-flex items-center gap-1">
                                        <MapPin className="h-4 w-4" aria-hidden="true" />
                                        {place}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <TournamentTabs base={base} />
            <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
                {children}
            </div>
        </TournamentProvider>
    );
}

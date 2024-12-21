import { ReactNode } from "react";
import { ChevronLeft, ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { TournamentProvider } from "@/components/provider/tournament-provider";
import { getTournamentInfo } from "@/lib/api";
import { EventType, Tournament } from "@/lib/types";

type Params = {
    children: ReactNode;
    params: {
        eventType: string;
        tourneyId: string;
    };
};

const EventTypeLabel: Record<EventType, string> = {
    predefined: "Predefined Tournament",
    open: "Open Tournament",
    team: "Team Tournament",
    freestyle: "Freestyle Tournament",
    season: "Season Tournament"
};

function BreadcrumbItem({ href, children }: { href: string; children: ReactNode }) {
    return (
        <Link
            href={href}
            className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
            {children}
        </Link>
    );
}

function Breadcrumb({ tournament }: { tournament: Tournament }) {
    return (
        <nav className="flex items-center space-x-2 text-sm mb-6">
            <BreadcrumbItem href="/tournaments">
                <Home className="w-4 h-4 mr-1" />
                <span>Tournaments</span>
            </BreadcrumbItem>
            
            <ChevronRight className="w-4 h-4 text-gray-400" />
            
            <BreadcrumbItem href={`/tournaments/${tournament.event_type}`}>
                <span>{EventTypeLabel[tournament.event_type]}</span>
            </BreadcrumbItem>
            
            <ChevronRight className="w-4 h-4 text-gray-400" />

            <BreadcrumbItem href={`/tournaments/${tournament.event_type}/${tournament.id}`}>
                <span>{tournament.name}</span>
            </BreadcrumbItem>
            
            {/* <span className="text-gray-900 font-medium">{tournament.name}</span> */}
        </nav>
    );
}

function TournamentHeader({ tournament }: { tournament: Tournament }) {
    const dateRange = tournament.start_date && tournament.end_date
        ? new Date(tournament.start_date).toLocaleDateString() + 
          (tournament.end_date !== tournament.start_date 
            ? ` - ${new Date(tournament.end_date).toLocaleDateString()}`
            : '')
        : null;

    // const venue = [
    //     tournament.venue_name,
    //     tournament.venue_city,
    //     tournament.venue_state,
    // ].filter(Boolean).join(', ');

    return (
        <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
                {tournament.logo_url && (
                    <img 
                        src={tournament.logo_url} 
                        alt={`${tournament.name} logo`}
                        className="w-16 h-16 object-contain rounded-full"
                    />
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{tournament.name}</h1>
                    {dateRange && (
                        <p className="text-gray-600">{dateRange}</p>
                    )}
                </div>
            </div>
            
            {(tournament.website_url) && (
                <div className="space-y-2">
                    {/* {venue && (
                        <p className="text-gray-600">{venue}</p>
                    )} */}
                    {tournament.website_url && (
                        <a 
                            href={tournament.website_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                        >
                            Visit Tournament Website
                        </a>
                    )}
                </div>
            )}
        </div>
    );
}

export default async function TournamentEventTypeLayout({ children, params: _params }: Params) {
    const { eventType, tourneyId } = await _params;
    const tournament = await getTournamentInfo(eventType as EventType, tourneyId);

    return (
        <TournamentProvider tournament={tournament}>
            <div className="mx-auto max-w-7xl w-full min-h-screen py-8 px-4 sm:px-6 lg:px-8 text-gray-900">
                <div className="mb-8">
                    <Breadcrumb tournament={tournament} />
                    <TournamentHeader tournament={tournament} />
                </div>

                {children}
            </div>
        </TournamentProvider>
    );
}
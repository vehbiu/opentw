// app/tournaments/[eventType]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, ExternalLink, RefreshCw, ArrowLeft } from 'lucide-react';
import { EventType, Tournament } from '@/lib/types';
import { queryTournaments } from '@/lib/api';
import Link from 'next/link';
import { getEventTypeBadgeColor, getEventTypeDisplay } from '@/lib/utils';
import { useParams } from 'next/navigation';

const EVENT_TYPE_INFO: Record<EventType, { description: string; icon: string }> = {
    predefined: {
        description: "Pre-arranged tournaments with set brackets and schedules",
        icon: "🎯"
    },
    open: {
        description: "Open registration tournaments welcoming all eligible participants",
        icon: "🌟"
    },
    team: {
        description: "Team-based competitions featuring school and club wrestling teams",
        icon: "👥"
    },
    freestyle: {
        description: "Freestyle wrestling tournaments following international rules",
        icon: "🌍"
    },
    season: {
        description: "Season-long tournament series and championships",
        icon: "🏆"
    }
};

export default function EventTypePage() {
    const params = useParams();
    const eventType = params.eventType as EventType;
    
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const [dateFilter, setDateFilter] = useState<'upcoming' | 'past' | 'all'>('all');

    const fetchTournaments = async () => {
        try {
            setLoading(true);
            const allTournaments = await queryTournaments(searchInput);
            console.log(allTournaments.map(t => t.event_type));
            const filteredTournaments = allTournaments.filter(t => t.event_type === eventType);
            setTournaments(filteredTournaments);
            setError(null);
        } catch (err) {
            setError('Failed to load tournament data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournaments();
    }, [eventType, searchInput]);

    const filteredTournaments = tournaments.filter(tournament => {
        if (dateFilter === 'all') return true;
        const today = new Date();
        const startDate = tournament.start_date ? new Date(tournament.start_date) : null;
        if (dateFilter === 'upcoming') {
            return startDate ? startDate >= today : true;
        }
        return startDate ? startDate < today : false;
    });

    const getVenueDisplay = (tournament: Tournament) => {
        const parts = [tournament.venue_city, tournament.venue_state].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <Link
                        href="/tournaments"
                        className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        Back to All Tournaments
                    </Link>
                    
                    <div className="flex items-center gap-4 mb-4">
                        <span className="text-4xl">{EVENT_TYPE_INFO[eventType].icon}</span>
                        <div>
                            <h1 className="text-4xl font-bold text-gray-900">
                                {getEventTypeDisplay(eventType)} Tournaments
                            </h1>
                            <p className="text-gray-600 mt-2">
                                {EVENT_TYPE_INFO[eventType].description}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search tournaments..."
                                className="block w-full pl-12 pr-4 py-3 bg-white text-gray-900 placeholder-gray-500 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                            />
                        </div>
                        <select
                            value={dateFilter}
                            onChange={(e) => setDateFilter(e.target.value as 'upcoming' | 'past' | 'all')}
                            className="px-4 py-3 bg-white text-gray-700 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                        >
                            <option value="all">All Dates</option>
                            <option value="upcoming">Upcoming</option>
                            <option value="past">Past</option>
                        </select>
                    </div>
                </div>

                {loading && (
                    <div className="flex justify-center my-12">
                        <RefreshCw className="w-12 h-12 animate-spin text-blue-500" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg">
                        <p className="text-sm text-red-700">{error}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTournaments.map((tournament) => (
                        <Link
                            href={`/tournaments/${tournament.event_type}/${tournament.id}`}
                            key={tournament.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 transform hover:-translate-y-1"
                        >
                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                                        {tournament.name}
                                    </h2>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">
                                                {tournament.start_date && new Date(tournament.start_date).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                {tournament.end_date && tournament.start_date !== tournament.end_date && (
                                                    <>
                                                        {" - "}
                                                        {new Date(tournament.end_date).toLocaleDateString(undefined, {
                                                            weekday: 'short',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </>
                                                )}
                                            </span>
                                        </div>

                                        {getVenueDisplay(tournament) && (
                                            <div className="flex items-center gap-2 text-gray-600">
                                                <MapPin className="w-5 h-5 flex-shrink-0" />
                                                <span className="text-sm">{getVenueDisplay(tournament)}</span>
                                            </div>
                                        )}
                                    </div>

                                    {(tournament.event_flyer_url || tournament.website_url) && (
                                        <div className="flex flex-wrap gap-2 pt-2">
                                            {tournament.event_flyer_url && (
                                                <button
                                                    // href={tournament.event_flyer_url}
                                                    // target="_blank"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.open(tournament.event_flyer_url, '_blank');
                                                    }}
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                                                    // onClick={(e) => e.stopPropagation()}
                                                >
                                                    Event Flyer <ExternalLink className="w-4 h-4" />
                                                </button>
                                            )}
                                            {tournament.website_url && (
                                                <a
                                                    href={tournament.website_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    Website <ExternalLink className="w-4 h-4" />
                                                </a>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                {!loading && filteredTournaments.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-lg text-gray-500">
                            No {getEventTypeDisplay(eventType).toLowerCase()} tournaments found
                            {searchInput && ' matching your search criteria'}.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
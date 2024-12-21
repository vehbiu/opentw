'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Search, Calendar, MapPin, ExternalLink, RefreshCw } from 'lucide-react';
import { EventType, Tournament } from '@/lib/types';
import { queryTournaments } from '@/lib/api';
import Link from 'next/link';
import { cn, getEventTypeBadgeColor, getEventTypeDisplay, getLogoUrl } from '@/lib/utils';

export default function TournamentsPage() {
    const [tournaments, setTournaments] = useState<Tournament[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchInput, setSearchInput] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setSearchQuery(searchInput);
    };

    const fetchTournaments = async (query: string) => {
        try {
            setLoading(true);
            const tournaments = await queryTournaments(query);
            setTournaments(tournaments);
            setError(null);
        } catch (err) {
            setError('Failed to load tournament data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTournaments(searchQuery);
    }, [searchQuery]);


    const filteredTournaments = tournaments.filter(tournament =>
        selectedType === 'all' || tournament.event_type === selectedType
    );

    const getVenueDisplay = (tournament: Tournament) => {
        const parts = [
            tournament.venue_city,
            tournament.venue_state,
            tournament.venue_zip
        ].filter(Boolean);
        return parts.length > 0 ? parts.join(', ') : null;
    };


    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            {/* Add Colors to TailwindCSS build */}
            <div className="hidden absolute">
                <div className="bg-purple-100 text-purple-800"></div>
                <div className="bg-green-100 text-green-800"></div>
                <div className="bg-blue-100 text-blue-800"></div>
                <div className="bg-orange-100 text-orange-800"></div>
                <div className="bg-pink-100 text-pink-800"></div>
                <div className="bg-gray-100 text-gray-800"></div>
            </div>
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900">Tournaments</h1>
                </div>

                <div className="mb-8 space-y-4">
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500" />
                            </div>
                            <input
                                type="text"
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                placeholder="Search tournaments..."
                                className="block w-full pl-12 pr-4 py-3 text-lg bg-white text-gray-900 placeholder-gray-500 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                            />
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors shadow-sm min-w-[120px]"
                        >
                            Search
                        </button>
                    </form>

                    <select
                        value={selectedType}
                        // onChange={(e) => setSelectedType(e.target.value === 'all' ? 'all' : Number(e.target.value))}
                        onChange={(e) => setSelectedType(e.target.value as EventType)}
                        className="w-full sm:w-auto px-4 py-3 text-base bg-white text-gray-700 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-all duration-200"
                    >
                        <option value="all">All Event Types</option>
                        {["predefined", "open", "team", "freestyle", "season"].map((type) => (
                            <option key={type} value={type}>{getEventTypeDisplay(type as EventType)}</option>
                        ))}
                    </select>
                </div>

                {loading && (
                    <div className="flex justify-center my-12">
                        <RefreshCw className="w-12 h-12 animate-spin text-blue-500" />
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded-r-lg shadow-sm">
                        <div className="flex">
                            <div className="ml-3">
                                <p className="text-sm text-red-700">{error}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredTournaments.map((tournament) => (
                        <Link
                            href={`/tournaments/${tournament.event_type}/${tournament.id}`}
                            key={tournament.id}
                            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200 transform hover:-translate-y-1"
                        >
                            <div className="w-full h-48 bg-gray-100 relative overflow-hidden">
                                <img
                                    src={tournament.logo_url ? getLogoUrl(tournament.logo_url) : "https://via.placeholder.com/300x150?text=No+Logo"}
                                    alt={tournament.name}
                                    className="w-full h-full object-contain p-4"
                                />
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col gap-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-start gap-4">
                                            <h2 className="text-xl font-semibold text-gray-900 line-clamp-2">
                                                {tournament.name}
                                            </h2>
                                            <span className={cn(
                                                'px-3 py-1 text-sm rounded-full whitespace-nowrap flex-shrink-0',
                                                getEventTypeBadgeColor(tournament.event_type)
                                            )}>
                                                {getEventTypeDisplay(tournament.event_type)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Calendar className="w-5 h-5 flex-shrink-0" />
                                            <span className="text-sm">
                                                {tournament.start_date && new Date(tournament.start_date).toLocaleDateString(undefined, {
                                                    weekday: 'short',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                                {tournament.end_date && (
                                                    <>
                                                        {tournament.start_date ? " - " : "Ends "}
                                                        {new Date(tournament.end_date).toLocaleDateString(undefined, {
                                                            day: 'numeric',
                                                            weekday: 'short',
                                                            month: 'short',
                                                            year: 'numeric',
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
                                                    onClick={(e: FormEvent<HTMLButtonElement>) => {
                                                        e.preventDefault();
                                                        window.open(tournament.event_flyer_url, '_blank')
                                                    }}
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm shadow-sm"
                                                >
                                                    Event Flyer <ExternalLink className="w-4 h-4" />
                                                </button>
                                            )}
                                            {tournament.website_url && (
                                                <button
                                                onClick={(e: FormEvent<HTMLButtonElement>) => {
                                                    e.preventDefault();
                                                    window.open(tournament.website_url, '_blank')
                                                }}
                                                rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm shadow-sm"
                                                >
                                                    Website <ExternalLink className="w-4 h-4" />
                                                </button>
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
                        <p className="text-lg text-gray-500">No tournaments found matching your search criteria.</p>
                    </div>
                )}
            </div>
        </div>

    );
}

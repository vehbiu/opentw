'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Calendar,
    MapPin,
    ExternalLink,
    Users,
    Trophy,
    Info,
    Link as LinkIcon,
    Clock,
    ChevronRight,
    Building,
    Globe
} from 'lucide-react';
import { useTournament } from '@/components/provider/tournament-provider';
import { cn, getEventTypeDisplay } from '@/lib/utils';
import Link from 'next/link';

type Params = {
    eventType: string;
    tourneyId: string;
};

type TabType = 'overview' | 'details' | 'venue';

export default function TournamentDetailsPage({ params }: { params: Promise<Params> }) {
    const { tournament } = useTournament();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('overview');

    const getLogoUrl = (url: string) => {
        if (url.startsWith('./')) {
            return `https://www.trackwrestling.com${url.substring(1)}`;
        }
        return url;
    };

    const formatDate = (date: Date | string | undefined) => {
        if (!date) return null;
        return new Date(date).toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const QuickActionButton = ({
        icon: Icon,
        label,
        sublabel,
        href,
        variant = "primary"
    }: {
        icon: any;
        label: string;
        sublabel?: string;
        href?: string;
        variant?: "primary" | "secondary" | "outline"
    }) => (
        <Link
            href={href || "#"}
            className={cn(
                "group flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-200 w-full",
                variant === "primary"
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg shadow-blue-500/20"
                    : variant === "secondary"
                        ? "bg-gradient-to-br from-gray-50 to-gray-100 hover:from-gray-100 hover:to-gray-200 text-gray-800"
                        : "border-2 border-gray-200 hover:border-gray-300 text-gray-800 bg-white"
            )}
        >
            <Icon className={cn("w-8 h-8", variant === "primary" ? "text-white" : "text-gray-500")} />
            <div className="flex-1 text-left">
                <div className="font-semibold">{label}</div>
                {sublabel && <div className="text-sm opacity-80">{sublabel}</div>}
            </div>
            <ChevronRight 
                className={cn(
                    "w-5 h-5 transition-transform group-hover:translate-x-1",
                    variant === "primary" ? "text-white/70" : "text-gray-400"
                )} />
            {/* <ChevronRight className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${variant === "primary" ? "text-white/70" : "text-gray-400"}`} /> */}
        </Link>
    );

    const TabButton = ({ tab, label }: { tab: TabType; label: string }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={cn(
                "px-6 py-3 text-sm font-medium transition-all duration-200 relative",
                activeTab === tab
                    ? "text-blue-600 bg-blue-50 rounded-xl"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-xl"
            )}
        >
            {label}
        </button>
    );

    const InfoBlock = ({ icon: Icon, label, value }: { icon: any; label: string; value: string | null }) => {
        if (!value) return null;
        return (
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl">
                <Icon className="w-5 h-5 text-gray-500" />
                <div>
                    <div className="text-sm text-gray-600">{label}</div>
                    <div className="font-medium text-gray-900">{value}</div>
                </div>
            </div>
        );
    };

    const isUpcoming = tournament.start_date ? new Date(tournament.start_date) > new Date() : false;
    const isPassed = tournament.end_date ? new Date(tournament.end_date) < new Date() : false;
    const status = isUpcoming ? 'Upcoming' : isPassed ? 'Over' : 'In Progress';
    const statusColor = isUpcoming ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800';

    return (
        <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
                <div className="relative">
                    {tournament.logo_url && (
                        <div className="w-full h-72 bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50 relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/10 via-transparent to-transparent" />
                            <img
                                src={getLogoUrl(tournament.logo_url)}
                                alt={tournament.name}
                                className="w-full h-full object-contain p-12"
                            />
                        </div>
                    )}
                </div>

                <div className="px-8 py-6 space-y-6">
                    {/* Tournament Status & Type */}
                    <div className="flex flex-wrap items-center gap-1">
                        <span className={`px-4 py-1.5 text-sm font-medium rounded-full ${statusColor}`}>
                            {status}
                        </span>
                        {/* <span className="text-sm text-gray-500">•</span> */}
                        <span className="px-4 py-1.5 text-sm font-medium bg-gray-100 text-gray-800 rounded-full">
                            {getEventTypeDisplay(tournament.event_type)}
                        </span>
                    </div>

                    {/* Title & Location */}
                    <div className="space-y-4 pb-2">
                        <h1 className="text-3xl font-bold text-gray-900">{tournament.name}</h1>
                        <div className="flex flex-wrap gap-6">
                            {tournament.venue_name && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>{tournament.venue_name}</span>
                                </div>
                            )}
                            {tournament.start_date && (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <Calendar className="w-5 h-5" />
                                    <span>{formatDate(tournament.start_date)}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <QuickActionButton
                    icon={Users}
                    label="Mat Schedule"
                    sublabel="View current and upcoming matches"
                    href={`/tournaments/${tournament.event_type}/${tournament.id}/matches`}
                    variant="primary"
                />
                <QuickActionButton
                    icon={Trophy}
                    label="Tournament Brackets"
                    sublabel="View brackets and results"
                    href={`/tournaments/${tournament.event_type}/${tournament.id}/brackets`}
                    variant="primary"
                />
            </div>

            {/* Secondary Actions */}
            {(tournament.event_flyer_url || tournament.website_url) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {tournament.event_flyer_url && (
                        <QuickActionButton
                            icon={ExternalLink}
                            label="Event Flyer"
                            sublabel="View tournament information"
                            href={tournament.event_flyer_url}
                            variant="outline"
                        />
                    )}
                    {tournament.website_url && (
                        <QuickActionButton
                            icon={Globe}
                            label="Tournament Website"
                            sublabel="Visit official website"
                            href={tournament.website_url}
                            variant="outline"
                        />
                    )}
                </div>
            )}

            {/* Details Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="border-b border-gray-200">
                    <div className="flex space-x-2 px-4 py-2">
                        <TabButton tab="overview" label="Overview" />
                        <TabButton tab="details" label="Details" />
                        <TabButton tab="venue" label="Venue" />
                    </div>
                </div>

                <div className="p-6 min-h-[200px]">
                    {activeTab === 'overview' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <InfoBlock
                                icon={Calendar}
                                label="Start Date"
                                value={formatDate(tournament.start_date)}
                            />
                            <InfoBlock
                                icon={Clock}
                                label="End Date"
                                value={formatDate(tournament.end_date)}
                            />
                            <InfoBlock
                                icon={Building}
                                label="Venue"
                                value={tournament.venue_name || null}
                            />
                        </div>
                    )}

                    {activeTab === 'details' && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg text-gray-900 ">Tournament Dates</h3>
                                    <div className="space-y-1 text-gray-600">
                                        {tournament.start_date && (
                                            <p><strong>Starts:</strong> {formatDate(tournament.start_date)}</p>
                                        )}
                                        {tournament.end_date && (
                                            <p><strong>Ends:</strong> {formatDate(tournament.end_date)}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg text-gray-900">Tournament Type</h3>
                                    <p className="text-gray-600">
                                        {getEventTypeDisplay(tournament.event_type)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'venue' && (
                        <div className="space-y-6">
                            {tournament.venue_name && (
                                <div className="space-y-2">
                                    <h3 className="font-bold text-lg text-gray-900">Venue Information</h3>
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <p className="text-gray-900 font-medium">{tournament.venue_name}</p>
                                        {(tournament.venue_city || tournament.venue_state) && (
                                            <p className="text-gray-600 mt-1">
                                                {[
                                                    tournament.venue_city,
                                                    tournament.venue_state,
                                                    tournament.venue_zip
                                                ].filter(Boolean).join(', ')}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
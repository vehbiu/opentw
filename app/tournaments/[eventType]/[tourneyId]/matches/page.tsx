'use client';

import { use, useState, useEffect, useMemo, useCallback } from 'react';
import { 
  RefreshCw, 
  Clock, 
  Play, 
  Circle,
  Filter,
  ChevronRight,
  Trophy,
  CalendarDays,
  Users 
} from 'lucide-react';
import { parseAsInteger, parseAsString, useQueryState } from 'nuqs';
import { getMatches } from '@/lib/api';
import { EventType } from '@/lib/types';
import type { Match, Team } from '@/lib/types';
import { useTournament } from '@/components/provider/tournament-provider';

type Params = {
  eventType: string;
  tourneyId: string;
}

const STATUS_CONFIGS = {
  in_hole: {
    icon: <Circle className="w-5 h-5" />,
    badge: 'bg-gray-100 text-gray-800 border border-gray-200',
    display: 'In Hole'
  },
  on_deck: {
    icon: <Clock className="w-5 h-5" />,
    badge: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
    display: 'On Deck'
  },
  in_progress: {
    icon: <Play className="w-5 h-5" />,
    badge: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    display: 'In Progress'
  }
} as const;

export default function TournamentPage({ params }: { params: Promise<Params> }) {
  const { eventType, tourneyId } = use(params);
  const { tournament } = useTournament();
  const [showFloatingButton, setShowFloatingButton] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  
  useEffect(() => {
    const handleScroll = () => {
      const topButton = document.getElementById('top-refresh-button');
      if (topButton) {
        const buttonBottom = topButton.getBoundingClientRect().bottom;
        setShowFloatingButton(buttonBottom < 0);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMat, setSelectedMat] = useQueryState<number | -1>('mat', parseAsInteger.withDefault(-1));
  const [selectedStatus, setSelectedStatus] = useQueryState<Match['status'] | string | "all">('status', parseAsString.withDefault('all'));
  const [selectedSchoolId, setSelectedSchoolId] = useQueryState<string | "all">('schoolId', parseAsString.withDefault('all'));

  const uniqueMats = useMemo(() => 
    Array.from(new Set(matches.map(m => m.mat))).sort((a, b) => a - b),
    [matches]
  );

  const uniqueSchools = useMemo(() => {
    const schoolSet = new Set<string>();
    const schools: Team[] = [];
    matches.forEach(match => {
      [match.wrestler1.team, match.wrestler2.team].forEach(team => {
        if (!schoolSet.has(team.id)) {
          schoolSet.add(team.id);
          schools.push(team);
        }
      });
    });
    return schools.sort((a, b) => a.name.localeCompare(b.name));
  }, [matches]);

  const filteredMatches = useMemo(() => 
    matches.filter(match => {
      const matMatch = selectedMat === -1 || match.mat.toString() === selectedMat.toString();
      const statusMatch = selectedStatus === 'all' || match.status === selectedStatus;
      const schoolMatch = selectedSchoolId === 'all' || 
        match.wrestler1.team.id === selectedSchoolId || 
        match.wrestler2.team.id === selectedSchoolId;
      return matMatch && statusMatch && schoolMatch;
    }),
    [matches, selectedMat, selectedStatus, selectedSchoolId]
  );

  const fetchMatches = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getMatches(eventType as EventType, tourneyId);
      setMatches(data);
      setError(null);
    } catch (err) {
      setError('Failed to load match data');
    } finally {
      setLoading(false);
    }
  }, [eventType, tourneyId]);

  useEffect(() => {
    fetchMatches();
    const interval = setInterval(fetchMatches, 20_000);
    return () => clearInterval(interval);
  }, [fetchMatches]);

  const getWrestlerBackgroundClass = useCallback((wrestlerSchoolId: string) => {
    if (selectedSchoolId === 'all') return 'bg-gray-50 hover:bg-gray-100';
    return wrestlerSchoolId === selectedSchoolId 
      ? 'bg-blue-50 border border-blue-200 hover:bg-blue-100' 
      : 'bg-gray-50 hover:bg-gray-100';
  }, [selectedSchoolId]);

  return (
    <div className="pb-24">
      {/* Hero Section */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 mb-8">
        <div className="p-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900">Mat Schedule</h1>
              <p className="text-gray-600">{tournament.name}</p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition-colors"
              >
                <Filter className="w-4 h-4" />
                Filters
              </button>
              <button
                id="top-refresh-button"
                onClick={fetchMatches}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-70"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                {loading ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
          </div>

          {/* Filters Section */}
          <div className={`transition-all duration-300 ease-in-out ${showFilters ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0 overflow-hidden'}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-xl">
              <select
                value={selectedMat}
                onChange={(e) => setSelectedMat(e.target.value === 'all' ? -1 : Number(e.target.value))}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="all">All Mats</option>
                {uniqueMats.map(mat => (
                  <option key={mat} value={mat}>Mat {mat}</option>
                ))}
              </select>

              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as Match['status'] | 'all')}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="all">All Statuses</option>
                {Object.entries(STATUS_CONFIGS).map(([status, config]) => (
                  <option key={status} value={status}>{config.display}</option>
                ))}
              </select>

              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(e.target.value)}
                className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              >
                <option value="all">All Schools</option>
                {uniqueSchools.map(school => (
                  <option key={school.id} value={school.id}>{school.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMatches.map((match) => (
          <div 
            key={`${match.mat}-${match.bout}-${match.wrestler1.id}-${match.wrestler2.id}`}
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-200"
          >
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 bg-blue-100 text-blue-600 rounded-lg font-semibold">
                    {match.mat}
                  </div>
                  <div>
                    <div className="text-sm text-gray-600">Mat {match.mat}</div>
                    <div className="font-medium text-gray-900">Bout {match.bout}</div>
                  </div>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${STATUS_CONFIGS[match.status].badge} flex items-center gap-2`}>
                  {STATUS_CONFIGS[match.status].icon}
                  <span>{STATUS_CONFIGS[match.status].display}</span>
                </div>
              </div>
            </div>
            
            <div className="p-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                  <Trophy className="w-4 h-4" />
                  {match.weight_class}
                  <span className="text-gray-300">•</span>
                  <CalendarDays className="w-4 h-4" />
                  {match.round}
                </div>
                <div className="space-y-3">
                  {[match.wrestler1, match.wrestler2].map((wrestler, index) => (
                    <div 
                      key={wrestler.id}
                      className={`flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${getWrestlerBackgroundClass(wrestler.team.id)}`}
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          {wrestler.first_name} {wrestler.last_name}
                        </div>
                        <div className="text-sm text-gray-600 space-x-2">
                          <span>{wrestler.team.name}</span>
                          {wrestler.year && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span>{wrestler.year}</span>
                            </>
                          )}
                          {wrestler.record && (
                            <>
                              <span className="text-gray-300">•</span>
                              <span>{wrestler.record}</span>
                            </>
                          )}
                        </div>
                      </div>
                      {index === 0 && <div className="text-gray-400">vs</div>}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && filteredMatches.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <Users className="w-12 h-12 text-gray-400 mb-4" />
          <p className="text-lg font-medium text-gray-900">No matches found</p>
          <p className="text-gray-500 mt-1">Try adjusting your filters to see more results</p>
        </div>
      )}

      {/* Floating Refresh Button */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 bg-white bg-opacity-90 backdrop-blur-lg border-t border-gray-200 shadow-lg transform transition-all duration-300 ${
        showFloatingButton ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      }`}>
        <div className="max-w-7xl mx-auto">
          <button
            onClick={fetchMatches}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-all disabled:opacity-70"
            disabled={loading}
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing Matches...' : 'Refresh Matches'}
          </button>
        </div>
      </div>
    </div>
  );
}
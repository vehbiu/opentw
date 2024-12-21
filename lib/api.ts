import { Tournament, EventType, Match, BracketData } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface Response {
    ok: boolean;
    data: any;
}

export async function queryTournaments(query?: string): Promise<Tournament[]> {
    const response = await fetch(`${BASE_URL}/tournaments?query=${encodeURIComponent(query || "")}`);
    const data = await response.json();
    if (!response.ok || !data.ok) {
        throw new Error('Failed to load tournament data');
    }
    return data.data;
}


export async function getTournamentInfo(type: EventType, id: string | number): Promise<Tournament> {
    const response = await fetch(`${BASE_URL}/tournaments/${type}/${id}`);
    const data = await response.json();
    if (!response.ok || !data.ok) {
        throw new Error('Failed to load tournament data');
    }
    return data.data;
}

export async function getMatches(type: EventType, id: string | number): Promise<Match[]> {
    const response = await fetch(`${BASE_URL}/tournaments/${type}/${id}/matches`);
    const data = await response.json();
    if (!response.ok || !data.ok) {
        throw new Error('Failed to load tournament data');
    }
    return data.data;

}

export async function getBrackets(type: EventType, id: string | number): Promise<BracketData> {
    const response = await fetch(`${BASE_URL}/tournaments/${type}/${id}/brackets`);
    const data = await response.json();
    if (!response.ok || !response.ok) {
        throw new Error('Failed to load tournament data');
    }
    return data.data;
}

export async function getBracket(type: EventType, id: string | number, bracketId: number, pages: number[]): Promise<string> {
    const response = await fetch(`${BASE_URL}/tournaments/${type}/${id}/brackets/${bracketId}?pages=${pages.join(',')}`);
    const data = await response.json();
    if (!response.ok || !data.ok) {
        throw new Error('Failed to load tournament data');
    }
    return data.data;
}
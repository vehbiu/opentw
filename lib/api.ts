import { Tournament, EventType, Match, BracketData, BracketSheet, Id } from "./types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

/** Every API response is `{ ok, data, error? }`; `error` is only set on failure. */
interface ApiResponse<T> {
    ok: boolean;
    data: T;
    error?: string;
}

/** A failed API call. `status` is the HTTP status: 404 means not available for this tournament, 503 rate limited. */
export class ApiError extends Error {
    constructor(message: string, readonly status: number) {
        super(message);
        this.name = "ApiError";
    }
}

async function request<T>(path: string, fallbackError: string): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`);
    let body: ApiResponse<T> | null = null;
    try {
        body = await response.json();
    } catch {
        // Not JSON (proxy error page, etc.); fall through to the generic error.
    }
    if (!response.ok || !body?.ok) {
        throw new ApiError(body?.error || fallbackError, response.status);
    }
    return body.data;
}

/** A message to show for a failed call. */
export function errorMessage(err: unknown, fallback: string): string {
    if (err instanceof ApiError) {
        if (err.status === 503) return "TrackWrestling is limiting requests right now. Try again in a minute.";
        return err.message;
    }
    return fallback;
}

export async function queryTournaments(query?: string): Promise<Tournament[]> {
    return request(`/tournaments?query=${encodeURIComponent(query || "")}`, "Failed to load tournaments");
}

export async function getTournamentInfo(type: EventType, id: string | number): Promise<Tournament> {
    return request(`/tournaments/${type}/${id}`, "Failed to load tournament data");
}

export async function getMatches(type: EventType, id: string | number): Promise<Match[]> {
    return request(`/tournaments/${type}/${id}/matches`, "Failed to load match data");
}

export async function getBrackets(type: EventType, id: string | number): Promise<BracketData> {
    return request(`/tournaments/${type}/${id}/brackets`, "Failed to load brackets");
}

/** A TrackWrestling bracket, as TrackWrestling's HTML. */
export async function getBracketHtml(type: EventType, id: string | number, weightId: Id, pages: number[]): Promise<string> {
    const query = pages.length ? `?pages=${pages.join(',')}` : "";
    return request(`/tournaments/${type}/${id}/brackets/${encodeURIComponent(weightId)}${query}`, "Failed to load bracket");
}

/** A FloWrestling bracket, as data. */
export async function getBracketSheet(type: EventType, id: string | number, weightId: Id): Promise<BracketSheet> {
    return request(`/tournaments/${type}/${id}/brackets/${encodeURIComponent(weightId)}`, "Failed to load bracket");
}

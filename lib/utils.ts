import type { EventType } from "./types";

export function cn(...classes: (string | undefined | boolean)[]): string {
    return classes.filter(Boolean).join(' ');
}

export function formatEventDate(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
}

// Plain names for TrackWrestling's tournament types.
const EVENT_TYPE_NAMES: Record<EventType, string> = {
    predefined: 'Tournament',
    open: 'Open',
    team: 'Team duals',
    freestyle: 'Freestyle',
    season: 'Season',
};

export function getEventTypeDisplay(type: EventType) {
    return EVENT_TYPE_NAMES[type] ?? type[0].toUpperCase() + type.slice(1);
};

/** A tournament logo's URL, or null when it has none (TrackWrestling's own logo stands in for none). */
export function getLogoUrl(url: string | null | undefined): string | null {
    if (!url || url.endsWith('/images/tw_logo.png')) {
        return null;
    }
    if (url.startsWith('./')) {
        return `https://www.trackwrestling.com${url.substring(1)}`;
    }
    return url;
};

/**
 * The API sends dates as "YYYY-MM-DD". `new Date()` reads those as midnight UTC, which shows
 * the day before anywhere west of UTC, so read them as local dates instead.
 */
export function parseDate(value: string | Date): Date {
    if (value instanceof Date) return value;
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    return match ? new Date(+match[1], +match[2] - 1, +match[3]) : new Date(value);
}

type Dated = { start_date?: string | Date | null; end_date?: string | Date | null };

/** Whether a tournament is on today, still to come, or over. It runs to the end of its last day. */
export function tournamentStatus(t: Dated, now = new Date()): 'live' | 'upcoming' | 'past' | 'unknown' {
    if (!t.start_date) return 'unknown';
    const start = parseDate(t.start_date);
    const dayAfter = parseDate(t.end_date || t.start_date);
    dayAfter.setDate(dayAfter.getDate() + 1);
    if (now < start) return 'upcoming';
    return now < dayAfter ? 'live' : 'past';
}

/** "Sat, Nov 25" or "Fri, Nov 24 – Sat, Nov 25", with the year when it isn't this year. */
export function formatDateRange(t: Dated, now = new Date()): string | null {
    if (!t.start_date) return null;
    const start = parseDate(t.start_date);
    const end = t.end_date ? parseDate(t.end_date) : null;
    const showYear = start.getFullYear() !== now.getFullYear() || (end && end.getFullYear() !== now.getFullYear());
    const fmt = (d: Date) => d.toLocaleDateString(undefined, {
        weekday: 'short', month: 'short', day: 'numeric', ...(showYear ? { year: 'numeric' } : {}),
    });
    return end && end.getTime() !== start.getTime() ? `${fmt(start)} – ${fmt(end)}` : fmt(start);
}

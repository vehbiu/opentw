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

export function getEventTypeBadgeColor(type: EventType) {
    switch (type) {
        case 'predefined': return 'bg-purple-100 text-purple-800';
        case 'open': return 'bg-green-100 text-green-800';
        case 'team': return 'bg-blue-100 text-blue-800';
        case 'freestyle': return 'bg-orange-100 text-orange-800';
        case 'season': return 'bg-pink-100 text-pink-800';
        default: return 'bg-gray-100 text-gray-800';
    }
};

export function getEventTypeDisplay(type: EventType) {
    return type[0].toUpperCase() + type.slice(1);
};
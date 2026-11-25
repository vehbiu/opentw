'use client';

import { Search } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

/** The tournament search field. Submitting opens /tournaments?q=…, or calls onSearch when given. */
export function SearchBox({ initial = '', onSearch, size = 'md', autoFocus }: {
    initial?: string;
    onSearch?: (query: string) => void;
    size?: 'md' | 'lg';
    autoFocus?: boolean;
}) {
    const router = useRouter();
    const [value, setValue] = useState(initial);

    return (
        <form
            role="search"
            onSubmit={(e) => {
                e.preventDefault();
                const q = value.trim();
                if (onSearch) onSearch(q);
                else router.push(q ? `/tournaments?q=${encodeURIComponent(q)}` : '/tournaments');
            }}
            className="flex gap-2"
        >
            <label className="relative flex-1">
                <span className="sr-only">Tournament name, school or city</span>
                <Search className={cn('pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint', size === 'lg' ? 'h-5 w-5' : 'h-4 w-4')} aria-hidden="true" />
                <input
                    type="search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="Tournament, school or city"
                    autoFocus={autoFocus}
                    className={cn('field', size === 'lg' ? 'h-14 pl-11 text-lg' : 'pl-9')}
                />
            </label>
            <button
                type="submit"
                className={cn('shrink-0 rounded-md bg-corner-red font-semibold text-white hover:bg-[#B92832]', size === 'lg' ? 'h-14 px-6 text-lg' : 'h-11 px-5')}
            >
                Search
            </button>
        </form>
    );
}

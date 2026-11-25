'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

/** Overview / Mats / Brackets, kept at the top of the screen while scrolling. */
export function TournamentTabs({ base }: { base: string }) {
    const pathname = usePathname();
    const tabs = [
        { href: base, label: 'Overview' },
        { href: `${base}/matches`, label: 'Mats' },
        { href: `${base}/brackets`, label: 'Brackets' },
    ];
    return (
        <nav className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur" aria-label="Tournament">
            <div className="mx-auto flex max-w-6xl gap-1 px-2 sm:px-4">
                {tabs.map(tab => {
                    const active = pathname === tab.href;
                    return (
                        <Link
                            key={tab.href}
                            href={tab.href}
                            aria-current={active ? 'page' : undefined}
                            className={cn(
                                'relative px-3 py-3 font-display text-lg font-semibold sm:px-4',
                                active ? 'text-ink' : 'text-ink-faint hover:text-ink-soft',
                            )}
                        >
                            {tab.label}
                            {active && <span className="absolute inset-x-3 bottom-0 h-[3px] rounded-t bg-corner-red sm:inset-x-4" />}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

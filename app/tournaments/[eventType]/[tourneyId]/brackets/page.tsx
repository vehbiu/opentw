'use client';

import React, { use, useEffect, useMemo, useState } from 'react';
import { parseAsString, useQueryState } from 'nuqs';
import { Loader2, SlidersHorizontal } from 'lucide-react';
import { errorMessage, getBracketHtml, getBracketSheet, getBrackets } from '@/lib/api';
import type { BracketData, BracketSheet, EventType, Template, Weight } from '@/lib/types';
import { useTournament } from '@/components/provider/tournament-provider';
import { cn } from '@/lib/utils';
import { BracketFrame } from './bracket-frame';
import { BracketSheetView } from './bracket-sheet';

/** TrackWrestling draws a bracket from a template, split into pages you can turn on and off. */
function LayoutOptions({ templates, template, onTemplate }: {
    templates: Template[];
    template: Template;
    onTemplate: (t: Template) => void;
}) {
    return (
        <details className="group mt-3 rounded-lg border border-line bg-white">
            <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-2.5 text-sm font-medium text-ink-soft hover:text-ink">
                <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                Bracket layout: {template.template_name}
            </summary>
            <div className="flex flex-col gap-4 border-t border-line px-4 py-3 sm:flex-row sm:items-start">
                {templates.length > 1 && (
                    <label className="sm:w-64">
                        <span className="mb-1 block text-sm font-medium">Layout</span>
                        <select
                            className="field h-9 text-sm"
                            value={template.template_index}
                            onChange={e => {
                                const t = templates.find(x => x.template_index === parseInt(e.target.value));
                                if (t) onTemplate(t);
                            }}
                        >
                            {templates.map(t => <option key={t.template_index} value={t.template_index}>{t.template_name}</option>)}
                        </select>
                    </label>
                )}
                <fieldset>
                    <legend className="mb-1 text-sm font-medium">Pages</legend>
                    <div className="flex flex-wrap gap-2">
                        {template.pages.map(page => (
                            <button
                                key={page.page_id}
                                type="button"
                                className="chip"
                                aria-pressed={page.show_page}
                                onClick={() => onTemplate({
                                    ...template,
                                    pages: template.pages.map(p => p.page_id === page.page_id ? { ...p, show_page: !p.show_page } : p),
                                })}
                            >
                                {page.page_name}
                            </button>
                        ))}
                    </div>
                </fieldset>
            </div>
        </details>
    );
}

export default function BracketsPage({
    params
}: {
    params: Promise<{ eventType: EventType; tourneyId: string | number; }>
}) {
    const { eventType, tourneyId } = use(params);
    const { tournament } = useTournament();
    const usesTemplates = tournament.source !== 'flowrestling';

    const [data, setData] = useState<BracketData | null>(null);
    const [weightId, setWeightId] = useQueryState('weight', parseAsString);
    const [division, setDivision] = useState<string | null>(null);
    const [template, setTemplate] = useState<Template | null>(null);
    const [sheet, setSheet] = useState<BracketSheet | null>(null);
    const [html, setHtml] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getBrackets(eventType, tourneyId.toString())
            .then(setData)
            .catch(err => setError(errorMessage(err, 'Could not load the brackets.')))
            .finally(() => setLoading(false));
    }, [eventType, tourneyId]);

    const weight: Weight | undefined = useMemo(
        () => data?.weights.find(w => String(w.weight_id) === weightId) ?? data?.weights[0],
        [data, weightId],
    );

    // Open tournaments have several divisions, each with its own weights.
    const divisions = data?.divisions ?? [];
    const activeDivision = division ?? (weight?.division_id != null ? String(weight.division_id) : null);
    const weights = (data?.weights ?? []).filter(w =>
        divisions.length < 2 || activeDivision === null || String(w.division_id) === activeDivision);

    const templates = useMemo(
        () => data?.templates.filter(t => weight && t.bracket_id === weight.bracket_id) ?? [],
        [data, weight],
    );

    useEffect(() => {
        setTemplate(templates[0] ?? null);
    }, [templates]);

    const pages = template?.pages.filter(p => p.show_page).map(p => p.page_id).join(',');

    useEffect(() => {
        if (!weight) return;
        // Wait for this weight's template, not the previous weight's.
        if (usesTemplates && (!template || template.bracket_id !== weight.bracket_id)) return;
        let cancelled = false;
        setLoading(true);
        setError(null);
        const load = usesTemplates
            ? getBracketHtml(eventType, tourneyId.toString(), weight.weight_id, pages ? pages.split(',').map(Number) : [])
                .then(h => { if (!cancelled) { setHtml(h); setSheet(null); } })
            : getBracketSheet(eventType, tourneyId.toString(), weight.bracket_id)
                .then(s => { if (!cancelled) { setSheet(s); setHtml(null); } });
        load
            .catch(err => { if (!cancelled) setError(errorMessage(err, 'Could not load this bracket.')); })
            .finally(() => { if (!cancelled) setLoading(false); });
        return () => { cancelled = true; };
    // The template is read through its ids and `pages`, so toggling a page reloads but re-rendering doesn't.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventType, tourneyId, weight, usesTemplates, template?.bracket_id, template?.template_id, pages]);

    if (!data) {
        return error ? (
            <div className="rounded-lg border border-corner-red/30 bg-white p-4">{error}</div>
        ) : (
            <div className="flex items-center gap-3 py-12 text-ink-soft">
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Loading brackets
            </div>
        );
    }

    if (data.weights.length === 0) {
        return (
            <div className="rounded-lg border border-dashed border-line bg-white px-6 py-12 text-center">
                <p className="font-display text-xl font-semibold">No brackets yet</p>
                <p className="mt-1 text-ink-soft">Brackets appear here once the organiser publishes them.</p>
            </div>
        );
    }

    return (
        <div>
            {divisions.length > 1 && (
                <div className="-mx-4 mb-3 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:px-0" role="group" aria-label="Division">
                    {divisions.map(d => (
                        <button
                            key={String(d.division_id)}
                            type="button"
                            className="chip"
                            aria-pressed={activeDivision === String(d.division_id)}
                            onClick={() => setDivision(String(d.division_id))}
                        >
                            {d.division_name}
                        </button>
                    ))}
                </div>
            )}

            <div role="group" aria-label="Weight class" className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
                {weights.map(w => (
                    <button
                        key={w.weight_index}
                        type="button"
                        aria-pressed={weight?.weight_index === w.weight_index}
                        onClick={() => setWeightId(String(w.weight_id))}
                        className={cn('chip min-w-[3.5rem] justify-center font-display text-base font-semibold tabular-nums')}
                    >
                        {w.weight_name}
                    </button>
                ))}
            </div>

            {usesTemplates && template && (
                <LayoutOptions templates={templates} template={template} onTemplate={setTemplate} />
            )}

            <div className="relative mt-6">
                {error && <div className="mb-4 rounded-lg border border-corner-red/30 bg-white p-4">{error}</div>}
                {loading && (sheet || html) && (
                    <div className="absolute right-3 top-3 z-10 flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm text-ink-soft shadow ring-1 ring-line">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> Loading
                    </div>
                )}
                {sheet ? (
                    <BracketSheetView sheet={sheet} />
                ) : html ? (
                    <div className="overflow-hidden rounded-lg border border-line bg-white">
                        <BracketFrame frameInnerHtml={html} />
                    </div>
                ) : loading ? (
                    <div className="flex items-center gap-3 py-12 text-ink-soft">
                        <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" /> Loading bracket
                    </div>
                ) : null}
            </div>
        </div>
    );
}

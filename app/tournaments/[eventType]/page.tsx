import { redirect } from 'next/navigation';

/** Old per-type listing; the search page filters by type now. */
export default async function EventTypePage({ params }: { params: Promise<{ eventType: string }> }) {
    const { eventType } = await params;
    redirect(`/tournaments?type=${encodeURIComponent(eventType)}`);
}

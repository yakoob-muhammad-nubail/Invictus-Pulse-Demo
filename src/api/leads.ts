export async function runLeadSearch(query: string, token: string) {
    const res = await fetch(
        "https://invictus-pulse-backend.invictuspulse.workers.dev/search",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ query }),
        }
    );

    const raw = await res.text();
    const payload = raw ? JSON.parse(raw) : {};

    if (!res.ok) {
        throw new Error((payload as { error?: string }).error ?? `Lead search failed with status ${res.status}`);
    }

    return payload;
}
export async function fetchActiveClients(orgId: string) {

    const res = await fetch(
        `https://invictus-pulse-backend.invictuspulse.workers.dev/analytics/active-clients?org=${orgId}`
    );
    console.log(`https://invictus-pulse-backend.invictuspulse.workers.dev/analytics/active-clients?org=${orgId}`);

    const data = await res.json();

    return data.activeClients;
}

export async function fetchNewClientsThisMonth(orgId: string) {
    const res = await fetch(
        `https://invictus-pulse-backend.invictuspulse.workers.dev/analytics/new-clients?org=${orgId}`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch new clients");
    }

    const data = await res.json();
    return data.newClientsThisMonth;
}
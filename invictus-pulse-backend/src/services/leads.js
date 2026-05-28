export async function getNewLeadsThisMonth(orgId, supabase) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count, error } = await supabase
        .from("contacts")
        .select("id", { count: "exact", head: true })
        .eq("organization_id", orgId)
        .eq("status", "active_client")
        .gte("created_at", startOfMonth.toISOString());

    if (error) {
        throw new Error(error.message);
    }

    return count || 0;
}
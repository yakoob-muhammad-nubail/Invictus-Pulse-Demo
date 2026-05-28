export async function getActiveClients(supabase, organizationId) {

    const { count, error } = await supabase
        .from("contacts")
        .select("*", { count: "exact", head: true })
        .eq("organization_id", organizationId)
        .eq("status", "active_client");

    if (error) {
        console.log("test error:", error);
        throw new Error(error.message);
    }

    return count || 0;
}
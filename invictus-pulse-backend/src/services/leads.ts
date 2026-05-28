import { createClient } from "@supabase/supabase-js";

export async function savePlacesToDB(
    env: { SUPABASE_URL: string; SUPABASE_SERVICE_ROLE_KEY: string },
    orgId: string,
    userId: string,
    places: any[]
) {
    const supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
    );

    const leads = places.map((p) => ({
        google_id: p.id,
        organization_id: orgId,
        user_id: userId,
        business_name: p.displayName?.text || null,
        phone: p.nationalPhoneNumber || null,
        address: p.formattedAddress || null,
        website: p.websiteUri || null,
        google_url: `https://www.google.com/maps/place/?q=place_id:${p.id}`,
        stage: "new",
        notes: "Imported from Google Places"
    }));

    const { error } = await supabase
        .from("leads")
        .upsert(leads, { onConflict: "google_id" });

    if (error) throw new Error(error.message);

    return leads.length;
}
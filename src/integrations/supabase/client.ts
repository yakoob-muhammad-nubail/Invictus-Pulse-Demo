import { createClient, type SupportedStorage, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types.ts";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const getSafeStorage = (): SupportedStorage | undefined => {
    if (typeof window === "undefined") {
        return undefined;
    }

    try {
        const testKey = "__invictus_storage_check__";
        window.localStorage.setItem(testKey, "ok");
        window.localStorage.removeItem(testKey);
        return window.localStorage;
    } catch (error) {
        console.warn("Supabase session storage is unavailable.", error);
        return undefined;
    }
};

let supabaseInstance: SupabaseClient<Database> | null = null;

if (!url || !anonKey) {
    console.error(
        "Supabase client not configured: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing."
    );
} else {
    const storage = getSafeStorage();

    supabaseInstance = createClient<Database>(url, anonKey, {
        auth: {
            storage,
            persistSession: Boolean(storage),
            autoRefreshToken: true,
        },
    });
}

export const supabase = supabaseInstance;
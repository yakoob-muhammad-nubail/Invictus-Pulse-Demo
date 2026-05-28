import { createClient } from '@supabase/supabase-js'

export async function verifyUser(request: Request, env: any) {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) throw new Error("Unauthorized")

    const token = authHeader.replace("Bearer ", "")

    const supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_ROLE_KEY
    )

    console.log(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error || !user) throw new Error("Invalid token")

    const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("id", user.id)
        .single()

    if (profileError || !profile?.organization_id) {
        throw new Error("User organization not found")
    }

    return {
        ...user,
        organization_id: profile.organization_id,
    }
}
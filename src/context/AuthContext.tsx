import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AuthErrorDetails = {
  message: string;
  status?: number;
  code?: string;
};

type AuthContextValue = {
  session: Session | null;
  user: AppUser | null;
  isLoading: boolean;
  orgId: string | null;
  signUpNewUser: (
    email: string,
    password: string,
    fullName?: string,
    organizationName?: string
  ) => Promise<{
    success: boolean;
    data?: unknown;
    error?: unknown;
  }>;
  signInUser: (email: string, password: string) => Promise<{
    success: boolean;
    data?: unknown;
    error?: unknown;
  }>;
  signOut: () => Promise<void>;
  updateUser: (updates: Partial<AppUser>) => Promise<void>;
};

export type AppUser = {
  id: string;
  email: string;
  name: string;
  industry?: "contractors" | "real-estate" | "clinics" | "consultants";
  businessName?: string;
  setupComplete?: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type AuthContextProviderProps = {
  children: ReactNode;
};

const mapSupabaseUserToAppUser = (supabaseUser: SupabaseUser): AppUser => {
  const metadata = (supabaseUser.user_metadata || {}) as Partial<AppUser> & {
    name?: string;
  };

  return {
    id: supabaseUser.id,
    email: supabaseUser.email ?? "",
    name: (metadata.name as string) ?? "",
    industry: metadata.industry,
    businessName: metadata.businessName,
    setupComplete: metadata.setupComplete,
  };
};

const getAuthErrorDetails = (error: unknown): AuthErrorDetails => {
  if (error instanceof Error) {
    const maybeError = error as Error & {
      status?: number;
      code?: string;
    };

    return {
      message: maybeError.message,
      status: maybeError.status,
      code: maybeError.code,
    };
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      message?: unknown;
      status?: unknown;
      code?: unknown;
    };

    return {
      message: typeof maybeError.message === "string" ? maybeError.message : "Authentication failed",
      status: typeof maybeError.status === "number" ? maybeError.status : undefined,
      code: typeof maybeError.code === "string" ? maybeError.code : undefined,
    };
  }

  if (typeof error === "string") {
    return { message: error };
  }

  return { message: "Authentication failed" };
};

const fetchOrgIdForUser = async (userId: string) => {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("organization_id")
    .eq("id", userId)
    .single();

  if (error) {
    console.error("Failed to load org ID:", error.message);
    return null;
  }

  return data?.organization_id ?? null;
};

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AppUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orgId, setOrgId] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    if (!supabase) {
      setSession(null);
      setUser(null);
      setOrgId(null);
      setIsLoading(false);
      return;
    }

    const syncAuthState = async (nextSession: Session | null) => {
      if (!mounted) return;

      setSession(nextSession);
      setUser(nextSession?.user ? mapSupabaseUserToAppUser(nextSession.user) : null);

      if (nextSession?.user) {
        const nextOrgId = await fetchOrgIdForUser(nextSession.user.id);
        if (!mounted) return;
        setOrgId(nextOrgId);
      } else {
        setOrgId(null);
      }

      if (mounted) {
        setIsLoading(false);
      }
    };

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      void syncAuthState(nextSession);
    });

    const bootstrap = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        await syncAuthState(data.session);
      } catch (error) {
        console.error("Failed to bootstrap auth session:", error);
        if (!mounted) return;
        setSession(null);
        setUser(null);
        setOrgId(null);
        setIsLoading(false);
      }
    };

    void bootstrap();

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUpNewUser: AuthContextValue["signUpNewUser"] = async (
    email,
    password,
    fullName,
    organizationName
  ) => {
    if (!supabase) {
      return { success: false, error: new Error("Supabase client not configured") };
    }

    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          name: fullName ?? email.split("@")[0],
          businessName: organizationName,
        },
      },
    });

    if (error) {
      console.error("Error signing up: ", error);
      return { success: false, error };
    }

    if (data.user) {
      const userId = data.user.id;
      const nowIso = new Date().toISOString();
      const userMetadata = (data.user.user_metadata || {}) as {
        industry?: string;
      };

      const organizationInsert = {
        name:
          organizationName ||
          (fullName ? `${fullName}'s Organization` : `${email.split("@")[0]}'s Organization`),
        industry_type: userMetadata.industry ?? null,
        plan_type: "free",
        subscription_status: "free",
        created_at: nowIso,
        updated_at: nowIso,
      } as const;

      const { data: orgData, error: orgError } = await supabase
        .from("organizations")
        .insert(organizationInsert)
        .select()
        .single();

      if (orgError || !orgData) {
        console.error("Error creating organization record:", orgError);
        return { success: false, error: orgError ?? new Error("Failed to create organization") };
      }

      setOrgId(orgData.id);

      const { error: profileError } = await supabase.from("profiles").insert({
        id: userId,
        organization_id: orgData.id,
        name: fullName ?? email.split("@")[0],
        role: "admin",
        created_at: nowIso,
      });

      if (profileError) {
        console.error("Error creating profile record:", profileError);
        return { success: false, error: profileError };
      }

      setUser(mapSupabaseUserToAppUser(data.user));
    }

    return { success: true, data };
  };

  const signInUser: AuthContextValue["signInUser"] = async (email, password) => {
    if (!supabase) {
      return { success: false, error: new Error("Supabase client not configured") };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        console.error("Supabase sign-in failed:", getAuthErrorDetails(error));
        return { success: false, error };
      }
      if (!data.user) return { success: false, error: "User not returned from auth." };

      setSession(data.session ?? null);
      setUser(mapSupabaseUserToAppUser(data.user));
      setOrgId(await fetchOrgIdForUser(data.user.id));

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during sign-in:", error);
      return { success: false, error };
    }
  };

  const signOut: AuthContextValue["signOut"] = async () => {
    if (!supabase) return;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
    }

    if (typeof window !== "undefined") {
      for (let index = window.localStorage.length - 1; index >= 0; index -= 1) {
        const key = window.localStorage.key(index);
        if (key?.startsWith("sb-")) {
          window.localStorage.removeItem(key);
        }
      }
    }

    setSession(null);
    setUser(null);
    setOrgId(null);
  };

  const updateUser: AuthContextValue["updateUser"] = async (updates) => {
    if (!supabase || !session) return;

    const currentUser = session.user;
    const currentMeta = (currentUser.user_metadata || {}) as Partial<AppUser>;
    const newMeta: Partial<AppUser> = {
      ...currentMeta,
      ...updates,
    };

    const { error } = await supabase.auth.updateUser({
      data: newMeta,
    });

    if (error) {
      console.error("Failed to update user metadata:", error);
      return;
    }

    const updatedUser: SupabaseUser = {
      ...currentUser,
      user_metadata: {
        ...(currentUser.user_metadata || {}),
        ...newMeta,
      },
    } as SupabaseUser;

    setUser(mapSupabaseUserToAppUser(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{ signUpNewUser, signInUser, session, user, orgId, isLoading, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const UserAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("UserAuth must be used within an AuthContextProvider");
  }
  return ctx;
};

export const useAuth = () => UserAuth();

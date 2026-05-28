import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { UserAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const getLoginErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    const maybeError = error as Error & {
      status?: number;
      code?: string;
    };

    if (maybeError.code === "email_not_confirmed") {
      return "This account exists, but the email address has not been confirmed yet.";
    }

    if (maybeError.code === "invalid_credentials") {
      return "Supabase rejected this email/password for the current project. If the password is correct, verify the app is using the same Supabase project where the user was created.";
    }

    if (maybeError.status && maybeError.code) {
      return `${maybeError.message} (${maybeError.code}, HTTP ${maybeError.status})`;
    }

    if (maybeError.status) {
      return `${maybeError.message} (HTTP ${maybeError.status})`;
    }

    return maybeError.message;
  }

  if (typeof error === "string") {
    return error;
  }

  if (typeof error === "object" && error !== null) {
    const maybeError = error as {
      message?: unknown;
      status?: unknown;
      code?: unknown;
    };

    const message = typeof maybeError.message === "string" ? maybeError.message : "Login failed";
    const code = typeof maybeError.code === "string" ? maybeError.code : undefined;
    const status = typeof maybeError.status === "number" ? maybeError.status : undefined;

    if (code && status) {
      return `${message} (${code}, HTTP ${status})`;
    }

    return message;
  }

  return "Login failed";
};

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signInUser, session } = UserAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (!session) {
      return;
    }

    const from = (location.state as any)?.from?.pathname || "/setup";
    navigate(from, { replace: true });
  }, [session, location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      const result = await signInUser(formData.email, formData.password);
      if (result.success) {
        toast.success("Welcome back!");
        const from = (location.state as any)?.from?.pathname || "/setup";
        navigate(from, { replace: true });
      } else {
        const errorMessage = getLoginErrorMessage(result.error);
        toast.error(errorMessage);
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] flex items-center section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-md mx-auto"
          >
            <div className="card-elevated p-8">
              <div className="text-center mb-8">
                <Link to="/" className="inline-flex items-center gap-2 mb-6">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                    <span className="font-display font-bold text-primary-foreground">I</span>
                  </div>
                </Link>
                <h1 className="font-display text-2xl font-bold mb-2">Welcome back</h1>
                <p className="text-muted-foreground">Log in to your Invictus Pulse account</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full h-12 px-4 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="john@company.com"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium">Password</label>
                    <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full h-12 px-4 pr-12 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full" size="lg" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Log In"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              </form>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button variant="outline" className="w-full" size="lg">
                <Mail className="h-4 w-4" />
                Continue with Google
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign up free
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}

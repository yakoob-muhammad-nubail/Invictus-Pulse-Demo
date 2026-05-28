import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Mail, Eye, EyeOff, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { UserAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUpNewUser, session } = UserAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
  });

  useEffect(() => {
    if (!session) {
      return;
    }

    navigate("/setup", { replace: true });
  }, [session, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await signUpNewUser(
        formData.email,
        formData.password,
        formData.name,
        formData.company
      );
      if (result.success) {
        toast.success("Account created successfully!");
        navigate("/setup");
      } else {
        toast.error("Unable to create account. Please check your details and try again.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <section className="min-h-[calc(100vh-4rem)] flex items-center section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* Left side - Benefits */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden lg:block"
            >
              <h1 className="font-display text-4xl font-bold mb-6">
                Start your <span className="text-gradient">free trial</span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                14 days of Premium features. No credit card required. Setup in 2 minutes.
              </p>

              <div className="space-y-4">
                {[
                  "Automatic contact capture from email",
                  "SMS and WhatsApp integration",
                  "AI-powered follow-up suggestions",
                  "Team collaboration features",
                  "Priority support",
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                      <Check className="h-3 w-3 text-primary" />
                    </div>
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-12 p-6 bg-secondary rounded-xl">
                <p className="text-muted-foreground italic mb-4">
                  "We went from losing half our phone leads to capturing 95%. Invictus just works."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="font-semibold text-primary">MT</span>
                  </div>
                  <div>
                    <p className="font-medium">Mike Thompson</p>
                    <p className="text-sm text-muted-foreground">Owner, Northern Comfort HVAC</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right side - Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-md mx-auto lg:mx-0 w-full"
            >
              <div className="card-elevated p-8">
                <div className="text-center mb-8 lg:hidden">
                  <h1 className="font-display text-2xl font-bold mb-2">Create your account</h1>
                  <p className="text-muted-foreground">Start your 14-day free trial</p>
                </div>
                <h2 className="font-display text-2xl font-bold mb-2 hidden lg:block">
                  Create your account
                </h2>
                <p className="text-muted-foreground mb-6 hidden lg:block">
                  Fill in your details to get started
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Full name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="John Smith"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Work email</label>
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
                    <label className="block text-sm font-medium mb-2">Company name</label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full h-12 px-4 rounded-lg bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      placeholder="Acme Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
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
                    {isLoading ? "Creating account..." : "Create Account"}
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
                  Sign up with Google
                </Button>

                <p className="text-center text-sm text-muted-foreground mt-6">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Log in
                  </Link>
                </p>

                <p className="text-center text-xs text-muted-foreground mt-4">
                  By creating an account, you agree to our{" "}
                  <Link to="/terms" className="underline">Terms</Link> and{" "}
                  <Link to="/privacy" className="underline">Privacy Policy</Link>.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

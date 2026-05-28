import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Building, Home, Stethoscope, Users, ArrowRight, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

const industries = [
  {
    id: "contractors" as const,
    icon: Building,
    title: "Contractors",
    description: "HVAC, Electrical, Plumbing & More",
  },
  {
    id: "real-estate" as const,
    icon: Home,
    title: "Real Estate",
    description: "Agents & Teams",
  },
  {
    id: "clinics" as const,
    icon: Stethoscope,
    title: "Clinics",
    description: "Medical, Dental & Therapy",
  },
  {
    id: "consultants" as const,
    icon: Users,
    title: "Consultants",
    description: "Coaches & Advisors",
  },
];

export default function SetupPage() {
  const navigate = useNavigate();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [selectedIndustry, setSelectedIndustry] = useState<typeof industries[0]["id"] | null>(null);
  const [businessName, setBusinessName] = useState("");

  const handleNext = () => {
    if (step === 1 && selectedIndustry) {
      setStep(2);
    } else if (step === 2 && businessName.trim()) {
      setStep(3);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = () => {
    updateUser({
      industry: selectedIndustry!,
      businessName: businessName.trim(),
      setupComplete: true,
    });
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="absolute inset-0 bg-grid opacity-20" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-2xl"
      >
        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all duration-300 ${s === step
                ? "w-8 bg-primary"
                : s < step
                  ? "w-2 bg-primary/60"
                  : "w-2 bg-muted"
                }`}
            />
          ))}
        </div>

        <div className="card-elevated p-8 sm:p-12">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="font-display text-3xl font-bold mb-2">
                    Welcome, {user?.name}!
                  </h1>
                  <p className="text-muted-foreground">
                    Let's set up your Invictus experience. What industry are you in?
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  {industries.map((industry) => (
                    <button
                      key={industry.id}
                      onClick={() => setSelectedIndustry(industry.id)}
                      className={`p-6 rounded-xl border-2 text-left transition-all ${selectedIndustry === industry.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 hover:bg-card"
                        }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${selectedIndustry === industry.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                          }`}
                      >
                        <industry.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-display font-semibold mb-1">{industry.title}</h3>
                      <p className="text-sm text-muted-foreground">{industry.description}</p>
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex justify-end">
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleNext}
                    disabled={!selectedIndustry}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="text-center mb-8">
                  <h1 className="font-display text-3xl font-bold mb-2">
                    Tell us about your business
                  </h1>
                  <p className="text-muted-foreground">
                    We'll personalize your experience based on this information.
                  </p>
                </div>

                <div className="space-y-6 max-w-md mx-auto">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder="Enter your business name"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="h-12"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-between">
                  <Button variant="ghost" size="lg" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    variant="hero"
                    size="lg"
                    onClick={handleNext}
                    disabled={!businessName.trim()}
                  >
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-center"
              >
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Check className="h-10 w-10 text-primary" />
                </div>
                <h1 className="font-display text-3xl font-bold mb-2">You're all set!</h1>
                <p className="text-muted-foreground mb-8">
                  Your Invictus Pulse workspace for <strong>{businessName}</strong> is ready.
                </p>

                <div className="bg-card/50 rounded-xl p-6 mb-8 text-left">
                  <h3 className="font-medium mb-4">What happens next:</h3>
                  <ul className="space-y-3">
                    {[
                      "Your action inbox is ready with smart suggestions",
                      "Connect your email and messaging channels",
                      "Start capturing leads automatically",
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check className="h-3 w-3 text-primary" />
                        </div>
                        <span className="text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-between">
                  <Button variant="ghost" size="lg" onClick={handleBack}>
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                  <Button variant="hero" size="lg" onClick={handleComplete}>
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

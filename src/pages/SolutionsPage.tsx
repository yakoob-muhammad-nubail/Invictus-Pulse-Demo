import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building, Home, Stethoscope, Users, ArrowRight, Check,
  Wrench, Key, Heart, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const solutions = {
  contractors: {
    icon: Building,
    heroIcon: Wrench,
    title: "Contractors",
    subtitle: "HVAC, Electrical, Plumbing & More",
    headline: "Stop losing leads in the field",
    description: "Service calls come from everywhere — phone, email, texts. Invictus captures every inquiry and creates a complete client history, so no job falls through the cracks.",
    benefits: [
      "Automatic lead capture from calls and messages",
      "Job history attached to every client",
      "Follow-up reminders for quotes and estimates",
      "Team coordination across field crews",
    ],
    challenges: [
      { problem: "Missed callbacks", solution: "Auto-reminders for every unanswered inquiry" },
      { problem: "Lost quote follow-ups", solution: "Scheduled follow-up sequences" },
      { problem: "Scattered client info", solution: "Unified contact timeline" },
    ],
    stats: [
      { value: "40%", label: "More leads captured" },
      { value: "2x", label: "Faster follow-up" },
      { value: "35%", label: "Higher close rate" },
    ],
  },
  "real-estate": {
    icon: Home,
    heroIcon: Key,
    title: "Real Estate",
    subtitle: "Agents & Teams",
    headline: "Never miss a buyer again",
    description: "In real estate, speed wins. Invictus ensures every lead is captured the moment they reach out — and that follow-ups happen at the perfect time.",
    benefits: [
      "Instant lead capture from all channels",
      "Property interest tracking by contact",
      "Automated drip campaigns",
      "Team lead distribution",
    ],
    challenges: [
      { problem: "Slow lead response", solution: "Instant notification & suggested responses" },
      { problem: "Forgotten follow-ups", solution: "AI-scheduled nurture sequences" },
      { problem: "Manual CRM updates", solution: "Zero data entry required" },
    ],
    stats: [
      { value: "5 min", label: "Avg response time" },
      { value: "60%", label: "More engagement" },
      { value: "25%", label: "More closings" },
    ],
  },
  clinics: {
    icon: Stethoscope,
    heroIcon: Heart,
    title: "Clinics",
    subtitle: "Medical, Dental & Therapy",
    headline: "Focus on patients, not paperwork",
    description: "Healthcare requires trust and attention. Invictus handles patient communication tracking so you can focus on what matters — care.",
    benefits: [
      "HIPAA-compliant communication capture",
      "Appointment reminder automation",
      "Patient history at a glance",
      "No-show follow-up automation",
    ],
    challenges: [
      { problem: "No-show patients", solution: "Smart reminder sequences" },
      { problem: "Manual record updates", solution: "Auto-synced patient timelines" },
      { problem: "Compliance concerns", solution: "HIPAA-ready configuration" },
    ],
    stats: [
      { value: "30%", label: "Fewer no-shows" },
      { value: "2 hrs", label: "Saved daily on admin" },
      { value: "99.9%", label: "Uptime SLA" },
    ],
  },
  consultants: {
    icon: Users,
    heroIcon: Briefcase,
    title: "Consultants",
    subtitle: "Coaches & Advisors",
    headline: "Build relationships, not spreadsheets",
    description: "Your reputation is built on relationships. Invictus captures every interaction so you never forget a detail or miss a follow-up.",
    benefits: [
      "Complete client interaction history",
      "Smart follow-up suggestions",
      "Meeting prep summaries",
      "Engagement insights",
    ],
    challenges: [
      { problem: "Forgotten context", solution: "Full conversation timeline per client" },
      { problem: "Manual note-taking", solution: "AI-generated call summaries" },
      { problem: "Missed opportunities", solution: "Engagement-based alerts" },
    ],
    stats: [
      { value: "85%", label: "Less admin time" },
      { value: "3x", label: "More touchpoints" },
      { value: "50%", label: "Better retention" },
    ],
  },
};

export default function SolutionsPage() {
  const { industry } = useParams<{ industry?: string }>();
  const solution = industry ? solutions[industry as keyof typeof solutions] : null;

  // Industry overview page
  if (!solution) {
    return (
      <Layout>
        <section className="relative overflow-hidden bg-gradient-hero section-padding">
          <div className="absolute inset-0 bg-grid opacity-40" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-3xl mx-auto text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
              >
                Built for <span className="text-gradient-accent">your industry</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-lg sm:text-xl text-muted-foreground"
              >
                Pre-configured workflows and features designed for service businesses.
              </motion.p>
            </div>
          </div>
        </section>

        <section className="section-padding">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              {Object.entries(solutions).map(([key, sol], index) => (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Link
                    to={`/solutions/${key}`}
                    className="card-elevated p-8 flex flex-col h-full hover:border-primary/30 transition-colors group block"
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-6 group-hover:from-primary/30 transition-colors">
                      <sol.icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display text-2xl font-bold mb-2">{sol.title}</h3>
                    <p className="text-muted-foreground mb-4">{sol.subtitle}</p>
                    <p className="text-muted-foreground flex-grow">{sol.description}</p>
                    <div className="mt-6 flex items-center gap-2 text-primary font-medium">
                      Learn more <ArrowRight className="h-4 w-4" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </Layout>
    );
  }

  // Individual industry page
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero section-padding">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center mx-auto mb-8"
            >
              <solution.heroIcon className="h-10 w-10 text-primary-foreground" />
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-primary font-medium mb-4"
            >
              {solution.subtitle}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            >
              {solution.headline}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8"
            >
              {solution.description}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-8">
            {solution.stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="font-display text-3xl sm:text-4xl font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-8 text-center">
              Built for <span className="text-gradient">{solution.title.toLowerCase()}</span>
            </h2>
            <div className="space-y-4">
              {solution.benefits.map((benefit, index) => (
                <motion.div
                  key={benefit}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="card-elevated p-6 flex items-center gap-4"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Check className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Challenges */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl font-bold mb-12 text-center">
            Your challenges, <span className="text-gradient-accent">solved</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {solution.challenges.map((challenge, index) => (
              <motion.div
                key={challenge.problem}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8"
              >
                <div className="text-destructive text-sm font-medium mb-2">Challenge</div>
                <h3 className="font-display text-xl font-semibold mb-4">{challenge.problem}</h3>
                <div className="text-primary text-sm font-medium mb-2">Solution</div>
                <p className="text-muted-foreground">{challenge.solution}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-elevated p-12 text-center max-w-3xl mx-auto glow-primary">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to transform your {solution.title.toLowerCase()} business?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of {solution.title.toLowerCase()} using Invictus to automate their client management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link to="/pricing">View Pricing</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

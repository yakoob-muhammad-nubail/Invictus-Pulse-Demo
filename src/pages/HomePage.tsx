import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Mail, MessageSquare, Phone, Calendar, Zap, 
  ArrowRight, Check, Building, Home, Stethoscope, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const features = [
  {
    icon: Mail,
    title: "Email Capture",
    description: "Auto-parse Gmail, Outlook, and IMAP to extract leads and create contacts.",
  },
  {
    icon: MessageSquare,
    title: "SMS & WhatsApp",
    description: "Capture conversations from SMS and WhatsApp Business automatically.",
  },
  {
    icon: Phone,
    title: "Call Tracking",
    description: "Record, transcribe, and summarize phone calls with AI-powered notes.",
  },
  {
    icon: Calendar,
    title: "Calendar Sync",
    description: "Sync Google and Outlook calendars for automatic meeting tracking.",
  },
  {
    icon: Zap,
    title: "Smart Follow-ups",
    description: "AI suggests and schedules follow-ups based on conversation context.",
  },
];

const industries = [
  { icon: Building, name: "Contractors", description: "HVAC, electrical, plumbing", href: "/solutions/contractors" },
  { icon: Home, name: "Real Estate", description: "Agents & teams", href: "/solutions/real-estate" },
  { icon: Stethoscope, name: "Clinics", description: "Medical, dental, therapy", href: "/solutions/clinics" },
  { icon: Users, name: "Consultants", description: "Coaches & advisors", href: "/solutions/consultants" },
];

const stats = [
  { value: "0", label: "Manual data entry required" },
  { value: "85%", label: "Less time on admin tasks" },
  { value: "3x", label: "More follow-ups completed" },
  { value: "2 min", label: "Average setup time" },
];

export default function HomePage() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero section-padding">
        {/* Grid background */}
        <div className="absolute inset-0 bg-grid opacity-40" />
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full" 
             style={{ background: 'var(--gradient-glow)' }} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-6">
                <Zap className="h-4 w-4" />
                The Invisible CRM Revolution
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              CRM that works{" "}
              <span className="text-gradient">while you work</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto"
            >
              Zero data entry. Automatic contact capture from email, SMS, WhatsApp, and calls. 
              Your CRM fills itself so you can focus on what matters — your clients.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Start Free Trial
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/features">See How It Works</Link>
              </Button>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-6 text-sm text-muted-foreground"
            >
              Free forever plan available • No credit card required
            </motion.p>
          </div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-16 relative"
          >
            <div className="card-elevated p-2 rounded-2xl max-w-5xl mx-auto glow-primary">
              <div className="bg-secondary rounded-xl aspect-video flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 mb-4">
                    <Zap className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h3 className="font-display text-xl font-semibold mb-2">Action-First Interface</h3>
                  <p className="text-muted-foreground max-w-md">
                    No overwhelming dashboards. Just a simple inbox of what needs your attention today.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
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

      {/* Features Grid */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Capture everything. <span className="text-gradient">Automatically.</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Invictus connects to your communication channels and captures every client interaction without you lifting a finger.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card-elevated p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:from-primary/30 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" asChild>
              <Link to="/features">
                Explore All Features
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Built for <span className="text-gradient-accent">service businesses</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Pre-configured workflows for the industries that need invisible CRM the most.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {industries.map((industry, index) => (
              <motion.div
                key={industry.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  to={industry.href}
                  className="card-elevated p-6 flex flex-col items-center text-center hover:border-accent/30 transition-all group block"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mb-4 group-hover:from-accent/30 transition-colors">
                    <industry.icon className="h-7 w-7 text-accent" />
                  </div>
                  <h3 className="font-display font-semibold mb-1">{industry.name}</h3>
                  <p className="text-sm text-muted-foreground">{industry.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It's Different */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
                Why traditional CRMs <span className="text-destructive">fail</span>
              </h2>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm">✕</span>
                  </div>
                  <p className="text-muted-foreground">Require constant manual data entry that nobody wants to do</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm">✕</span>
                  </div>
                  <p className="text-muted-foreground">Overwhelm with complex dashboards and endless features</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-destructive/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-destructive text-sm">✕</span>
                  </div>
                  <p className="text-muted-foreground">Become yet another app to check instead of a helper</p>
                </div>
              </div>

              <h3 className="font-display text-xl font-semibold mb-4 text-primary">
                Invictus is different
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">Automatically captures data from your existing channels</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">Shows only what needs attention — no dashboard overload</p>
                </div>
                <div className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">Works invisibly so you can focus on clients, not software</p>
                </div>
              </div>
            </div>

            <div className="card-elevated p-8 text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 mb-6">
                <Zap className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="font-display text-2xl font-bold mb-3">Ready in 2 minutes</h3>
              <p className="text-muted-foreground mb-6">
                Connect your email and you're done. Invictus starts capturing immediately.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup">Get Started Free</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-b from-background to-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-6">
              Stop entering data. <span className="text-gradient">Start closing deals.</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of service businesses using Invictus to automate their client management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" asChild>
                <Link to="/signup">
                  Start Your Free Trial
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

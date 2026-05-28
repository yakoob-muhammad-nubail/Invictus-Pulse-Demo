import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Check, X, TrendingUp, Users, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const comparisons = [
  { feature: "Manual data entry", traditional: true, invictus: false },
  { feature: "Dashboards first", traditional: true, invictus: false },
  { feature: "High setup friction", traditional: true, invictus: false },
  { feature: "Generic workflows", traditional: true, invictus: false },
  { feature: "User-driven updates", traditional: true, invictus: false },
  { feature: "Auto capture from channels", traditional: false, invictus: true },
  { feature: "Action-first interface", traditional: false, invictus: true },
  { feature: "Ready out of the box", traditional: false, invictus: true },
  { feature: "Industry-specific workflows", traditional: false, invictus: true },
  { feature: "System-driven intelligence", traditional: false, invictus: true },
];

const insights = [
  {
    icon: TrendingUp,
    stat: "73%",
    title: "CRM adoption failure rate",
    description: "Most CRM implementations fail because users resist the manual data entry burden.",
  },
  {
    icon: Clock,
    stat: "5.5 hrs",
    title: "Weekly time on CRM tasks",
    description: "Average time sales reps spend on CRM data entry instead of selling.",
  },
  {
    icon: Users,
    stat: "40%",
    title: "Leads lost to poor follow-up",
    description: "Businesses lose leads simply because follow-ups fall through the cracks.",
  },
];

const caseStudies = [
  {
    industry: "HVAC Contractor",
    company: "Northern Comfort HVAC",
    quote: "We went from losing half our phone leads to capturing 95%. Invictus just works.",
    author: "Mike Thompson",
    role: "Owner",
    results: [
      { metric: "Lead capture rate", before: "52%", after: "95%" },
      { metric: "Follow-up completion", before: "30%", after: "89%" },
      { metric: "Monthly revenue", before: "$45K", after: "$72K" },
    ],
  },
  {
    industry: "Real Estate",
    company: "Keystone Realty Group",
    quote: "My agents actually use this CRM because they don't have to do anything. It just captures everything.",
    author: "Sarah Chen",
    role: "Broker",
    results: [
      { metric: "Team adoption", before: "20%", after: "100%" },
      { metric: "Response time", before: "4 hrs", after: "15 min" },
      { metric: "Closed deals/month", before: "8", after: "14" },
    ],
  },
  {
    industry: "Dental Clinic",
    company: "Bright Smile Dental",
    quote: "Patient communication is tracked automatically. We focus on care, not paperwork.",
    author: "Dr. James Park",
    role: "Lead Dentist",
    results: [
      { metric: "No-show rate", before: "18%", after: "7%" },
      { metric: "Admin hours/week", before: "15", after: "4" },
      { metric: "Patient satisfaction", before: "4.2", after: "4.9" },
    ],
  },
];

export default function WhyInvictusPage() {
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
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center mx-auto mb-8"
            >
              <Sparkles className="h-8 w-8 text-primary-foreground" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            >
              Why <span className="text-gradient">Invictus?</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground"
            >
              Traditional CRMs fail because they fight human nature. Invictus works with it.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Behavioral Insight */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              The <span className="text-destructive">data entry problem</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              The best CRM is one that doesn't require you to be a data entry clerk.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {insights.map((insight, index) => (
              <motion.div
                key={insight.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8 text-center"
              >
                <div className="w-14 h-14 rounded-xl bg-destructive/20 flex items-center justify-center mx-auto mb-4">
                  <insight.icon className="h-7 w-7 text-destructive" />
                </div>
                <div className="font-display text-4xl font-bold text-destructive mb-2">
                  {insight.stat}
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{insight.title}</h3>
                <p className="text-muted-foreground text-sm">{insight.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Traditional CRM vs <span className="text-gradient">Invictus</span>
              </h2>
            </div>

            <div className="card-elevated overflow-hidden">
              <div className="grid grid-cols-3 p-4 bg-secondary font-semibold text-sm">
                <div>Feature</div>
                <div className="text-center text-destructive">Traditional</div>
                <div className="text-center text-primary">Invictus</div>
              </div>
              {comparisons.map((row, index) => (
                <motion.div
                  key={row.feature}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.03 }}
                  className="grid grid-cols-3 p-4 border-t border-border text-sm"
                >
                  <div>{row.feature}</div>
                  <div className="flex justify-center">
                    {row.traditional ? (
                      <Check className="h-5 w-5 text-primary" />
                    ) : (
                      <X className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                  <div className="flex justify-center">
                    {row.invictus ? (
                      <Check className="h-5 w-5 text-primary" />
                    ) : (
                      <X className="h-5 w-5 text-destructive" />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="section-padding" id="case-studies">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Real results from <span className="text-gradient-accent">real businesses</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              See how service businesses transformed their client management with Invictus.
            </p>
          </div>

          <div className="space-y-12">
            {caseStudies.map((study, index) => (
              <motion.div
                key={study.company}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8 lg:p-12"
              >
                <div className="grid lg:grid-cols-2 gap-8">
                  <div>
                    <span className="text-primary text-sm font-semibold">{study.industry}</span>
                    <h3 className="font-display text-2xl font-bold mt-2 mb-4">{study.company}</h3>
                    <blockquote className="text-lg text-muted-foreground italic mb-6">
                      "{study.quote}"
                    </blockquote>
                    <div>
                      <p className="font-semibold">{study.author}</p>
                      <p className="text-sm text-muted-foreground">{study.role}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {study.results.map((result) => (
                      <div key={result.metric} className="bg-secondary rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-2">{result.metric}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-destructive line-through">{result.before}</span>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                          <span className="text-primary font-bold text-lg">{result.after}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-elevated p-12 text-center max-w-3xl mx-auto glow-primary">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to join them?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your free trial and see the difference an invisible CRM makes.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Start Free Trial
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

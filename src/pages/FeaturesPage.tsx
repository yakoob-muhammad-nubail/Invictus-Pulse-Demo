import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail, MessageSquare, Phone, Calendar, Zap, Bell,
  LayoutGrid, Shield, Link as LinkIcon, ArrowRight, Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const captureFeatures = [
  {
    icon: Mail,
    title: "Email Integration",
    description: "Connect Gmail, Outlook, or any IMAP/POP email. Automatically parse contacts, extract key information, and track conversations.",
    benefits: ["Auto-detect new contacts", "Thread summarization", "Attachment tracking"],
  },
  {
    icon: MessageSquare,
    title: "WhatsApp & SMS",
    description: "Capture every text conversation with clients. WhatsApp Business API and Twilio integration for complete coverage.",
    benefits: ["Real-time sync", "Message threading", "Media capture"],
  },
  {
    icon: Phone,
    title: "Call Tracking & Transcription",
    description: "Record calls with consent, transcribe with AI, and generate instant summaries. Never miss important details.",
    benefits: ["AI transcription", "Auto-summaries", "Action item extraction"],
  },
  {
    icon: Calendar,
    title: "Calendar Sync",
    description: "Connect Google and Outlook calendars. Track meetings, no-shows, and automatically associate events with contacts.",
    benefits: ["Two-way sync", "Meeting notes", "Reminder automation"],
  },
];

const automationFeatures = [
  {
    icon: Zap,
    title: "Smart Follow-ups",
    description: "AI analyzes conversation context and suggests optimal follow-up timing and content. Schedule automatically or with one click.",
  },
  {
    icon: Bell,
    title: "Priority Alerts",
    description: "Get notified about hot leads, missed contacts, and time-sensitive opportunities. Never let a deal slip through.",
  },
  {
    icon: LayoutGrid,
    title: "Action Cards",
    description: "Replace overwhelming dashboards with simple, actionable cards. See what needs attention today at a glance.",
  },
];

const integrations = [
  { name: "Gmail", category: "Email" },
  { name: "Outlook", category: "Email" },
  { name: "WhatsApp Business", category: "Messaging" },
  { name: "Twilio", category: "SMS/Voice" },
  { name: "Google Calendar", category: "Calendar" },
  { name: "Stripe", category: "Payments" },
  { name: "QuickBooks", category: "Accounting" },
  { name: "Xero", category: "Accounting" },
];

const securityFeatures = [
  "256-bit AES encryption at rest",
  "TLS 1.3 encryption in transit",
  "Role-based access controls",
  "Complete audit logging",
  "HIPAA-ready configuration",
  "SOC 2 Type II compliant",
  "Data residency options",
  "Regular security audits",
];

export default function FeaturesPage() {
  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-hero section-padding">
        <div className="absolute inset-0 bg-grid opacity-40" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-display text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            >
              Features that <span className="text-gradient">disappear</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground"
            >
              The best CRM is one you never have to think about. Invictus captures, organizes, and reminds — invisibly.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Data Capture */}
      <section className="section-padding" id="capture">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Omni-Channel <span className="text-gradient">Data Capture</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Connect your channels once. Invictus captures every interaction automatically.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {captureFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-7 w-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.benefits.map((benefit) => (
                        <li key={benefit} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation */}
      <section className="section-padding bg-card/50" id="automation">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Intelligent <span className="text-gradient-accent">Automation</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              AI-powered workflows that work in the background so you don't have to.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {automationFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-8 text-center"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="section-padding" id="integrations">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-2 text-primary mb-4">
                <LinkIcon className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Integrations</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Connect your entire stack
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Invictus integrates with the tools you already use. No migration required — just enhanced visibility.
              </p>
              <Button variant="outline" asChild>
                <Link to="/features#integrations">
                  View All Integrations
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {integrations.map((integration, index) => (
                <motion.div
                  key={integration.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="card-elevated p-4 text-center hover:border-primary/30 transition-colors"
                >
                  <p className="font-medium">{integration.name}</p>
                  <p className="text-xs text-muted-foreground">{integration.category}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="section-padding bg-card/50" id="security">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-4">
                {securityFeatures.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center gap-2"
                  >
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <div className="flex items-center gap-2 text-primary mb-4">
                <Shield className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-wider">Security & Compliance</span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Enterprise-grade security
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Your client data is sensitive. Invictus is built with security-first architecture and compliance in mind.
              </p>
              <Button variant="outline" asChild>
                <Link to="/security">
                  Security Documentation
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-elevated p-12 text-center max-w-3xl mx-auto glow-primary">
            <h2 className="font-display text-3xl font-bold mb-4">
              Ready to go invisible?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Start your free trial today. Setup takes less than 2 minutes.
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

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  ArrowRight, MapPin, Users, Heart, Zap, Target, Shield,
  Mail, Linkedin, Briefcase
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const values = [
  {
    icon: Zap,
    title: "Invisible by Design",
    description: "We build software that works in the background, so our users can focus on what matters.",
  },
  {
    icon: Heart,
    title: "Human-Centered",
    description: "Technology should adapt to people, not the other way around.",
  },
  {
    icon: Target,
    title: "Results-Driven",
    description: "We measure success by the outcomes we create for our customers.",
  },
  {
    icon: Shield,
    title: "Trust & Security",
    description: "We treat your data with the same care we'd expect for our own.",
  },
];

const team = [
  {
    name: "Alexandra Chen",
    role: "CEO & Co-Founder",
    bio: "Former product lead at Salesforce. Passionate about making CRM invisible.",
  },
  {
    name: "Marcus Thompson",
    role: "CTO & Co-Founder",
    bio: "Ex-Google engineer. Built ML systems serving billions of requests.",
  },
  {
    name: "Sarah Williams",
    role: "Head of Product",
    bio: "10 years building B2B SaaS products that users actually love.",
  },
  {
    name: "David Park",
    role: "Head of Engineering",
    bio: "Previously Stripe. Expert in building reliable, scalable systems.",
  },
];

const openPositions = [
  {
    title: "Senior Full-Stack Engineer",
    department: "Engineering",
    location: "Remote (Canada)",
    type: "Full-time",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Toronto, ON",
    type: "Full-time",
  },
  {
    title: "Customer Success Manager",
    department: "Customer Success",
    location: "Remote (North America)",
    type: "Full-time",
  },
  {
    title: "Sales Development Rep",
    department: "Sales",
    location: "Toronto, ON",
    type: "Full-time",
  },
];

export default function AboutPage() {
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
              Making CRM <span className="text-gradient">invisible</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground"
            >
              We're on a mission to eliminate the friction between service businesses and their clients.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-6">Our Story</h2>
            <div className="prose prose-lg prose-invert">
              <p className="text-muted-foreground mb-4">
                We started Invictus because we experienced the CRM problem firsthand. As consultants 
                working with service businesses, we watched countless companies buy expensive CRM 
                systems that nobody used.
              </p>
              <p className="text-muted-foreground mb-4">
                The problem wasn't the people — it was the software. Traditional CRMs demand data 
                entry that busy professionals simply don't have time for. So we asked: what if 
                the CRM filled itself?
              </p>
              <p className="text-muted-foreground">
                That question led to Invictus — a CRM that captures client interactions automatically 
                from email, SMS, WhatsApp, and phone calls. No data entry. No overwhelming dashboards. 
                Just a simple view of what needs your attention today.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">Our Values</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{value.title}</h3>
                <p className="text-muted-foreground text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Meet the <span className="text-gradient">Team</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              We're a small team of experienced builders from some of the best companies in tech.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display font-semibold">{member.name}</h3>
                <p className="text-primary text-sm mb-3">{member.role}</p>
                <p className="text-muted-foreground text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Careers */}
      <section className="section-padding bg-card/50" id="careers">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="h-6 w-6 text-accent" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Open Positions</h2>
          </div>

          <div className="space-y-4 max-w-3xl">
            {openPositions.map((position, index) => (
              <motion.div
                key={position.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-accent/30 transition-colors cursor-pointer"
              >
                <div>
                  <h3 className="font-display font-semibold mb-1">{position.title}</h3>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    <span>{position.department}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {position.location}
                    </span>
                    <span>•</span>
                    <span>{position.type}</span>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="section-padding" id="contact">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-display text-3xl font-bold mb-4">Get in Touch</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions? We'd love to hear from you.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Button variant="hero" size="lg" asChild>
                <a href="mailto:hello@invictus.io">
                  <Mail className="h-4 w-4" />
                  hello@invictus.io
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="#">
                  <Linkedin className="h-4 w-4" />
                  LinkedIn
                </a>
              </Button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Toronto, Ontario, Canada</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}

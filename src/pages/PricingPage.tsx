import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, ArrowRight, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: 0,
    description: "Perfect for solopreneurs just getting started.",
    features: [
      "Up to 500 contacts",
      "Email capture only",
      "Basic reminders",
      "30-day history",
      "Community support",
    ],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Business",
    price: 80,
    description: "For small teams ready to capture more.",
    features: [
      "Unlimited contacts",
      "Email + SMS capture",
      "Automated follow-ups",
      "Custom tags & fields",
      "1-year history",
      "Priority support",
    ],
    cta: "Start Trial",
    popular: true,
  },
  {
    name: "Premium",
    price: 249,
    description: "Full omni-channel capture for growing businesses.",
    features: [
      "Everything in Business",
      "WhatsApp integration",
      "Call tracking & transcription",
      "Advanced workflows",
      "Unlimited history",
      "Dedicated support",
    ],
    cta: "Start Trial",
    popular: false,
  },
];

const enterprisePlans = [
  { name: "Enterprise Base", price: "1,500", users: "Up to 10 users" },
  { name: "Enterprise Plus", price: "3,000", users: "Unlimited users" },
  { name: "Enterprise Elite", price: "5,000+", users: "White-label + API" },
];

const faqs = [
  {
    question: "How does the free trial work?",
    answer: "Start with 14 days of full Premium access. No credit card required. At the end, choose a plan that fits your needs — including our Free tier.",
  },
  {
    question: "Can I change plans later?",
    answer: "Absolutely. Upgrade, downgrade, or cancel anytime. We'll prorate any changes to your billing cycle.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards (Visa, MasterCard, Amex) and can arrange invoicing for annual Enterprise plans.",
  },
  {
    question: "Is there a setup fee?",
    answer: "No setup fees for standard plans. Enterprise plans include optional professional onboarding starting at CAD $499.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer: "Yes! Annual plans save you 20% compared to monthly billing.",
  },
];

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(true);

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
              Simple, <span className="text-gradient">transparent</span> pricing
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8"
            >
              Start free, scale as you grow. All plans include core invisible CRM features.
            </motion.p>

            {/* Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center gap-4"
            >
              <span className={cn("text-sm", !isAnnual && "text-foreground", isAnnual && "text-muted-foreground")}>
                Monthly
              </span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={cn(
                  "relative w-14 h-7 rounded-full transition-colors",
                  isAnnual ? "bg-primary" : "bg-secondary"
                )}
              >
                <div
                  className={cn(
                    "absolute top-1 w-5 h-5 rounded-full bg-background transition-all",
                    isAnnual ? "left-8" : "left-1"
                  )}
                />
              </button>
              <span className={cn("text-sm", isAnnual && "text-foreground", !isAnnual && "text-muted-foreground")}>
                Annual <span className="text-primary">(Save 20%)</span>
              </span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="section-padding -mt-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={cn(
                  "card-elevated p-8 relative",
                  plan.popular && "border-primary glow-primary"
                )}
              >

                <h3 className="font-display text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="font-display text-4xl font-bold">
                    ${isAnnual ? Math.round(plan.price * 0.8) : plan.price}
                  </span>
                  <span className="text-muted-foreground">/user/mo</span>
                </div>
                <p className="text-muted-foreground text-sm mb-6">{plan.description}</p>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "hero" : "outline"}
                  className="w-full"
                  asChild
                >
                  <Link to="/signup">{plan.cta}</Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enterprise */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              <span className="text-gradient-accent">Enterprise</span> solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Custom deployments for larger organizations with advanced needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            {enterprisePlans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 text-center"
              >
                <h3 className="font-display font-semibold mb-2">{plan.name}</h3>
                <div className="text-2xl font-bold text-primary mb-1">CAD ${plan.price}/mo</div>
                <p className="text-sm text-muted-foreground">{plan.users}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button variant="accent" size="lg" asChild>
              <Link to="/contact">
                Contact Sales
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Comparison Table Simplified */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-8 text-center">
              All plans include
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Automatic contact creation",
                "Conversation timeline",
                "Basic reminders",
                "Mobile-friendly interface",
                "SSL encryption",
                "Regular backups",
                "Email support",
                "Knowledge base access",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-primary" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center gap-2 mb-8">
              <HelpCircle className="h-5 w-5 text-primary" />
              <h2 className="font-display text-3xl font-bold text-center">
                Frequently asked questions
              </h2>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="card-elevated p-6"
                >
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-muted-foreground text-sm">{faq.answer}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-elevated p-12 text-center max-w-3xl mx-auto glow-primary">
            <h2 className="font-display text-3xl font-bold mb-4">
              Start your free trial today
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              14 days of Premium features. No credit card required.
            </p>
            <Button variant="hero" size="xl" asChild>
              <Link to="/signup">
                Get Started Free
                <ArrowRight className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

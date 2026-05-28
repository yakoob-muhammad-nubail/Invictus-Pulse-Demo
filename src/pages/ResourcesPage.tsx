import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  BookOpen, HelpCircle, Video, ArrowRight, Search, 
  FileText, MessageCircle, Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/layout/Layout";

const blogPosts = [
  {
    title: "5 Signs Your CRM Is Killing Your Sales",
    excerpt: "If your team avoids your CRM, it's not a people problem — it's a software problem.",
    category: "Best Practices",
    date: "Jan 15, 2026",
    readTime: "5 min read",
  },
  {
    title: "The Invisible CRM Revolution",
    excerpt: "How automated data capture is changing the way service businesses manage clients.",
    category: "Industry Trends",
    date: "Jan 10, 2026",
    readTime: "7 min read",
  },
  {
    title: "HVAC Business: From 50% to 95% Lead Capture",
    excerpt: "A case study on how one contractor transformed their sales process.",
    category: "Case Study",
    date: "Jan 5, 2026",
    readTime: "8 min read",
  },
  {
    title: "Setting Up WhatsApp for Business Communication",
    excerpt: "A complete guide to integrating WhatsApp with your client management workflow.",
    category: "Tutorial",
    date: "Dec 28, 2025",
    readTime: "10 min read",
  },
];

const helpCategories = [
  {
    icon: BookOpen,
    title: "Getting Started",
    description: "Quick setup guides and onboarding tutorials",
    articles: 12,
  },
  {
    icon: MessageCircle,
    title: "Integrations",
    description: "Connect email, SMS, WhatsApp, and more",
    articles: 24,
  },
  {
    icon: FileText,
    title: "Features & Workflows",
    description: "Make the most of automation features",
    articles: 18,
  },
  {
    icon: HelpCircle,
    title: "Troubleshooting",
    description: "Common issues and how to fix them",
    articles: 15,
  },
];

const webinars = [
  {
    title: "Getting Started with Invictus",
    description: "A 30-minute walkthrough of setup and core features.",
    date: "Every Tuesday",
    time: "2:00 PM EST",
    type: "Live",
  },
  {
    title: "Advanced Automation Workflows",
    description: "Build custom follow-up sequences and triggers.",
    date: "Feb 5, 2026",
    time: "1:00 PM EST",
    type: "Upcoming",
  },
  {
    title: "Invictus for Real Estate Teams",
    description: "Industry-specific features and best practices.",
    date: "Recorded",
    time: "45 min",
    type: "On-demand",
  },
];

export default function ResourcesPage() {
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
              Resources & <span className="text-gradient">Learning</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg sm:text-xl text-muted-foreground mb-8"
            >
              Everything you need to get the most out of Invictus.
            </motion.p>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles, tutorials, and more..."
                  className="w-full h-14 pl-12 pr-4 rounded-xl bg-secondary border border-border focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="section-padding" id="blog">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div className="flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-primary" />
              <h2 className="font-display text-2xl sm:text-3xl font-bold">Blog</h2>
            </div>
            <Button variant="ghost" asChild>
              <Link to="/blog">
                View all posts
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 hover:border-primary/30 transition-colors group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-primary/10 text-primary">
                    {post.category}
                  </span>
                  <span className="text-xs text-muted-foreground">{post.readTime}</span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{post.excerpt}</p>
                <p className="text-xs text-muted-foreground">{post.date}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Help Center */}
      <section className="section-padding bg-card/50" id="help">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <HelpCircle className="h-6 w-6 text-accent" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Help Center</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6 hover:border-accent/30 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                  <category.icon className="h-6 w-6 text-accent" />
                </div>
                <h3 className="font-display font-semibold mb-2">{category.title}</h3>
                <p className="text-muted-foreground text-sm mb-3">{category.description}</p>
                <p className="text-xs text-muted-foreground">{category.articles} articles</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button variant="outline" asChild>
              <Link to="/help">
                Browse Help Center
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Webinars */}
      <section className="section-padding" id="webinars">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-12">
            <Video className="h-6 w-6 text-primary" />
            <h2 className="font-display text-2xl sm:text-3xl font-bold">Webinars & Training</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {webinars.map((webinar, index) => (
              <motion.div
                key={webinar.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card-elevated p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{webinar.date}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {webinar.type}
                  </span>
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{webinar.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{webinar.description}</p>
                <p className="text-sm font-medium text-primary">{webinar.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-card/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card-elevated p-12 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl font-bold mb-4">
              Can't find what you need?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our support team is here to help you succeed.
            </p>
            <Button variant="hero" size="lg" asChild>
              <Link to="/contact">
                Contact Support
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}

import { Link } from "react-router-dom";
import { Mail, Linkedin, Twitter } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", href: "/features" },
    { name: "Pricing", href: "/pricing" },
    { name: "Integrations", href: "/features#integrations" },
    { name: "Security", href: "/features#security" },
  ],
  solutions: [
    { name: "Contractors", href: "/solutions/contractors" },
    { name: "Real Estate", href: "/solutions/real-estate" },
    { name: "Clinics", href: "/solutions/clinics" },
    { name: "Consultants", href: "/solutions/consultants" },
  ],
  resources: [
    { name: "Blog", href: "/resources#blog" },
    { name: "Help Center", href: "/resources#help" },
    { name: "Webinars", href: "/resources#webinars" },
    { name: "Case Studies", href: "/why-invictus#case-studies" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Careers", href: "/about#careers" },
    { name: "Contact", href: "/about#contact" },
    { name: "Privacy", href: "/privacy" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
                <span className="font-display font-bold text-primary-foreground text-sm">IP</span>
              </div>
              <span className="font-display font-bold text-xl">Invictus Pulse</span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4">
              The invisible CRM that works while you work. Zero data entry, maximum results.
            </p>
            <div className="flex gap-3">
              <a href="#" className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <Linkedin className="h-4 w-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-secondary hover:bg-secondary/80 transition-colors">
                <Mail className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Solutions</h4>
            <ul className="space-y-3">
              {footerLinks.solutions.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Invictus. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

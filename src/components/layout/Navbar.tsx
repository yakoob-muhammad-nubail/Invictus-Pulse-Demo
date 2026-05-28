import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Features", href: "/features" },
  {
    name: "Solutions",
    href: "/solutions",
    children: [
      { name: "Contractors", href: "/solutions/contractors" },
      { name: "Real Estate", href: "/solutions/real-estate" },
      { name: "Clinics", href: "/solutions/clinics" },
      { name: "Consultants", href: "/solutions/consultants" },
    ],
  },
  { name: "Pricing", href: "/pricing" },
  { name: "Why Invictus", href: "/why-invictus" },
  { name: "Resources", href: "/resources" },
  { name: "About", href: "/about" },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-sm">IP</span>
            </div>
            <span className="font-display font-bold text-xl">Invictus Pulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex lg:items-center lg:gap-1">
            {navigation.map((item) => (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => item.children && setOpenDropdown(item.name)}
                onMouseLeave={() => setOpenDropdown(null)}
              >
                <Link
                  to={item.href}
                  className={cn(
                    "px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-1",
                    location.pathname === item.href || location.pathname.startsWith(item.href + "/")
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.name}
                  {item.children && <ChevronDown className="h-3 w-3" />}
                </Link>

                {/* Dropdown */}
                <AnimatePresence>
                  {item.children && openDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1 w-48 rounded-xl bg-card border border-border shadow-elevated p-2"
                    >
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-3 py-2 text-sm rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex lg:items-center lg:gap-3">
            <Button variant="ghost" asChild>
              <Link to="/login">Log in</Link>
            </Button>
            <Button variant="hero" asChild>
              <Link to="/signup">Start Free</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-border bg-background"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map((item) => (
                <div key={item.name}>
                  <Link
                    to={item.href}
                    className="block px-4 py-3 text-base font-medium rounded-lg hover:bg-secondary transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                  {item.children && (
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className="block px-4 py-2 text-sm text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 flex flex-col gap-2">
                <Button variant="ghost" asChild className="w-full">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>Log in</Link>
                </Button>
                <Button variant="hero" asChild className="w-full">
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}>Start Free</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

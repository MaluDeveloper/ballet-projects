import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, MessageCircle } from "lucide-react";

const WHATSAPP_URL = "https://www.whatsapp.com/";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Nossa História", href: "/nossa-historia" },
  { label: "Blog", href: "/blog" },
  { label: "Aulas", href: "/aulas" },
  { label: "Galeria", href: "/galeria" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [location.pathname]);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    setOpen(false);

    if (href.startsWith("/")) {
      e.preventDefault();
      navigate(href);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-xl shadow-lg border-b border-border/30"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between h-16 sm:h-[72px] px-4 lg:px-8 py-4">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate("/");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="font-serif text-xl font-semibold tracking-wide transition-colors duration-300 cursor-pointer"
          style={{ color: scrolled ? "hsl(var(--primary))" : "hsl(var(--primary-foreground))" }}
        >
          Ballet Academy <span className="font-light italic">Lumière Étoile</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className={`text-sm font-medium transition-all duration-300 tracking-wide hover:opacity-100 ${
                scrolled
                  ? "text-muted-foreground hover:text-primary"
                  : "text-primary-foreground/80 hover:text-primary-foreground"
              }`}
            >
              {link.label}
            </a>
          ))}
          <Button
            variant={!scrolled ? "hero" : "enroll"}
            size="sm"
            className="shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
            onClick={() => window.open(WHATSAPP_URL, "_blank")}
          >
            <MessageCircle size={14} className="mr-1.5" />
            Fale Conosco
          </Button>
        </div>

        {/* Mobile toggle */}
        <button
          className={`md:hidden transition-colors duration-300 ${scrolled ? "text-foreground" : "text-primary-foreground"}`}
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-4 space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleNavClick(e, link.href)}
              className="block text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
            >
              {link.label}
            </a>
          ))}
          <Button
            variant={!scrolled ? "hero" : "enroll"}
            size="sm"
            className="w-full"
            onClick={() => window.open(WHATSAPP_URL, "_blank")}
          >
            <MessageCircle size={14} className="mr-1.5" />
            Fale Conosco
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

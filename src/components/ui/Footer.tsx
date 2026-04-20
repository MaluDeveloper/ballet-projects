import { MapPin, Phone, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contato" className="bg-primary text-primary-foreground py-20">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-left">
          {/* Brand */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">
              Ballet Academy <span className="font-light italic">Lumière Étoile</span>
            </h4>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Formando bailarinas com arte, disciplina e<br />elegância há mais de 20 anos.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Contato</h4>
            <div className="space-y-3 text-sm text-primary-foreground/70">
              <p className="flex items-start gap-2">
                <MapPin size={15} className="mt-0.5 flex-shrink-0 text-primary-foreground/40" />
                Rua das Artes, 123 – Centro, São Paulo – SP
              </p>
              <p className="flex items-center gap-2">
                <Phone size={15} className="flex-shrink-0 text-primary-foreground/40" />
                (11) 99999-0000
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Links Rápidos</h4>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              {[
                { label: "Home", href: "/" },
                { label: "Blog", href: "/blog" },
                { label: "Nossa História", href: "/nossa-historia" },
                { label: "Aulas", href: "/aulas" },
                { label: "Galeria", href: "/galeria" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block hover:text-primary-foreground transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Termos e Políticas */}
          <div>
            <h4 className="font-serif text-lg font-semibold mb-4">Termos e Políticas</h4>
            <div className="space-y-2 text-sm text-primary-foreground/60">
              {[
                { label: "Política de Privacidade", href: "/politica-de-privacidade" },
                { label: "Termos de Uso", href: "/termos-de-uso" },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={link.href}
                  className="block hover:text-primary-foreground transition-all duration-300"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-16 pt-8 text-center">
          <p className="text-xs text-primary-foreground/40 tracking-wide mb-5">
            © 2026 Ballet Academy Lumière Étoile. Todos os direitos reservados.
          </p>
          <div className="flex justify-center gap-4">
            {[
              { icon: Instagram, label: "Instagram", href: "https://www.instagram.com" },
              { icon: Facebook, label: "Facebook", href: "https://www.facebook.com" },
              { icon: Youtube, label: "YouTube", href: "https://www.youtube.com" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full border border-primary-foreground/15 flex items-center justify-center text-primary-foreground/50 hover:text-primary-foreground hover:border-primary-foreground/40 hover:bg-primary-foreground/5 transition-all duration-300"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

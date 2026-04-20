import { MapPin, Phone, Mail, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer id="contato" className="relative overflow-hidden">
      {/* Main footer */}
      <div className="bg-primary text-primary-foreground">
        {/* Decorative top border */}
        <div className="h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" />

        <div className="max-w-6xl mx-auto px-6 lg:px-8 pt-16 pb-12">
          {/* Top: Brand centered */}
          <div className="text-center mb-14">
            <h3 className="font-serif text-2xl md:text-3xl font-semibold tracking-wide mb-3">
              Ballet Academy <span className="font-light italic">Lumière Étoile</span>
            </h3>
            <p className="text-primary-foreground/50 text-sm max-w-md mx-auto leading-relaxed">
              Formando bailarinas com excelência em arte, {" "}
              <br className="hidden sm:block" />
              disciplina e elegância há mais de 48 anos.
            </p>
          </div>

          {/* Divider */}
          <div className="h-px bg-primary-foreground/10 mb-12" />

          {/* Three columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16 text-center">
            {/* Links Rápidos */}
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70 mb-5">
                Navegação
              </h4>
              <nav className="space-y-2.5">
                {[
                  { label: "Home", href: "/" },
                  { label: "Nossa História", href: "/nossa-historia" },
                  { label: "Blog", href: "/blog" },
                  { label: "Aulas", href: "/aulas" },
                  { label: "Galeria", href: "/galeria" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>

            {/* Contato */}
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70 mb-5">
                Contato
              </h4>
              <div className="space-y-3 text-sm text-primary-foreground/50">
                <p className="flex items-start justify-center gap-1.5">
                  <MapPin size={14} className="flex-shrink-0 text-primary-foreground/35 mt-0.5" />
                  <span>Rua das Artes, 123 – Centro, <br />São Paulo – SP</span>
                </p>
                <a
                  href="tel:+5511999990000"
                  className="flex items-center justify-center gap-1.5 hover:text-primary-foreground transition-colors duration-300"
                >
                  <Phone size={14} className="flex-shrink-0 text-primary-foreground/35" />
                  <span>(11) 99999-0000</span>
                </a>
                <a
                  href="mailto:contato@balletstudio.com"
                  className="flex items-center justify-center gap-1.5 hover:text-primary-foreground transition-colors duration-300 break-all"
                >
                  <Mail size={14} className="flex-shrink-0 text-primary-foreground/35" />
                  <span>contato@balletacademy.com</span>
                </a>
              </div>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-serif text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/70 mb-5">
                Legal
              </h4>
              <nav className="space-y-2.5">
                {[
                  { label: "Política de Privacidade", href: "/politica-de-privacidade" },
                  { label: "Termos de Uso", href: "/termos-de-uso" },
                ].map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block text-sm text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-primary-foreground/8">
          <div className="max-w-6xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-primary-foreground/35 tracking-wide">
              © 2026 Ballet Academy Lumière Étoile. Todos os direitos reservados.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/" },
                { icon: Facebook, label: "Facebook", href: "https://www.facebook.com/" },
                { icon: Youtube, label: "YouTube", href: "https://www.youtube.com" },
              ].map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full border border-primary-foreground/10 flex items-center justify-center text-primary-foreground/40 hover:text-primary-foreground hover:border-primary-foreground/30 hover:bg-primary-foreground/5 transition-all duration-300"
                  aria-label={label}
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

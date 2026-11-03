import { Link } from "react-router-dom";
import { GraduationCap, Twitter, Linkedin, Github } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-white/8 bg-ink-900/60">
    <div className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Link to="/" className="flex items-center gap-2 text-paper-50">
            <GraduationCap size={20} className="text-gold-400" />
            <span className="font-display text-lg">Cursus</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper-400">
            Des parcours construits par des praticiens, pour apprendre des competences qui servent vraiment.
          </p>
          <div className="mt-6 flex gap-3">
            {[Twitter, Linkedin, Github].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-paper-400 transition-colors hover:border-white/20 hover:text-paper-50"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-medium text-paper-50">Plateforme</p>
          <ul className="space-y-3 text-sm text-paper-400">
            <li><Link to="/cours" className="hover:text-paper-50">Catalogue de cours</Link></li>
            <li><Link to="/inscription" className="hover:text-paper-50">Creer un compte</Link></li>
            <li><Link to="/dashboard" className="hover:text-paper-50">Tableau de bord</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-4 text-sm font-medium text-paper-50">Ressources</p>
          <ul className="space-y-3 text-sm text-paper-400">
            <li><a href="#fonctionnement" className="hover:text-paper-50">Fonctionnement</a></li>
            <li><a href="#temoignages" className="hover:text-paper-50">Temoignages</a></li>
            <li><a href="#" className="hover:text-paper-50">Contact</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-12 flex flex-col gap-4 border-t border-white/8 pt-8 text-xs text-paper-400 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Cursus. Projet pedagogique — donnees de demonstration.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-paper-50">Confidentialite</a>
          <a href="#" className="hover:text-paper-50">Conditions</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

import { Link } from "react-router-dom";
import { Compass } from "lucide-react";
import Button from "../components/Button";

const NotFound = () => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-ink-950 px-6 text-center">
    <Compass size={40} className="text-paper-400" />
    <h1 className="font-display text-3xl text-paper-50">Page introuvable</h1>
    <p className="max-w-sm text-paper-400">Cette page n'existe pas ou a ete deplacee.</p>
    <Button as={Link} to="/">Retour a l'accueil</Button>
  </div>
);

export default NotFound;

import { Component } from "react";

// Empêche l'écran blanc : si une page plante, l'erreur s'affiche au lieu de tout vider.
class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Erreur d'affichage :", error, info?.componentStack);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950 p-6 text-paper-50">
        <div className="max-w-xl rounded-xl2 border border-red-400/30 bg-ink-800 p-6">
          <h1 className="font-display text-xl">Une erreur est survenue</h1>
          <p className="mt-2 text-sm text-paper-400">
            Rechargez la page. Si le problème continue, voici le message à transmettre :
          </p>
          <pre className="mt-4 overflow-x-auto rounded-lg bg-ink-950 p-4 text-xs text-red-300">
            {String(this.state.error?.message || this.state.error)}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full bg-gold-400 px-5 py-2 text-sm font-medium text-ink-950"
          >
            Recharger
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;

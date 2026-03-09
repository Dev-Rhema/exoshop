import { Component } from "react";
import { Link } from "react-router-dom";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="min-h-screen bg-white flex items-center justify-center px-6">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 mx-auto mb-6 bg-red-500/10 border border-red-500/30 flex items-center justify-center">
              <span className="text-red-400 text-3xl">!</span>
            </div>
            <h1 className="font-display text-4xl text-dark tracking-wide mb-4">
              SOMETHING WENT WRONG
            </h1>
            <p className="font-body text-sm text-mist leading-relaxed mb-8">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            <Link
              to="/"
              onClick={() => this.setState({ hasError: false })}
              className="inline-flex items-center gap-2 bg-[#4a9eff] text-dark font-mono text-xs font-semibold tracking-widest uppercase px-6 py-3 hover:bg-dark hover:text-white transition-colors"
            >
              ← Back to Store
            </Link>
          </div>
        </main>
      );
    }

    return this.props.children;
  }
}

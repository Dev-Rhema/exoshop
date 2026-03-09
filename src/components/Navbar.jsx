import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-ink/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-2xl">
          {/* <img src="/productImgs/exodigital-logo.png" alt="Exodigital Logo" /> */}
          EXODIGITAL
        </Link>

        {/* Right side */}
        {/* <div className="flex items-center gap-6">
          <span className="hidden sm:block font-mono text-xs text-mist uppercase tracking-widest">
            Digital Products
          </span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4a9eff] animate-pulse-[#4a9eff]"></span>
            <span className="font-mono text-xs text-[#4a9eff]">LIVE</span>
          </div>
        </div> */}
      </div>
    </nav>
  );
}

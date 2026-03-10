import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-dark/10 bg-white/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="font-bold text-2xl text-dark">
          {/* <img src="/productImgs/exodigital-logo.png" alt="Exodigital Logo" /> */}
          EXODIGITAL.
        </Link>
      </div>
    </nav>
  );
}

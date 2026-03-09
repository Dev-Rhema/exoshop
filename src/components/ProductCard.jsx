import { useState } from "react";
import { initiatePaystackCheckout } from "../utils/paystack";
import { useNavigate } from "react-router-dom";

const TAG_COLORS = {
  EBOOK: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  COURSE: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  ASSETS: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  CODE: "bg-green-500/20 text-green-300 border-green-500/30",
  DESIGN: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  CONSULTATION: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

const BADGE_COLORS = {
  BESTSELLER: "bg-primary text-ink",
  NEW: "bg-blue-400 text-ink",
  HOT: "bg-red-400 text-white",
};

export default function ProductCard({ product }) {
  const [loading, setLoading] = useState(false);
  const [emailPrompt, setEmailPrompt] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleBuyClick = (e) => {
    e.stopPropagation();
    navigate(`/product/${product.id}`);
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleCheckout = () => {
    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setEmailPrompt(false);
    setLoading(true);

    initiatePaystackCheckout({
      product,
      email,
      onSuccess: (reference) => {
        setLoading(false);
        navigate(`/success?reference=${reference}`);
      },
      onClose: () => {
        setLoading(false);
      },
    });
  };

  const tagColor =
    TAG_COLORS[product.tag] || "bg-white/10 text-white/70 border-white/20";
  const badgeColor = BADGE_COLORS[product.badge];

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-smoke border border-white/10 hover:border-primary/50 transition-all duration-300 flex flex-col overflow-hidden cursor-pointer"
    >
      {/* Top accent bar */}
      <div className="h-px w-0 group-hover:w-full bg-primary transition-all duration-500 absolute top-0 left-0 z-10" />

      {/* Badge */}
      {product.badge && (
        <div
          className={`absolute top-4 right-4 z-10 px-2 py-0.5 text-xs font-mono font-semibold tracking-widest ${badgeColor}`}
        >
          {product.badge}
        </div>
      )}

      {/* Product Image */}
      {product.image && (
        <div className="w-full h-48 overflow-hidden bg-ink">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      {/* Card body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Tag */}
        <div className="flex items-center gap-2 mb-4">
          <span className={`text-xs font-mono px-2 py-0.5 border ${tagColor}`}>
            {product.tag}
          </span>
        </div>

        {/* Title */}
        <h2 className="font-display text-3xl text-white tracking-wide leading-none mb-3 group-hover:text-primary transition-colors duration-300">
          {product.title.toUpperCase()}
        </h2>

        {/* Price + Buy */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="font-mono text-xs text-mist">NGN</span>
            <span className="font-display text-4xl text-primary ml-1">
              {product.price.toLocaleString()}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center gap-2 px-5 py-2.5 border border-primary/30">
              <svg
                className="w-4 h-4 animate-spin text-primary"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              <span className="font-mono text-xs text-primary">LOADING</span>
            </div>
          ) : (
            <button
              onClick={handleBuyClick}
              className="bg-primary text-ink font-mono text-xs font-semibold tracking-widest uppercase px-5 py-2.5 hover:bg-white transition-colors duration-200 active:scale-95"
            >
              BUY NOW →
            </button>
          )}
        </div>
      </div>

      {/* Email modal overlay */}
      {emailPrompt && (
        <div className="absolute inset-0 bg-ink/95 backdrop-blur-sm flex flex-col justify-center p-6 animate-fade-in z-20">
          <p className="font-mono text-xs text-mist uppercase tracking-widest mb-1">
            Buying
          </p>
          <h3 className="font-display text-2xl text-white mb-4">
            {product.title.toUpperCase()}
          </h3>
          <p className="font-body text-sm text-mist mb-4">
            Enter your email to receive payment confirmation.
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheckout()}
            placeholder="your@email.com"
            className="bg-smoke border border-white/20 focus:border-primary outline-none px-4 py-3 font-mono text-sm text-white placeholder:text-mist/50 mb-2 transition-colors"
          />
          {emailError && (
            <p className="font-mono text-xs text-red-400 mb-3">{emailError}</p>
          )}

          <div className="flex gap-3 mt-2">
            <button
              onClick={handleCheckout}
              className="flex-1 bg-primary text-ink font-mono text-xs font-semibold uppercase tracking-widest py-3 hover:bg-white transition-colors"
            >
              PROCEED →
            </button>
            <button
              onClick={() => {
                setEmailPrompt(false);
                setEmail("");
                setEmailError("");
              }}
              className="px-4 py-3 border border-white/20 font-mono text-xs text-mist hover:text-white hover:border-white/50 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

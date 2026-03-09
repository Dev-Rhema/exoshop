import { useParams, useNavigate } from "react-router-dom";
import products from "../data/products";
import { useState } from "react";
import { initiatePaystackCheckout } from "../utils/paystack";

const TAG_COLORS = {
  EBOOK: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  COURSE: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  ASSETS: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  CODE: "bg-green-500/20 text-green-300 border-green-500/30",
  DESIGN: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  CONSULTATION: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find((p) => p.id === id);

  const [loading, setLoading] = useState(false);
  const [emailPrompt, setEmailPrompt] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-ink pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-white mb-4">
            Product Not Found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="font-mono text-[#4a9eff] hover:text-white transition-colors"
          >
            ← Back to Shop
          </button>
        </div>
      </main>
    );
  }

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePhone = (val) =>
    /^[0-9+()\\s-]{10,}$/.test(val.replace(/\s/g, ""));

  const handleCheckout = () => {
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setEmailPrompt(false);
    setLoading(true);

    // Store checkout data in localStorage for Success page
    localStorage.setItem(
      "checkoutData",
      JSON.stringify({
        name,
        phone,
        email,
      }),
    );

    initiatePaystackCheckout({
      product,
      name,
      phone,
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

  const isLongDescription =
    product.description && product.description.length > 500;

  const renderDescription = (description) => {
    // Split by paragraphs first (double newlines)
    const paragraphs = description.split("\n\n");

    // If long description and not expanded, truncate
    let displayParagraphs = paragraphs;
    if (isLongDescription && !showFullDescription) {
      let charCount = 0;
      displayParagraphs = [];
      for (let para of paragraphs) {
        if (charCount + para.length > 300) {
          break;
        }
        displayParagraphs.push(para);
        charCount += para.length;
      }
    }

    return displayParagraphs.map((paragraph, idx) => {
      // Check if this paragraph contains bullet points
      if (paragraph.includes("•")) {
        const lines = paragraph.split("\n").filter((line) => line.trim());
        const bullets = lines.filter((line) => line.includes("•"));

        return (
          <ul key={idx} className="list-disc list-inside mb-6 ml-2 space-y-2">
            {bullets.map((bullet, bulletIdx) => (
              <li key={bulletIdx} className="text-mist">
                {bullet.replace("•", "").trim()}
              </li>
            ))}
          </ul>
        );
      }
      // Regular paragraph
      return (
        <p
          key={idx}
          className="font-body text-base text-mist leading-relaxed mb-4"
        >
          {paragraph}
        </p>
      );
    });
  };

  return (
    <main className="min-h-screen bg-ink pt-16">
      {/* Header with back button */}
      <div className="border-b border-white/10">
        <div className="max-w-4xl mx-auto  py-6">
          <button
            onClick={() => navigate("/")}
            className="font-mono text-xs text-[#4a9eff] hover:text-white transition-colors mb-6"
          >
            ← BACK TO SHOP
          </button>
        </div>
      </div>

      {/* Product detail */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 mb-12">
          {/* Left: Image/Visual */}
          <div className="flex items-center justify-center">
            <div className="w-full h-96 bg-smoke border border-white/10 relative overflow-hidden group rounded-lg">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <>
                  {/* Decorative elements fallback */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 mx-auto mb-4 bg-[#4a9eff]/10 border border-[#4a9eff]/20 flex items-center justify-center rounded">
                        <span className="font-display text-5xl text-[#4a9eff]">
                          {product.tag.charAt(0)}
                        </span>
                      </div>
                      <p className="font-mono text-xs text-mist uppercase tracking-widest">
                        {product.tag.replace(/_/g, " ")}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#4a9eff] to-transparent opacity-50 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col justify-center">
            {/* Badge and tag */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className={`text-xs font-mono px-2 py-0.5 border ${tagColor}`}
              >
                {product.tag}
              </span>
              {product.badge && (
                <span className="text-xs font-mono px-2 py-0.5 bg-[#4a9eff] text-ink">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl lg:text-4xl text-white leading-tight tracking-wider mb-6">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-mono text-sm text-mist">NGN</span>
              <span className="font-display text-5xl text-[#4a9eff]">
                {product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="border-t border-white/10 pt-12">
          <div className="mb-8">
            <span className="inline-block text-xs font-mono px-3 py-1 bg-white/5 border border-white/10 text-mist rounded">
              DESCRIPTION
            </span>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="font-body text-base text-mist leading-relaxed">
              {renderDescription(product.description)}
            </div>
          </div>

          {/* View More/Less Button */}
          {isLongDescription && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="font-mono text-xs text-[#4a9eff] hover:text-white transition-colors mt-4 underline"
            >
              {showFullDescription ? "VIEW LESS ↑" : "VIEW MORE ↓"}
            </button>
          )}

          {/* CTA Button */}
          <div className="flex gap-4 mt-12">
            {loading ? (
              <div className="flex items-center gap-2 px-6 py-3 border border-[#4a9eff]/30">
                <svg
                  className="w-5 h-5 animate-spin text-[#4a9eff]"
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
                <span className="font-mono text-sm text-[#4a9eff]">
                  LOADING
                </span>
              </div>
            ) : (
              <button
                onClick={() => setEmailPrompt(true)}
                className="bg-[#4a9eff] text-ink font-mono font-semibold tracking-widest uppercase px-8 py-3 hover:bg-white transition-colors duration-200 active:scale-95 rounded"
              >
                Pay now →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Checkout modal overlay */}
      {emailPrompt && (
        <div className="fixed inset-0 bg-ink/95 backdrop-blur-sm flex items-center justify-center z-50 p-6 pt-24">
          <div className="bg-smoke border border-white/10 p-8 max-w-md w-full rounded animate-fade-in">
            <p className="font-mono text-xs text-mist uppercase tracking-widest mb-6">
              Complete Your Info
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="bg-ink border border-white/20 focus:border-[#4a9eff] outline-none px-4 py-3 font-mono text-sm text-white placeholder:text-mist/50 mb-3 w-full transition-colors"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="bg-ink border border-white/20 focus:border-[#4a9eff] outline-none px-4 py-3 font-mono text-sm text-white placeholder:text-mist/50 mb-3 w-full transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-ink border border-white/20 focus:border-[#4a9eff] outline-none px-4 py-3 font-mono text-sm text-white placeholder:text-mist/50 mb-3 w-full transition-colors"
              onKeyDown={(e) => e.key === "Enter" && handleCheckout()}
            />
            {error && (
              <p className="text-xs text-red-400 font-mono mb-4">{error}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEmailPrompt(false);
                  setError("");
                }}
                className="flex-1 bg-smoke border border-white/20 text-white font-mono text-xs font-semibold uppercase tracking-widest py-3 hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-[#4a9eff] text-ink font-mono text-xs font-semibold uppercase tracking-widest py-3 hover:bg-white transition-colors"
              >
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

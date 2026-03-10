import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import products from "../data/products";

const STATUS = {
  LOADING: "loading",
  SUCCESS: "success",
  ERROR: "error",
};

const API_URL = import.meta.env.VITE_API_URL || "";

export default function Success() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState(STATUS.LOADING);
  const [product, setProduct] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [transactionData, setTransactionData] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!reference) {
      setErrorMsg("No payment reference found in URL.");
      setStatus(STATUS.ERROR);
      return;
    }

    // Get customer data from localStorage
    const customerData = JSON.parse(
      localStorage.getItem("checkoutData") || "{}",
    );

    // Extract product ID from reference (format: DIGI_{product_id}_{timestamp})
    const productId = reference.split("_").slice(1, -1).join("_");
    const foundProduct = products.find((p) => p.id === productId);

    if (!foundProduct) {
      setErrorMsg("Product could not be identified. Please contact support.");
      setStatus(STATUS.ERROR);
      return;
    }

    // Verify payment via backend
    const verifyPayment = async () => {
      try {
        const response = await fetch(`${API_URL}/api/verify-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reference,
            product: productId,
            name: customerData.name || "Customer",
            phone: customerData.phone || "",
            email: customerData.email || "",
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Verification failed");
        }

        setTransactionData(data);
        setProduct(foundProduct);
        setStatus(STATUS.SUCCESS);

        // Clear checkout data
        localStorage.removeItem("checkoutData");
      } catch (err) {
        console.error("Verification error:", err);
        setErrorMsg(
          err.message || "Could not verify payment. Please try again.",
        );
        setStatus(STATUS.ERROR);
      }
    };

    verifyPayment();
  }, [reference]);

  const handleDownload = async (e, fileUrl) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);

    try {
      const response = await fetch(fileUrl);
      if (!response.ok) throw new Error("Network response was not ok");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileUrl.split("/").pop() || "download";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      window.open(fileUrl, "_blank"); // Fallback
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white pt-16 flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        {/* Loading state */}
        {status === STATUS.LOADING && (
          <div className="animate-fade-in text-center">
            <div className="inline-flex flex-col items-center gap-6">
              <div className="relative w-16 h-16">
                <div className="absolute inset-0 border-2 border-[#4a9eff]/20 rounded-full" />
                <div className="absolute inset-0 border-2 border-transparent border-t-[#4a9eff] rounded-full animate-spin" />
              </div>
              <div>
                <p className="font-display text-2xl text-dark tracking-widest mb-2">
                  VERIFYING PAYMENT
                </p>
                <p className="font-mono text-xs text-mist">
                  Talking to Paystack servers...
                </p>
              </div>
              {reference && (
                <div className="bg-ash border border-dark/10 px-4 py-2">
                  <p className="font-mono text-xs text-mist">
                    REF: <span className="text-dark/70">{reference}</span>
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error state */}
        {status === STATUS.ERROR && (
          <div className="animate-slide-up">
            <div className="border border-red-500/30 bg-red-500/5 p-8 mb-6">
              <div className="flex items-start gap-4">
                <div className="text-red-400 text-2xl mt-0.5">✕</div>
                <div>
                  <h2 className="font-display text-3xl text-dark tracking-wide mb-3">
                    VERIFICATION FAILED
                  </h2>
                  <p className="font-body text-sm text-mist leading-relaxed mb-4">
                    {errorMsg}
                  </p>
                  {reference && (
                    <div className="bg-ash border border-dark/10 px-4 py-2 mb-4">
                      <p className="font-mono text-xs text-mist break-all">
                        Your reference:{" "}
                        <span className="text-dark">{reference}</span>
                      </p>
                    </div>
                  )}
                  <p className="font-mono text-xs text-mist">
                    Note: In test mode, Paystack verification requires a
                    server-side secret key. The demo fallback parser has been
                    used.
                  </p>
                </div>
              </div>
            </div>
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-[#4a9eff] hover:text-dark transition-colors"
            >
              ← Back to store
            </Link>
          </div>
        )}

        {/* Success state */}
        {status === STATUS.SUCCESS && product && (
          <div className="animate-slide-up">
            {/* Success header */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-[#4a9eff] flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <span className="font-mono text-xs text-[#4a9eff] uppercase tracking-widest">
                  Payment Confirmed
                </span>
              </div>
              <h1 className="font-display text-[clamp(3rem,8vw,6rem)] text-dark leading-none tracking-wide">
                YOU'RE
                <br />
                <span className="text-[#4a9eff]">ALL SET.</span>
              </h1>
            </div>

            {/* Product card */}
            <div className="bg-ash border border-[#4a9eff]/30 p-6 mb-6 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-px bg-[#4a9eff]" />
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-mono text-xs text-mist mb-1">
                    You purchased
                  </p>
                  <h2 className="font-display text-2xl text-dark tracking-wide">
                    {product.title.toUpperCase()}
                  </h2>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-mono text-xs text-mist">Amount paid</p>
                  <p className="font-display text-2xl text-[#4a9eff]">
                    ₦{product.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <p className="font-body text-sm text-mist mb-2">
                {product.description}
              </p>
            </div>

            {/* Download or Link button */}
            {product.type === "download" ? (
              <a
                href={product.file}
                download
                onClick={(e) => handleDownload(e, product.file)}
                className={`group flex items-center justify-between w-full bg-[#4a9eff] text-dark px-6 py-5 transition-colors duration-200 mb-6 ${isDownloading ? "opacity-80 cursor-wait" : "hover:bg-dark hover:text-white"}`}
              >
                <div>
                  <p className="font-display text-2xl tracking-widest">
                    {isDownloading ? "DOWNLOADING..." : "DOWNLOAD NOW"}
                  </p>
                  <p className="font-mono text-xs opacity-60 truncate max-w-xs">
                    {product.file.split("/").pop()}
                  </p>
                </div>
                <svg
                  className="w-8 h-8 group-hover:translate-y-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
              </a>
            ) : (
              <a
                href={product.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between w-full bg-[#4a9eff] text-dark px-6 py-5 hover:bg-dark hover:text-white transition-colors duration-200 mb-6"
              >
                <div>
                  <p className="font-display text-2xl tracking-widest">
                    ACCESS NOW
                  </p>
                  <p className="font-mono text-xs opacity-60 truncate max-w-xs">
                    {product.link.split("/").pop() || "Open Link"}
                  </p>
                </div>
                <svg
                  className="w-8 h-8 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </a>
            )}

            {/* Reference */}
            {reference && (
              <div className="bg-ash border border-dark/10 px-4 py-3 mb-6">
                <p className="font-mono text-xs text-mist">
                  Transaction reference:{" "}
                  <span className="text-dark/70 break-all">{reference}</span>
                </p>
              </div>
            )}

            {/* Notice */}
            <div className="bg-[#4a9eff]/5 border border-[#4a9eff]/20 px-4 py-3 mb-8">
              <p className="font-mono text-xs text-[#4a9eff]/80 leading-relaxed">
                ⚡ Save this page or copy your reference in case you need to
                re-access your download.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-mist hover:text-[#4a9eff] transition-colors"
            >
              ← Back to store
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

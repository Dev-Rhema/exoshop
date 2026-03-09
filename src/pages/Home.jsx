import ProductCard from "../components/ProductCard";
import products from "../data/products";

export default function Home() {
  return (
    <main className="min-h-screen bg-ink pt-16">
      {/* Hero */}
      <section className="relative border-b border-dark/10 overflow-hidden">
        {/* Noise texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 py-24 relative">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="h-px w-12 bg-[#4a9eff]" />
                <span className="font-mono text-xs text-[#4a9eff] uppercase tracking-widest">
                  Profitable Ads For Businesses
                </span>
              </div>
              <h1 className="font-display text-[clamp(4rem,12vw,9rem)] text-dark leading-none tracking-wider">
                LEARN ADS.
                <br />
                <span className="text-[#4a9eff]">RUN CAMPAIGNS.</span>
                <br />
                MAKE SALES.
              </h1>
            </div>

            <div className="lg:max-w-xs">
              <p className="font-body text-mist text-base leading-relaxed mb-6">
                Proven digital advertising courses, templates, and strategy
                sessions to help Nigerian business owners scale through
                profitable ads.
              </p>
              {/* <div className="flex items-center gap-6">
                <div>
                  <p className="font-display text-3xl text-[#4a9eff]">
                    {products.length}
                  </p>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest">
                    Resources
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="font-display text-3xl text-white">🔥</p>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest">
                    Proven
                  </p>
                </div>
                <div className="w-px h-10 bg-white/10" />
                <div>
                  <p className="font-display text-3xl text-white">₦</p>
                  <p className="font-mono text-xs text-mist uppercase tracking-widest">
                    Nigerian Only
                  </p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </section>

      {/* Products grid */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <h2 className="font-display text-xl text-dark tracking-widest uppercase">
              All Products
            </h2>
            <span className="font-mono text-xs text-mist bg-smoke border border-dark/10 px-2 py-0.5">
              {products.length} items
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-mono text-xs text-mist">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4a9eff]" />
            Stop wasting money on ads that don't convert
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-dark/5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark/10 mt-8">
        <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-display text-base tracking-wider text-dark">
              EXODIGITAL
            </span>
          </div>
          <p className="font-mono text-xs text-mist">
            Payments secured by Paystack · © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </main>
  );
}

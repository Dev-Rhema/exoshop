import { useParams, useNavigate } from "react-router-dom";
import products from "../data/products";
import { useState, useEffect } from "react";
import { initiatePaystackCheckout } from "../utils/paystack";
import {
  trackViewContent,
  trackAddToCart,
  trackInitiateCheckout,
  trackPurchase,
} from "../utils/pixelTracking";

const TAG_COLORS = {
  EBOOK: "bg-blue-50 text-blue-700 border-blue-200",
  COURSE: "bg-purple-50 text-purple-700 border-purple-200",
  ASSETS: "bg-orange-50 text-orange-700 border-orange-200",
  CODE: "bg-green-50 text-green-700 border-green-200",
  DESIGN: "bg-pink-50 text-pink-700 border-pink-200",
  CONSULTATION: "bg-yellow-50 text-yellow-700 border-yellow-200",
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
      <main className="min-h-screen bg-white pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl text-dark mb-4">
            Product Not Found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="font-mono text-[#4a9eff] hover:text-dark transition-colors"
          >
            ← Back to Shop
          </button>
        </div>
      </main>
    );
  }

  // Track product view on page load
  useEffect(() => {
    if (product) {
      trackViewContent(product.id, product.title, product.price);
    }
  }, [product?.id]);


  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePhone = (val) =>
    /^[0-9+()\\s-]{10,}$/.test(val.replace(/\s/g, ""));

  const handlePayNowClick = () => {
    setEmailPrompt(true);
    // Track AddToCart when "Pay now" is clicked
    trackAddToCart(product.id, product.title, product.price);
  };

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

    // Track InitiateCheckout when "Continue" in modal clicked
    trackInitiateCheckout(product.id, product.title, product.price);

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
        trackPurchase(product.id, product.title, product.price, reference);
        navigate(`/success?reference=${reference}`);
      },
      onClose: () => {
        setLoading(false);
      },
    });
  };

  const tagColor =
    TAG_COLORS[product.tag] || "bg-dark/5 text-black border-dark/10";

  const isLongDescription =
    product.description && product.description.length > 500;

  const renderDescription = (product) => {
    // Conditional rendering based on product ID
    switch (product.id) {
      case "THE_AD_VAULT_2.0":
        return (
          <div>
            {/* Customize THE AD VAULT description here */}
            <p className="font-body text-base text-black leading-relaxed mb-4">
              DEAR BUSINESS OWNER. <br /> You know you need to run ads. You know
              you need to post content that actually sells. But every time you
              sit down to create something, the same questions show up: <br />
              <br />
              "What kind of graphic should I make?" "What do I write on the
              image?" "What should my carousel look like?" "What do I even say
              in a reel?"
              <br />
              <br />
              So you either copy what a competitor is doing (and it flops
              because you copied the format without the strategy), or you post
              something random and hope it works.
              <br />
              <br />
              Meanwhile, businesses in your industry are running ads that look
              like they hired a whole creative team. Clean graphics. Carousels
              that people actually swipe through. Reels that get saved and
              shared.
              <br />
              <br />
              The difference? They're not guessing. They have a system.
              <br />
              <br />
              That's what The Ad Vault gives you.
            </p>

            {showFullDescription && (
              <>
                <p className="font-body text-base text-black leading-relaxed mb-4">
                  <br />
                  <br />
                  <span className="font-bold text-[18px]">
                    150 ad templates across 10 industries.
                  </span>
                  <br />
                  <br />
                  Each template gives you three things:
                  <br />
                  <br />
                  <ul className="list-inside list-disc">
                    <li>
                      A Visual Brief that tells you (or your designer) exactly
                      what to create. What to shoot, how to arrange it, what the
                      layout should look like. You can literally hand this to a
                      graphic designer and say "make this."
                    </li>

                    <li>
                      Ad Copy that's already written. Not generic filler. Actual
                      copy tailored to each industry with CTAs that drive action
                      (DM or link in bio, because that's what works in Nigeria).
                    </li>
                    <li>
                      A "When To Use" guide so you know which template fits
                      which goal. Whether you're trying to sell, get leads,
                      build trust, or launch something new.
                    </li>
                  </ul>
                  <br />
                  <span className="font-bold text-[18px]">
                    Here are the 10 industries covered:
                  </span>
                  <br />
                  <br />
                  Fashion. Interior Decor. Food & Restaurants. Tech & Gadgets.
                  Logistics. Real Estate. Coaching. Beauty & Skincare. Education
                  & Courses. Health & Fitness.
                  <br />
                  For each industry, you get:
                  <br />
                  5 Graphic templates (single image ads that stop the scroll) 5
                  Carousel templates (multi-slide ads that educate and sell) 5
                  Reel templates (short video concepts with scripts and shot
                  direction)
                  <br />
                  That's 15 templates per industry. 150 total.
                  <br />
                  <br />
                  <span className="font-bold text-[18px]">
                    Bonus: 15 Universal Hook Lines
                  </span>
                  . Opening lines you can plug into any ad in any industry to
                  grab attention in the first 2 seconds.
                  <br />
                  <br />
                  <span className="font-bold text-[18px]">
                    Bonus: Goal-Based Cheat Sheet
                  </span>
                  . A quick-reference guide that tells you exactly which
                  template to use based on your goal. Want sales? Use these
                  ones. Want leads? These ones. Want to go viral? These ones.
                  Launching something? Here's the 3-ad stack. <br />
                  <br />
                  <span className="font-bold text-[18px]">
                    Here are results from business owners that have used this
                    vault.
                  </span>
                  <br />
                  <br />
                  <img src="/productImgs/table1.jpeg" alt="" />
                  <img src="/productImgs/table2.jpeg" alt="" />
                  <img src="/productImgs/table3.jpeg" alt="" />
                  <img src="/productImgs/table4.jpeg" alt="" />
                  <img src="/productImgs/table5.jpeg" alt="" />
                  <br />
                  <br />
                  <span className="font-bold text-[18px]">
                    Who is this for?
                  </span>
                  <br />
                  <br />
                  Business owners who run their own ads and are tired of
                  guessing what to post. Social media managers who need a
                  library of proven ad formats to pull from every week.
                  Freelancers and agency owners who create ads for clients and
                  need to move fast without sacrificing quality. Marketers who
                  know copy alone doesn't cut it in Nigeria. Visuals sell. This
                  gives you the visuals.
                  <br />
                  <br />
                  <span className="font-bold text-[18px]">
                    Who is this NOT for?
                  </span>
                  <br />
                  <br />
                  People looking for a course or masterclass. This is not a
                  training. It's a done-for-you creative library. If you want to
                  learn theory, this isn't it. If you want to open a document,
                  pick a template, and start creating ads that actually convert
                  today, this is for you.
                  <br />
                  <br />
                  <span className="font-bold text-[18px]">
                    Let's talk numbers for a second.
                  </span>
                  <br />
                  <br />
                  Hiring a freelance designer to create 10 ad creatives in
                  Lagos? That's ₦50,000 minimum. And that's just the graphics.
                  No strategy. No copy. No guidance on when to use what.
                  <br />
                  <br />
                  Hiring a social media manager to plan your content for one
                  month? ₦100,000 to ₦200,000. And half the time they're
                  guessing too.
                  <br />
                  <br />
                  Paying for a single ad creative from an agency? ₦15,000 to
                  ₦30,000 per design. You'd need 5 just to test properly.
                  <br />
                  <br />
                  The Ad Vault gives you 150 templates with the strategy, copy,
                  and visual direction already done. For less than what you'd
                  pay for one single graphic from an agency.
                  <br />
                  <br />
                  <span className="font-bold text-[18px]">
                    ₦7,500. One time.
                  </span>{" "}
                  No monthly subscription. No upsells. One payment. 150
                  templates. Lifetime access.
                  <br />
                  <br />
                  <span className="font-bold text-[18px]">
                    Get The Ad Vault 2.0 now.
                  </span>
                </p>
              </>
            )}
          </div>
        );

      case "EXODIGITAL_ADVERTISING_SETUP":
        return (
          <div>
            {/* Customize EXODIGITAL description here */}
            <p className="font-body text-base text-black leading-relaxed mb-4 flex flex-col gap-2">
              <p className="font-bold text-[18px]">
                Stop Wasting Money on Ads That Don't Convert
              </p>
              <p>
                I've seen business owners throw millions at ads and get nothing
                back. Not because ads don't work. It is because the foundation
                was broken from day one. Wrong account structure. No tracking.
                No strategy. Just "boost post and hope." That's not how it
                works. This month, I'm opening up 10 spots for business owners
                who want their ad setup done properly.
              </p>
            </p>

            {showFullDescription && (
              <>
                <p className="font-body text-base text-black leading-relaxed mb-4 flex flex-col gap-2">
                  <p>
                    <br />
                    <br />
                    <p className="font-bold text-[18px]">
                      Below is a review from a business owner after our ads
                      setup
                    </p>
                    <br />
                    <div className="w-[400px] max-md:w-[300px]">
                      <img
                        src="/productImgs/ad-setup-chat.jpeg"
                        className="w-full"
                        alt=""
                      />
                    </div>
                    <br />
                    Here's what you get:
                  </p>
                  <p>
                    <span className="font-bold text-[18px]">
                      𝗣𝗮𝗿𝘁 𝟭: 𝗦𝘁𝗿𝗮𝘁𝗲𝗴𝘆 𝗖𝗼𝗻𝘀𝘂𝗹𝘁𝗮𝘁𝗶𝗼𝗻
                    </span>{" "}
                    We look at your business together. What you're selling. Who
                    you're selling to. Whether your website is ready. Whether
                    tracking is installed. What kind of ads you need to setup.
                    <br />
                    Most ad failures start with skipping this step.
                  </p>
                  <p>
                    <span className="font-bold text-[18px]">
                      𝗣𝗮𝗿𝘁 𝟮: 𝗙𝘂𝗹𝗹 𝗔𝗱 𝗦𝗲𝘁𝘂𝗽
                    </span>{" "}
                    I build your ad account structure from scratch. Campaigns.
                    Ad sets. Targeting. The framework you need to actually
                    scale, not just spend.
                  </p>
                  <p>
                    <span className="font-bold text-[18px]">
                      𝗣𝗮𝗿𝘁 𝟯: 𝗢𝗽𝘁𝗶𝗺𝗶𝘇𝗮𝘁𝗶𝗼𝗻 𝗖𝗮𝗿𝗱
                    </span>{" "}
                    A personal reference showing you exactly what to monitor,
                    when to adjust, and when to scale. So you're not guessing
                    after I'm done.
                  </p>
                  <p>
                    This is setup, not management. Once it's done, you own a
                    system that works.
                  </p>
                  <br /> <br />
                  <p className="font-bold text-[18px]">
                    Here are some successful ads from small business owners. I
                    set up for them and they went ahead to run successful
                    campaigns.
                  </p>
                  <div className="flex flex-col gap-2">
                    <img src="/productImgs/table1.jpeg" alt="" />
                    <img src="/productImgs/table2.jpeg" alt="" />
                    <img src="/productImgs/table3.jpeg" alt="" />
                    <img src="/productImgs/table4.jpeg" alt="" />
                    <img src="/productImgs/table5.jpeg" alt="" />
                  </div>
                  <p className="font-bold text-[18px]">
                    This offer is for only one channel. <br /> Total value:
                    ₦235,000 <br /> This month only: ₦150,000
                  </p>{" "}
                  <br />
                  <span className="font-bold text-[18px]">
                    Frequently Asked Questions
                  </span>
                  <div className="flex flex-col gap-2">
                    <p>
                      <span className="font-bold text-[18px]">
                        "Is this for a specific platform?"
                      </span>{" "}
                      This covers Meta (Facebook/Instagram). If you need other
                      platforms like Snapchat or Google, we can discuss.
                    </p>
                    <p>
                      <span className="font-bold text-[18px]">
                        "What if I don't have a website?"
                      </span>{" "}
                      That's exactly why we start with consultation. We'll
                      figure out what you need before setting anything up. Some
                      businesses don't need websites to run profitable ads.
                    </p>
                    <p>
                      <span className="font-bold text-[18px]">
                        "Do you manage the ads after?"
                      </span>{" "}
                      This is setup only. But after we're done, you'll have a
                      proper foundation. Whether you run it yourself or hire
                      someone, the structure will be solid.
                    </p>
                    <p>
                      <span className="font-bold text-[18px]">
                        "Why is it discounted?"
                      </span>{" "}
                      I'm building case studies and want to work with serious
                      business owners who'll actually implement. The discount is
                      for this month only.
                    </p>
                  </div>
                  <br />
                  <br />
                  <span className="font-bold text-[18px]">BOOK NOW</span>
                </p>
              </>
            )}
          </div>
        );

      case "Print_Cash_With_SnapChat_Ads":
        return (
          <div>
            {/* Customize SNAPCHAT description here */}
            <p className="font-body text-base text-black leading-relaxed mb-4 flex flex-col gap-2">
              <p className="font-bold text-[18px]">
                Snapchat Ads Masterclass for Nigerian Business Owners.
              </p>
              <p className="font-bold text-[18px]">
                THE LIVE CLASS HAS HELD. THIS IS THE REPLAY. YOU CAN ACCESS IT
                ANYTIME YOU WANT.
              </p>
              <p className="font-bold text-[18px]">
                ALL THE RESOURCES USED IN CLASS IS ATTACHED AFTER YOU GET YOUR
                COPY.
              </p>
            </p>

            {showFullDescription && (
              <>
                <p className="font-body text-base text-black leading-relaxed mb-4 flex flex-col gap-2">
                  <p>
                    <span className="font-bold">The challenge:</span> Rising ad
                    costs on Facebook, Instagram, and Google with decreasing
                    performance. TikTok ads are also very difficult to control,
                    with limited to no sales.
                  </p>
                  <p>
                    <span className="font-bold">The opportunity:</span> 20
                    million Nigerians actively use Snapchat daily, creating a
                    first-mover advantage in an untapped market with lower
                    competition and higher engagement potential.
                  </p>
                  <span className="font-bold">What You Get:</span>
                  <p>
                    This 2-hour replay masterclass shows you exactly how to run
                    profitable Snapchat ads in Nigeria. No story. No theory.
                    Just practical steps that work.
                  </p>
                  <span className="font-bold">You'll discover:</span>
                  <ul className="list-disc list-inside">
                    <li>
                      Why Snapchat users buy 5x more than Facebook users, and
                      how to reach them
                    </li>
                    <li>
                      The exact ad formats crushing it for Nigerian businesses
                      right now
                    </li>
                    <li>
                      Step-by-step campaign setup (watch me build one live)
                    </li>
                    <li>Payment workarounds for Nigerian ad accounts</li>
                  </ul>
                  <span className="font-bold">Who This Is For:</span>
                  <ul className="list-disc list-inside">
                    <li>Business owners tired of wasting money on ads</li>
                    <li>Marketers who want to beat the competition</li>
                    <li>Anyone selling to Nigerians aged 18-35</li>
                    <li>People who've failed on other platforms</li>
                  </ul>
                  <span className="font-bold">The Facts:</span>
                  <ul className="list-disc list-inside">
                    <li>95% of Snapchat users aren't on TikTok daily</li>
                    <li>47% aren't on Meta daily</li>
                    <li>They open the app 30+ times per day</li>
                    <li>This means more reach on average for your business</li>
                  </ul>
                  <span className="font-bold">What Makes This Different:</span>
                  <p>
                    This isn't another generic class. Everything is tailored
                    just for you.
                    <br />
                    I'll show you the live Ads Manager on screen. You'll see
                    exactly where to click, what to type, and how to launch your
                    first campaign before we finish.
                    <br />
                    Your competitors aren't on Snapchat yet. When they finally
                    wake up, you'll already own the platform.
                  </p>
                  <span className="font-bold">Price: ₦22,500 only.</span>
                  <p>
                    Have lifetime access to the replay to watch whenever you
                    want.
                  </p>
                  <p>
                    Stop burning money on saturated platforms. Get in early on
                    Snapchat while it's still cheap and wide open.
                  </p>
                  <p>Secure your Spot today.</p>
                </p>
              </>
            )}
          </div>
        );

      case "Top_10_States_In_Nigeria_To_Target_Rich_People":
        return (
          <div>
            {/* Customize TOP 10 STATES description here */}
            <p className="font-body text-base flex flex-col gap-2 text-black leading-relaxed mb-4">
              <p className="font-bold text-[18px]">
                Stop showing your ads to people who have no money. You are
                losing profit because you target the wrong crowd. You need to be
                where the money is.
              </p>
              <p>
                This book identifies the top areas in 10 Nigerian states where
                big spenders live and work.
              </p>
            </p>

            {showFullDescription && (
              <>
                <p className="font-body text-base flex flex-col gap-2 text-black leading-relaxed mb-4">
                  <p className="font-bold text-[18px]">
                    Stop Guessing. Start Selling.
                  </p>
                  <p>
                    Most marketers throw money at random locations. This is a
                    mistake. Use these specific spots instead:
                  </p>
                  <ul className="list-disc list-inside">
                    <li>
                      <span className="font-bold text-[18px]">Lagos:</span>{" "}
                      Reach billionaires on{" "}
                      <span className="font-bold text-[18px]">
                        Banana Island
                      </span>{" "}
                      for yacht rentals and high-end real estate.
                    </li>
                    <li>
                      <span className="font-bold text-[18px]">Abuja:</span>{" "}
                      Target ministers and CEOs in{" "}
                      <span className="font-bold text-[18px]">Maitama.</span>
                    </li>
                    <li>
                      <span className="font-bold text-[18px]">
                        Port Harcourt:
                      </span>{" "}
                      Find oil executives and expats in{" "}
                      <span className="font-bold text-[18px]">GRA.</span>
                    </li>
                    <li>
                      <span className="font-bold text-[18px]">Anambra:</span>{" "}
                      Reach millionaire traders in{" "}
                      <span className="font-bold text-[18px]">Onitsha</span> and
                      industrialists in{" "}
                      <span className="font-bold text-[18px]">Nnewi.</span>
                    </li>
                    <li>And many more</li>
                  </ul>
                  <p className="font-bold text-[18px]">Understand the Habit</p>
                  <p>
                    Knowing the place is only half the battle. Wealthy people
                    have specific habits.
                  </p>
                  <p>
                    An executive in{" "}
                    <span className="font-bold text-[18px]">Asokoro</span> is
                    awake and drinking coffee by 6 AM. A tech innovator in{" "}
                    <span className="font-bold text-[18px]">Yaba</span> stays up
                    until midnight. You must speak their language.
                  </p>
                  <p>
                    Use Instagram for the trendy Lagos elite. Use community
                    radio for business owners in{" "}
                    <span className="font-bold text-[18px]">Ekwulobia</span>.
                    Context determines your success.
                  </p>
                  <p className="font-bold text-[18px]">The Details</p>
                  <ul className="list-disc list-inside">
                    <li>
                      <span className="font-bold text-[18px]">Price: </span>{" "}
                      5,000 Naira.
                    </li>
                    <li>
                      <span className="font-bold text-[18px]">Content: </span>{" "}
                      Detailed breakdowns of neighborhoods, business districts,
                      and leisure spots.
                    </li>
                    <li>
                      <span className="font-bold text-[18px]">
                        States Covered:{" "}
                      </span>{" "}
                      Lagos, Abuja, Rivers, Oyo, Anambra, Imo, Bayelsa, Akwa
                      Ibom, Delta, and Ondo.
                    </li>
                  </ul>
                  <p>
                    Fortune favors the bold. Stop overthinking. Your next big
                    sale is waiting in one of these 10 states.
                  </p>
                  <p className="font-bold text-[18px]">
                    {" "}
                    Get your copy for 5,000 Naira now.
                  </p>
                </p>
              </>
            )}
          </div>
        );

      case "Master_Google_&_YouTube_Ads_in_Naira":
        return (
          <div>
            {/* Customize GOOGLE & YOUTUBE ADS description here */}
            <div className="font-body text-base text-black leading-relaxed mb-4">
              <p className="font-bold text-[18px] mb-4">
                Master Google & YouTube Ads in Naira
              </p>
              <p className="font-bold text-[18px] mb-4">
                No Dollar Card? No Live Class Stress? No Problem! <br />
                (Instant Access to Replay + All Resources)
              </p>
              {showFullDescription && (
                <>
                  <p className="font-bold">What You’ll Learn:</p>
                  <ul className="list-disc list-inside">
                    <li>
                      <span className="font-bold">
                        Pay for Google Ads in Naira:{" "}
                      </span>{" "}
                      Skip dollar cards and complex forex hassles!
                    </li>
                    <li>
                      <span className="font-bold">
                        Beginner-Friendly Dashboard Walkthrough:{" "}
                      </span>{" "}
                      From “What’s a campaign?” to pro-level setup.
                    </li>
                    <li>
                      <span className="font-bold">Fix Wasted Ad Spend: </span>{" "}
                      Track real conversions (not just clicks!) + avoid wrong
                      keywords.
                    </li>
                    <li>
                      <span className="font-bold">
                        YouTube Ads Demystified:{" "}
                      </span>{" "}
                      Run video campaigns even with small budgets (₦50k/day).
                    </li>
                    <li>
                      <span className="font-bold">
                        Bidding Hacks for Nigeria:{" "}
                      </span>{" "}
                      Outsmart competitors without overspending.
                    </li>
                  </ul>
                  <br />
                  <p className="font-bold">Perfect For:</p>
                  <ul className="list-disc list-inside">
                    <li>
                      Business owners tired of “abroad” strategies that don’t
                      work in Nigeria.
                    </li>
                    <li>
                      Marketers who want to run ads today but hate confusing
                      dashboards.
                    </li>
                    <li>
                      Anyone who needs flexible learning (pause, rewatch, and
                      implement!).
                    </li>
                  </ul>
                  <p className="font-bold">Why This Replay?</p>
                  <ul className="list-disc list-inside">
                    <li>
                      <span className="font-bold">No Fluff, No Theory: </span>{" "}
                      Only what works for Nigerian audiences.
                    </li>
                    <li>
                      <span className="font-bold">Learn at Your Pace: </span>{" "}
                      Watch from your phone or laptop—anytime, anywhere.
                    </li>
                    <li>
                      <span className="font-bold">₦17,500 One-Time Fee: </span>{" "}
                      Less than 2% of your future ad budget!
                    </li>
                  </ul>
                  <p className="font-bold">Modules:</p>
                  <ul className="list-disc list-inside">
                    <li>Pay Google Ads in Naira (No dollar card needed!)</li>
                    <li>Dashboard Setup for Beginners</li>
                    <li>Keyword Planning for Nigerian Searches</li>
                    <li>YouTube Ads That Convert</li>
                    <li>Track Sales, Not Just Clicks</li>
                    <li>Bidding Strategies for Small Budgets</li>
                  </ul>
                  <p className="font-bold">
                    💰 Price: ₦17,500 (One-Time Payment)
                  </p>
                  <br />
                  <p className="font-bold">What If I Get Stuck?</p>
                  <p>
                    Email support included! Send questions anytime, and we’ll
                    guide you.
                  </p>
                  <p className="font-bold">
                    Stop Guessing, Start Scaling. <br />
                    Your ₦17,500 Today = Thousands in Sales Tomorrow.
                  </p>
                  <p className="font-bold">GET ACCESS NOW →</p>
                </>
              )}
            </div>
          </div>
        );

      case "Clarity_Session_With_Ebuka":
        return (
          <div>
            {/* Customize CLARITY SESSION description here */}
            <p className="font-body text-base text-black leading-relaxed mb-4 flex flex-col gap-2">
              <p className="text-2xl font-bold">STOP LOOSING MONEY</p>
              <p className=" font-bold">
                My student made 19 million naira in 48 hours. after this session
              </p>
              <div className="w-[400px] max-md:w-[300px]">
                <img
                  src="/productImgs/clarity.jpeg"
                  className="w-full"
                  alt=""
                />
              </div>
              <p className="font-bold">
                Full refund if you do not get any value. There is no risk to
                you, only gains. <br /> Book a 1:1 Clarity Session with Ebuka
              </p>
            </p>

            {showFullDescription && (
              <>
                <p className="font-body text-base text-black leading-relaxed mb-4 flex flex-col gap-2">
                  <p>
                    Struggling to scale your business through effective
                    marketing? Get actionable insights from a growth expert who
                    has:
                  </p>
                  <ul className="list-disc list-inside">
                    <li>
                      Generated over 1M+ users for PiggyVest through strategic
                      campaigns
                    </li>
                    <li>
                      Managed £1M+ in ad spend optimization for TransferGO
                    </li>
                    <li>Achieved 500% user base growth for fintech products</li>
                    <li>
                      Driven 70% user acquisition growth across global markets
                    </li>
                    <li>
                      Worked with over 30 brands and drove insane results for
                      them.
                    </li>
                  </ul>
                  <p className="font-bold">
                    In this 1-hour power session, you'll get:
                  </p>
                  <ul className="list-disc list-inside">
                    <li>
                      A deep dive analysis of your current marketing strategy
                    </li>
                    <li>
                      Identification of quick wins and growth opportunities
                    </li>
                    <li>
                      Custom-tailored recommendations for your specific market
                    </li>
                    <li>
                      Data-driven insights to optimize your marketing spend
                    </li>
                    <li>
                      Clear, actionable steps to improve your conversion rates
                    </li>
                  </ul>
                  <p className="font-bold">Perfect for:</p>
                  <ul className="list-disc list-inside">
                    <li>Startup founders looking to scale</li>
                    <li>Marketing managers seeking fresh strategies</li>
                    <li>
                      Business owners wanting to optimize their digital presence
                    </li>
                    <li>Teams stuck in their growth journey</li>
                  </ul>
                  <p>
                    <span className="font-bold">Bonus: </span>Receive a summary
                    report of key recommendations after our session.
                  </p>
                  <p>
                    Limited slots available each week. Book now to transform
                    your marketing approach and unlock your business's growth
                    potential.
                  </p>
                </p>
              </>
            )}
          </div>
        );

      case "Sales_Conversion_Framework_Strategy_Guide":
        return (
          <div>
            {/* Customize SALES CONVERSION FRAMEWORK description here */}
            <p className="font-body text-base text-black leading-relaxed mb-4 flex flex-col gap-2">
              <p className="font-bold">
                Sales Conversion Framework & Strategy Guide By Ebuka Chidube
              </p>
              <p>
                Are you tired of people pricing your business and running away
                without paying? I have prepared battle-tested conversion
                strategies designed for three specific business segments:
              </p>
            </p>

            {showFullDescription && (
              <>
                <p className="font-body text-base text-black leading-relaxed mb-4 flex flex-col gap-2">
                  <p className="font-bold">E-commerce Business Owners</p>
                  <ul className="list-disc list-inside">
                    <li>
                      Perfect for those selling physical products like bags,
                      shoes, and apparel
                    </li>
                    <li>
                      Learn proven frameworks to convert "interested" prospects
                      into repeat buyers
                    </li>
                    <li>
                      Eliminate the "just looking" syndrome and drive actual
                      sales
                    </li>
                  </ul>
                  <p className="font-bold">Service-Based Professionals</p>
                  <ul className="list-disc list-inside">
                    <li>
                      Tailored for makeup artists, interior decorators,
                      plumbers, painters, and similar service providers
                    </li>
                    <li>Convert inquiries into booked appointments</li>
                    <li>Transform interest into immediate action</li>
                  </ul>
                  <p className="font-bold">
                    Freelancers, Creators & Marketing Pros
                  </p>
                  <ul className="list-disc list-inside">
                    <li>
                      Specifically designed for designers, editors, and
                      marketing professionals
                    </li>
                    <li>
                      Includes specialized closing frameworks for the gig
                      economy
                    </li>
                    <li>
                      Learn how to handle price negotiations and close
                      high-ticket deals.
                    </li>
                  </ul>
                  <p className="font-bold">✨ What Makes This Different:</p>
                  <ul className="list-disc list-inside">
                    <li>
                      Based on analysis of over 20 different business DMs across
                      industries
                    </li>
                    <li>Custom-tailored approaches for each business type</li>
                    <li>
                      Proven conversion strategies from real-world experience
                    </li>
                    <li>No waitlist - immediate access.</li>
                  </ul>
                  <p>
                    <span className="font-bold text-[18px]">
                      Value Proposition:
                    </span>{" "}
                    This isn't just another generic sales guide. It's a
                    comprehensive framework built from analyzing actual client
                    conversations and sales patterns, designed to help you
                    understand why sales aren't closing and how to fix it.
                  </p>
                  <p>
                    <span className="font-bold text-[18px]">Perfect For:</span>{" "}
                    Business owners who are tired of tire-kickers and want to
                    convert serious prospects into paying clients.
                  </p>
                  <p className="font-bold text-2xl">Get Your Copy Today.</p>
                </p>
              </>
            )}
          </div>
        );

      default:
        return (
          <div>
            {/* Default description for other products */}
            <p className="font-body text-base text-black leading-relaxed mb-4">
              {product.description}
            </p>
          </div>
        );
    }
  };

  return (
    <main className="min-h-screen bg-white pt-16">
      {/* Header with back button */}
      <div className="border-b border-dark/10">
        <div className="max-w-4xl mx-auto  py-6">
          <button
            onClick={() => navigate("/")}
            className="font-mono text-xs text-[#4a9eff] hover:text-dark transition-colors mb-6"
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
            <div className="w-full h-96 bg-white border border-dark/10 relative overflow-hidden group rounded-lg">
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
                      <p className="font-mono text-xs text-black uppercase tracking-widest">
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
                <span className="text-xs font-mono px-2 py-0.5 bg-[#4a9eff] text-dark">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl lg:text-4xl text-dark leading-tight tracking-wider mb-6">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-mono text-sm text-black">NGN</span>
              <span className="font-display text-5xl text-[#4a9eff]">
                {product.price.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="border-t border-dark/10 pt-12">
          <div className="mb-8">
            <span className="inline-block text-xs font-mono px-3 py-1 bg-dark/5 border border-dark/10 text-black rounded">
              DESCRIPTION
            </span>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="font-body text-base text-black leading-relaxed">
              {renderDescription(product)}
            </div>
          </div>

          {/* View More/Less Button */}
          {isLongDescription && (
            <button
              onClick={() => setShowFullDescription(!showFullDescription)}
              className="font-mono text-xs text-[#4a9eff] hover:text-dark transition-colors mt-4 underline"
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
                onClick={handlePayNowClick}
                className="bg-[#4a9eff] text-dark font-mono font-semibold tracking-widest uppercase px-8 py-3 hover:bg-dark hover:text-white transition-colors duration-200 active:scale-95 rounded"
              >
                Pay now →
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Checkout modal overlay */}
      {emailPrompt && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50 p-6 pt-24">
          <div className="bg-ash border border-dark/10 p-8 max-w-md w-full rounded animate-fade-in text-dark">
            <p className="font-mono text-xs text-black uppercase tracking-widest mb-6">
              Complete Your Info
            </p>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="bg-white border border-dark/20 focus:border-[#4a9eff] outline-none px-4 py-3 font-mono text-sm text-dark placeholder:text-black/50 mb-3 w-full transition-colors"
            />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="bg-white border border-dark/20 focus:border-[#4a9eff] outline-none px-4 py-3 font-mono text-sm text-dark placeholder:text-black/50 mb-3 w-full transition-colors"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="bg-white border border-dark/20 focus:border-[#4a9eff] outline-none px-4 py-3 font-mono text-sm text-dark placeholder:text-black/50 mb-3 w-full transition-colors"
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
                className="flex-1 bg-ash border border-dark/20 text-dark font-mono text-xs font-semibold uppercase tracking-widest py-3 hover:bg-dark/10 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-[#4a9eff] text-dark font-mono text-xs font-semibold uppercase tracking-widest py-3 hover:bg-dark hover:text-white transition-colors"
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

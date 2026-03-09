# EXODIGITAL — Digital Products Store

A modern, dark-themed digital products storefront built with **React + Vite + Tailwind CSS** and **Paystack** payment integration. Customers pay once and receive an instant download link.

---

## Tech Stack

- React 18 + Vite
- Tailwind CSS (custom brutalist dark theme)
- React Router v6
- Paystack Inline Checkout
- Google Fonts: Bebas Neue + DM Sans + JetBrains Mono

---

## Project Structure

```
/src
  /components
    Navbar.jsx          # Fixed top nav
    ProductCard.jsx     # Product grid card w/ email modal + Paystack trigger
  /pages
    Home.jsx            # Product listing page
    Success.jsx         # Post-payment verification + download page
  /data
    products.js         # Product catalog array
  /utils
    paystack.js         # Paystack helpers (checkout + verification)
  App.jsx               # Router setup
  main.jsx              # Entry point
  index.css             # Tailwind + global styles
```

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Paystack keys

Open `/src/utils/paystack.js` and replace the placeholder keys:

```js
// Public key — safe to expose in frontend
export const PAYSTACK_PUBLIC_KEY = "pk_test_YOUR_KEY_HERE";

// ⚠️ Secret key — for demo only. In production, move verification to a backend.
Authorization: `Bearer sk_test_YOUR_SECRET_KEY_HERE`
```

> **Important:** Paystack transaction verification (`/transaction/verify`) requires your **secret key**. Never expose secret keys in a production frontend. Use a serverless function (Next.js API route, Netlify Function, Supabase Edge Function, etc.) to proxy this call.

### 3. Add your product files

Place your downloadable files in the `/public/downloads/` folder:

```
/public
  /downloads
    ai-marketing-ebook.pdf
    react-animation-course.zip
    ui-motion-pack.zip
    web3-starter-kit.zip
    figma-design-system.fig
    copywriting-swipe-file.pdf
```

### 4. Run dev server

```bash
npm run dev
```

### 5. Build for production

```bash
npm run build
npm run preview
```

---

## Adding Products

Edit `/src/data/products.js`:

```js
{
  id: "unique_product_id",         // used in Paystack metadata
  title: "Product Name",
  price: 5000,                     // in NGN (Naira)
  description: "Short description",
  file: "/downloads/filename.zip", // path from /public folder
  tag: "EBOOK",                    // EBOOK | COURSE | ASSETS | CODE | DESIGN
  pages: "120 pages",              // any descriptor (pages, modules, files)
  badge: "BESTSELLER",             // BESTSELLER | NEW | HOT | null
}
```

---

## Payment Flow

1. User clicks **Buy Now** on a product card
2. Email modal appears — user enters their email
3. Paystack inline checkout opens with:
   - Amount in kobo (price × 100)
   - Customer email
   - `metadata.product` set to product ID
   - Reference format: `DIGI_{product_id}_{timestamp}`
4. On successful payment, user is redirected to `/success?reference=REF`
5. Success page calls Paystack verify endpoint
6. On confirmation, product download button is revealed
7. Fallback parser handles demo/test environments (reads product ID from reference string)

---

## Production Checklist

- [ ] Replace `pk_test_` with `pk_live_` public key
- [ ] Move secret key verification to a backend route
- [ ] Host actual downloadable files (Cloudflare R2, S3, etc.)
- [ ] Add email delivery (Resend, Mailgun) with signed download URLs
- [ ] Consider time-limited download links for security
- [ ] Add Paystack webhook for reliable payment confirmation

---

## Customization

### Colors
Edit `tailwind.config.js` → `theme.extend.colors`:
```js
primary: '#4a9eff',   // accent color
ink: '#0A0A0A',    // background
smoke: '#1A1A1A',  // card background
```

### Fonts
Replace Google Fonts import in `index.html` and update `tailwind.config.js` font families.

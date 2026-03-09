# Exoshop - Complete Setup

## Architecture

```
Frontend (Vite + React)
    ↓ (Payment initiated)
Paystack (Payment gateway)
    ↓ (Payment success → reference)
Frontend Success Page
    ↓ (Verify + send email)
Backend (Node.js + Express)
    ↓ (Uses secret key)
Paystack API (Verification)
    ↓ (Verified)
Email Service (Nodemailer)
    ↓ (Receipt + product link)
Customer Email
```

## Project Structure

```
Exoshop/
├── src/                    # Frontend React app
│   ├── pages/
│   │   ├── Home.jsx       # Product listing
│   │   ├── ProductDetail.jsx  # Single product + checkout
│   │   └── Success.jsx    # After payment (calls backend)
│   ├── utils/
│   │   └── paystack.js    # Paystack integration (public key only)
│   └── data/
│       └── products.js    # Product data
├── server/                # Backend Node.js server
│   ├── server.js          # Express app + API endpoints
│   ├── .env               # Backend secrets (NOT in Git)
│   ├── .env.example       # Template
│   ├── package.json
│   ├── README.md          # Backend docs
│   └── SETUP.md           # Quick start guide
├── .env                   # Frontend config
├── .env.example           # Frontend template
├── .gitignore             # Excludes .env files
└── package.json
```

## Setup Steps

### Backend Setup
1. `cd server`
2. `npm install`
3. Create `.env` with your keys (copy from `.env.example`)
4. `npm run dev` (runs on port 5000)

### Frontend Setup
1. `npm install` (in root)
2. Update `.env` with keys
3. `npm run dev` (runs on port 5173)

Both must be running for the full flow to work.

## Security

✅ **Frontend**
- Public key stored in environment variable
- Never committed to Git (in .gitignore)

✅ **Backend**
- Secret key stored in server .env only
- Verification happens server-side
- Email sending is authenticated

⚠️ **Important**
- Never expose `sk_` keys in frontend code
- Don't commit `.env` to Git
- Use HTTPS in production

## Payment Flow

1. User fills in name, phone, email on product page
2. Data stored in `localStorage`
3. Paystack payment modal opens (uses public key)
4. User completes payment
5. Redirected to Success page with `?reference=...`
6. Success page retrieves customer data from localStorage
7. Calls backend `/api/verify-payment` endpoint
8. Backend verifies with Paystack (uses secret key)
9. Backend sends email receipt + product link
10. Success page shows download/link button

## Environment Variables

**Frontend (`.env`)**
```
VITE_PAYSTACK_PUBLIC_KEY=pk_live_...
VITE_API_URL=http://localhost:5000     # or your backend domain
```

**Backend (`server/.env`)**
```
PAYSTACK_SECRET_KEY=sk_live_...
EMAIL_SERVICE=gmail
EMAIL_USER=your@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx     # Gmail app password
FRONTEND_URL=http://localhost:5173     # For download links in emails
PORT=5000
```

## API Endpoints

### POST `/api/verify-payment`
Verifies payment and sends email receipt.

**Request:**
```json
{
  "reference": "DIGI_..._...",
  "product": "product_id",
  "name": "Customer Name",
  "phone": "+234...",
  "email": "customer@email.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment verified and receipt sent to email",
  "transaction": {...},
  "product": {...}
}
```

## Deployment Checklist

- [ ] Backend deployed (Railway, Render, Vercel, etc.)
- [ ] Backend environment variables set
- [ ] Frontend `VITE_API_URL` points to backend domain
- [ ] Frontend `VITE_PAYSTACK_PUBLIC_KEY` correct
- [ ] Email service credentials verified
- [ ] Production Paystack keys in use
- [ ] HTTPS enabled
- [ ] `.env` files NOT in Git

## Support

- **Paystack Issues**: https://paystack.com/support
- **Email Problems**: Check nodemailer/email service provider docs
- **Backend Errors**: Check server console logs

## Next Steps

1. Follow `server/SETUP.md` for detailed backend setup
2. Test locally with both frontend and backend running
3. Deploy backend first, then update frontend domain
4. Monitor email delivery for any issues

---

For production-grade setup, consider:
- Database integration (store transactions)
- Webhook handling from Paystack
- Authentication for admin endpoints
- Rate limiting
- Proper error logging

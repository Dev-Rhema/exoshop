# Exoshop Backend

Secure backend server for handling Paystack payments, verification, and email receipts.

## Setup

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your details:

```bash
cp .env.example .env
```

Edit `.env`:
```
PAYSTACK_SECRET_KEY=sk_live_your_actual_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### 3. Email Setup (Gmail)

To use Gmail:
1. Enable 2-factor authentication on your Google account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use that password in `.env` as `EMAIL_PASSWORD`

Alternative email services: SendGrid, Resend, AWS SES

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

## API Endpoints

### POST `/api/verify-payment`

Verifies a Paystack transaction and sends email receipt.

**Request:**
```json
{
  "reference": "DIGI_product_id_timestamp",
  "product": "product_id",
  "name": "Customer Name",
  "phone": "+234...",
  "email": "customer@example.com"
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

### GET `/health`

Health check endpoint.

### GET `/api/transactions`

Get all transactions (admin only - add authentication in production).

## Security Notes

⚠️ **IMPORTANT:**
- Never commit `.env` to Git (it's in .gitignore)
- Keep `PAYSTACK_SECRET_KEY` private - only on backend
- In production, add proper authentication to admin endpoints
- Use HTTPS only
- Add rate limiting for production

## Deployment

For Vercel, Railway, or similar:
1. Set environment variables in the platform settings
2. Deploy the server folder
3. Update `FRONTEND_URL` to your production frontend domain

## Support

For issues with:
- **Paystack**: https://paystack.com/support
- **Email**: Check nodemailer docs or your email service provider

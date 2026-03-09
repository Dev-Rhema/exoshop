# Backend Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Set Up Email (Gmail)

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Copy the generated 16-character password
4. Use this password in `.env` as `EMAIL_PASSWORD`

### 3. Configure `.env`

Edit `server/.env`:
```
PAYSTACK_SECRET_KEY=your_paystack_secret_key_here
EMAIL_SERVICE=gmail
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx
FRONTEND_URL=http://localhost:5173
PORT=5000
```

### 4. Run the Backend

```bash
npm run dev
```

You should see:
```
🚀 Server running on http://localhost:5000
```

### 5. Update Frontend `.env`

The frontend `.env` should have:
```
VITE_PAYSTACK_PUBLIC_KEY=pk_live_...
VITE_API_URL=http://localhost:5000
```

### 6. Test the Flow

1. Start both frontend (`npm run dev`) and backend (`npm run dev` in server folder)
2. Go to http://localhost:5173
3. Click "Buy Now" on a product
4. Fill in name, phone, email
5. Complete a test payment on Paystack
6. Check the email for receipt + product link

## Troubleshooting

**"Cannot connect to backend"**
- Make sure backend is running on http://localhost:5000
- Check `VITE_API_URL` in frontend `.env`

**"Email not sent"**
- Verify Gmail app password is correct
- Check that 2FA is enabled on Gmail account
- Look at server console for detailed error

**"Payment verification failed"**
- Keep `PAYSTACK_SECRET_KEY` exact in server `.env`
- Make sure reference format matches: `DIGI_{productId}_{timestamp}`

## Production Deployment

For production (Vercel, Railway, Heroku, etc.):

1. **Backend**:
   - Set environment variables in your hosting platform
   - Update `FRONTEND_URL` to your production domain
   - Use production Paystack keys

2. **Frontend**:
   - Update `VITE_API_URL` to your backend domain
   - Build: `npm run build`
   - Deploy to Vercel/Netlify

3. **Email**:
   - Consider using SendGrid or Resend instead of Gmail
   - They offer better rate limits for production

## Alternative Email Services

### SendGrid
1. Create account at https://sendgrid.com
2. Get API key
3. Update `server/.env`:
```
EMAIL_SERVICE=sendgrid
SENDGRID_API_KEY=your_api_key
```

### Resend
```
EMAIL_SERVICE=resend
RESEND_API_KEY=your_api_key
```

Need help? Check the main README.md in the server folder.

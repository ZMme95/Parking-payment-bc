# Payment Portal with PayPal Integration

A modern payment portal that accepts multiple payment options (1 hour, 1 day, 1 week, 1 month) and routes all payments to your PayPal business account.

## Features

- **Multiple Pricing Tiers**: 1 Hour ($6.00), 1 Day ($27.00), 1 Week ($88.00), 1 Month ($130.00)
- **PayPal Integration**: Secure payment processing through PayPal
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Professional UI**: Modern, clean interface with smooth interactions
- **Payment Confirmation**: Success, cancel, and error pages

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure PayPal Credentials

Edit the `.env` file with your PayPal credentials:

```
PORT=3000
PAYPAL_MODE=sandbox  # Use 'live' for production
PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PAYPAL_CLIENT_SECRET=YOUR_PAYPAL_CLIENT_SECRET
PAYPAL_BUSINESS_EMAIL=your-business@example.com
```

### 3. Get PayPal Credentials

1. Go to [PayPal Developer Dashboard](https://developer.paypal.com/)
2. Sign in with your PayPal business account
3. Navigate to **Apps & Credentials**
4. Create a new app or select an existing one
5. Copy your **Client ID** and **Client Secret**
6. Update the `.env` file with these credentials

### 4. Start the Server

```bash
npm start
```

The payment portal will be available at `http://localhost:3000`

## How It Works

1. **Customer selects a pricing tier** from the homepage
2. **Customer clicks "Proceed to PayPal Checkout"**
3. **Customer is redirected to PayPal** to complete the payment
4. **After successful payment**, the customer is redirected to the success page
5. **Payment is processed** to your PayPal business account

## Pricing Tiers

| Plan | Price | Duration |
|------|-------|----------|
| 1 Hour | $6.00 | 1 hour |
| 1 Day | $27.00 | 1 day |
| 1 Week | $88.00 | 1 week |
| 1 Month | $130.00 | 1 month |

## File Structure

```
payment_portal/
├── server.js           # Express server with PayPal integration
├── package.json        # Project dependencies
├── .env               # Environment variables (PayPal credentials)
├── README.md          # This file
└── public/
    ├── index.html     # Main payment page
    ├── success.html   # Payment success page
    ├── cancel.html    # Payment cancelled page
    └── error.html     # Payment error page
```

## Security Notes

- Never commit your `.env` file to version control
- Always use HTTPS in production
- Keep your PayPal credentials secure
- Use PayPal's sandbox mode for testing before going live

## Switching to Production

To use this in production with real payments:

1. Change `PAYPAL_MODE` to `live` in `.env`
2. Use your production PayPal Client ID and Secret
3. Update the redirect URLs to use your production domain
4. Deploy to a secure server with HTTPS

## Support

For PayPal integration issues, visit [PayPal Developer Support](https://developer.paypal.com/support/)

import express from 'express';
import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';
import * as paypalCheckoutServerSDK from '@paypal/checkout-server-sdk';
import Stripe from 'stripe';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Stripe (optional if key is not provided)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

// PayPal Client Setup
function client() {
  return new paypalCheckoutServerSDK.core.PayPalHttpClient(environment());
}

function environment() {
  let clientId = process.env.PAYPAL_CLIENT_ID;
  let clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (process.env.PAYPAL_MODE === 'live') {
    return new paypalCheckoutServerSDK.core.LiveEnvironment(clientId, clientSecret);
  } else {
    return new paypalCheckoutServerSDK.core.SandboxEnvironment(clientId, clientSecret);
  }
}

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Pricing tiers (in CAD)
const pricingTiers = [
  { id: '1hr', name: '1 Hour', price: 8.50, description: 'Access for 1 hour' },
  { id: '1day', name: '1 Day', price: 36.50, description: 'Access for 1 day' },
  { id: '1week', name: '1 Week', price: 118.50, description: 'Access for 1 week' },
  { id: '1month', name: '1 Month', price: 175.00, description: 'Access for 1 month' }
];

// Store pending payments with license plate info
const pendingPayments = new Map();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create PayPal order
app.post('/api/orders', async (req, res) => {
  try {
    const { tierId, licensePlate } = req.body;
    const tier = pricingTiers.find(t => t.id === tierId);

    if (!tier) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    if (!licensePlate || licensePlate.trim().length === 0) {
      return res.status(400).json({ error: 'License plate is required' });
    }

    const request = new paypalCheckoutServerSDK.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [
        {
          reference_id: uuidv4(),
          amount: {
            currency_code: 'CAD',
            value: tier.price.toFixed(2),
            breakdown: {
              item_total: {
                currency_code: 'CAD',
                value: tier.price.toFixed(2)
              }
            }
          },
          items: [
            {
              name: `${tier.name} Parking Pass - License Plate: ${licensePlate.toUpperCase()}`,
              description: tier.description,
              sku: tier.id,
              unit_amount: {
                currency_code: 'CAD',
                value: tier.price.toFixed(2)
              },
              quantity: '1'
            }
          ],
          custom_id: licensePlate.toUpperCase()
        }
      ],
      application_context: {
        brand_name: 'Parking Payment BC',
        user_action: 'PAY_NOW',
        return_url: `${process.env.APP_URL || 'http://localhost:3000'}/success`,
        cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/payment-cancel`
      }
    });

    const response = await client().execute(request);
    
    // Store payment info
    const customPaymentId = response.result.id;
    pendingPayments.set(customPaymentId, {
      tierId,
      licensePlate: licensePlate.toUpperCase().trim(),
      tier,
      createdAt: new Date()
    });

    res.json({
      id: response.result.id,
      status: response.result.status
    });
  } catch (error) {
    console.error('PayPal Order Creation Error:', error);
    res.status(500).json({
      error: 'Failed to create payment order',
      details: error.message
    });
  }
});

// Capture PayPal order
app.post('/api/orders/:orderID/capture', async (req, res) => {
  try {
    const { orderID } = req.params;

    const request = new paypalCheckoutServerSDK.orders.OrdersCaptureRequest(orderID);
    request.requestBody({});

    const response = await client().execute(request);

    if (response.result.status === 'COMPLETED') {
      // Get stored payment info
      const pendingPayment = pendingPayments.get(orderID);
      
      if (pendingPayment) {
        const { licensePlate, tier } = pendingPayment;
        console.log(`✅ PayPal Payment successful for license plate: ${licensePlate}`);
        console.log(`   Duration: ${tier.name}`);
        console.log(`   Amount: $${tier.price.toFixed(2)} CAD`);
      }

      // Clean up pending payment
      pendingPayments.delete(orderID);

      res.json({
        status: 'COMPLETED',
        orderId: orderID
      });
    } else {
      res.status(400).json({
        error: 'Payment capture failed',
        status: response.result.status
      });
    }
  } catch (error) {
    console.error('PayPal Capture Error:', error);
    res.status(500).json({
      error: 'Failed to capture payment',
      details: error.message
    });
  }
});

// Create Stripe Payment Intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    if (!stripe) {
      return res.status(400).json({ error: 'Card payments are not configured. Please use PayPal.' });
    }

    const { tierId, licensePlate, cardName, cardEmail } = req.body;
    const tier = pricingTiers.find(t => t.id === tierId);

    if (!tier) {
      return res.status(400).json({ error: 'Invalid tier' });
    }

    if (!licensePlate || licensePlate.trim().length === 0) {
      return res.status(400).json({ error: 'License plate is required' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(tier.price * 100), // Convert to cents
      currency: 'cad',
      metadata: {
        licensePlate: licensePlate.toUpperCase().trim(),
        tierId: tier.id,
        tierName: tier.name,
        cardName: cardName,
        cardEmail: cardEmail
      },
      description: `${tier.name} Parking Pass - License Plate: ${licensePlate.toUpperCase()}`
    });

    // Store payment info
    pendingPayments.set(paymentIntent.id, {
      tierId,
      licensePlate: licensePlate.toUpperCase().trim(),
      tier,
      cardName,
      cardEmail,
      createdAt: new Date()
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe Payment Intent Error:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      details: error.message
    });
  }
});

// Handle Stripe webhook
app.post('/api/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.sendStatus(400);
  }

  // Handle the event
  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const pendingPayment = pendingPayments.get(paymentIntent.id);

    if (pendingPayment) {
      const { licensePlate, tier, cardName, cardEmail } = pendingPayment;
      console.log(`✅ Stripe Payment successful for license plate: ${licensePlate}`);
      console.log(`   Duration: ${tier.name}`);
      console.log(`   Amount: $${tier.price.toFixed(2)} CAD`);
      console.log(`   Cardholder: ${cardName}`);
      console.log(`   Email: ${cardEmail}`);
    }

    // Clean up pending payment
    pendingPayments.delete(paymentIntent.id);
  }

  res.json({ received: true });
});

app.get('/parking-session', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'parking-session.html'));
});

app.get('/success', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'success.html'));
});

app.get('/payment-cancel', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cancel.html'));
});

app.listen(PORT, () => {
  const paypalMode = process.env.PAYPAL_MODE === 'live' ? '🔴 LIVE' : '🟢 SANDBOX';
  const stripeMode = process.env.STRIPE_MODE === 'live' ? '🔴 LIVE' : '🟢 TEST';
  console.log(`\n🅿️  Parking Payment Portal BC running on http://localhost:${PORT}`);
  console.log(`📡 PayPal Mode: ${paypalMode}`);
  console.log(`💳 Stripe Mode: ${stripeMode}`);
  console.log(`🍁 Location: British Columbia, Canada`);
  console.log(`💰 Currency: Canadian Dollars (CAD)\n`);
});

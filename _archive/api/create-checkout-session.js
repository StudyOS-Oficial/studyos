const Stripe = require('stripe');

const PRICE_ID = 'price_1UQBPmPdiAyvfYF7JjEr5uLq';
const RETURN_URL = 'https://studyos-oficial.github.io/studyos/ia-facil/gracias/?session_id={CHECKOUT_SESSION_ID}';

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://studyos-oficial.github.io');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'STRIPE_SECRET_KEY no configurada en Vercel.' });
  }

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: PRICE_ID, quantity: 1 }],
      ui_mode: 'embedded',
      return_url: RETURN_URL,
    });

    return res.status(200).json({ clientSecret: session.client_secret });
  } catch (error) {
    console.error('Stripe Checkout error:', error);
    return res.status(500).json({ error: 'No se pudo crear la sesión de Checkout.' });
  }
};
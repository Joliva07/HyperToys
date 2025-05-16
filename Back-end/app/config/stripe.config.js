// config/stripe.config.js
const env = require('./env.js');
const Stripe = require('stripe');
const stripe = new Stripe(env.STRIPE_SECRET_KEY); // ← Usamos la variable del archivo
module.exports = stripe;
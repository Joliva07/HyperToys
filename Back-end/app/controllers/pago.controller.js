// /app/controllers/pago.controller.js
const stripe = require('../config/stripe.config.js');
const db = require('../config/databse.config.js');
const env = require('../config/env');
const Factura = db.Factura;
const Cliente = db.Clientes;
const facturaController = require('./factura.controller');

// Crear sesión de pago en Stripe
exports.createPaymentIntent = async (req, res) => {
  try {
    const { ID_CLIENTE, ID_PRODUCTOS, TOTAL_PAGAR } = req.body;

    // 1. Validar cliente
    const cliente = await Cliente.findByPk(ID_CLIENTE);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // 🔥 Obtener un nuevo ID_FACTURA de la secuencia
    const id_factura = await facturaController.getNextFacturaNumber();

    // 2. Crear factura en estado "pendiente"
    const nuevaFactura = await Factura.create({
      id_factura: id_factura,
      id_cliente: ID_CLIENTE,
      total_pagar: TOTAL_PAGAR,
      fecha_factura: new Date(), // Opcional si quieres guardar la fecha
      // estado_pago: 'pendiente' // Si tienes columna ESTADO_PAGO
    });

    // 3. Crear sesión de pago en Stripe
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: ID_PRODUCTOS.map(producto => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: producto.NOMBRE,
          },
          unit_amount: Math.round(producto.PRECIO * 100),
        },
        quantity: producto.CANTIDAD,
      })),
      mode: 'payment',
      success_url: `${env.FRONTEND_URL}/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.FRONTEND_URL}/carrito`,
      metadata: {
        factura_id: id_factura
      }
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('🔥 Error detallado en pago:', JSON.stringify(error, null, 2));
    res.status(500).json({ error: error.message || "Error al procesar pago" });
  }
};

// Webhook para confirmar pagos
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Manejar evento de pago exitoso
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Actualizar factura en la BD
    await Factura.update({
      ESTADO_PAGO: 'completado'
      // STRIPE_PAYMENT_ID: session.payment_intent
    }, {
      where: { ID_FACTURA: session.metadata.factura_id }
    });
  }

  res.json({ received: true });
};
const stripe = require('../config/stripe.config.js');
const db = require('../config/databse.config.js');
const env = require('../config/env');
const Cliente = db.Clientes;
const axios = require('axios'); // 👈 NUEVO

// Crear sesión de pago en Stripe
exports.createPaymentIntent = async (req, res) => {
  try {
    const { ID_CLIENTE, ID_PRODUCTOS, TOTAL_PAGAR } = req.body;
    console.log("🧪 ID_PRODUCTOS recibido:", ID_PRODUCTOS);

    const cliente = await Cliente.findByPk(ID_CLIENTE);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    const productosMinimos = ID_PRODUCTOS.map(p => ({
      id_producto: p.id_producto,
      cantidad: p.CANTIDAD
    }));

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
      success_url: `${env.FRONTEND_URL}/#/pago-exitoso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.FRONTEND_URL}/#/confirmar-compra`,
      metadata: {
        id_cliente: ID_CLIENTE,
        productos: JSON.stringify(productosMinimos),
        total_pagar: TOTAL_PAGAR,
        reservas: req.body.id_reserva ? JSON.stringify(req.body.id_reserva) : null
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
      req.body,
      sig,
      env.STRIPE_WEBHOOK_SECRET // 👈 usa env, no process.env directamente
    );
  } catch (err) {
    console.error("❌ Error verificando la firma del webhook:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log("✅ Webhook recibido: checkout.session.completed");
    console.log("📦 Metadata recibida:", session.metadata);

    try {
      const payload = {
        id_cliente: session.metadata.id_cliente,
        total_pagar: session.metadata.total_pagar,
        productos: JSON.parse(session.metadata.productos)
      };

      if (session.metadata.reservas) {
        payload.id_reserva = JSON.parse(session.metadata.reservas);
      }

      // 👇 Llama a tu propia API de backend para crear factura
      const response = await axios.post(
        'https://back-hypertoys.onrender.com/HyperToys/realizarcompra',
        payload
      );

      console.log("✅ Respuesta de la API /realizarcompra:", response.data);
    } catch (error) {
      console.error("❌ Error al llamar API /realizarcompra:", error.response?.data || error.message);
    }
  }

  res.json({ received: true });
};

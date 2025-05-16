const stripe = require('../config/stripe.config.js');
const db = require('../config/databse.config.js');
const env = require('../config/env');
const Factura = db.Factura;
const DetalleFactura = db.DetalleFactura;
const facturaController = require('./factura.controller');
const Cliente = db.Clientes;

// Crear sesión de pago en Stripe
exports.createPaymentIntent = async (req, res) => {
  try {
    const { ID_CLIENTE, ID_PRODUCTOS, TOTAL_PAGAR } = req.body;

    const cliente = await Cliente.findByPk(ID_CLIENTE);
    if (!cliente) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

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
        id_cliente: ID_CLIENTE,
        productos: JSON.stringify(ID_PRODUCTOS),
        total_pagar: TOTAL_PAGAR
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

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const t = await db.sequelize.transaction();

    try {
      const id_cliente = session.metadata.id_cliente;
      const productos = JSON.parse(session.metadata.productos);
      const total_pagar = session.metadata.total_pagar;

      const id_factura = await facturaController.getNextFacturaNumber();

      // Crear Factura
      const nuevaFactura = await Factura.create({
        id_factura: id_factura,
        id_cliente: id_cliente,
        total_pagar: total_pagar,
        fecha_factura: new Date()
      }, { transaction: t });

      // Crear Detalles de Factura
      let idDetalleIncremental = 1;
      for (const producto of productos) {
        await DetalleFactura.create({
          id_detalle_factura: idDetalleIncremental++,
          id_factura: id_factura,
          id_producto: producto.id_producto,
          cantidad: producto.CANTIDAD
        }, { transaction: t });
      }

      await t.commit();
      console.log(`✅ Factura ${id_factura} creada exitosamente con detalles después de pago.`);

    } catch (error) {
      await t.rollback();
      console.error('Error creando Factura después del pago:', error);
    }
  }

  res.json({ received: true });
};

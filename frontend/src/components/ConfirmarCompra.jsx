import React, { useContext, useState } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../context/Carrito.css';

const ConfirmarCompra = () => {
  const { carrito, setCarrito, eliminarProducto, clienteId: rawClienteId } = useContext(CarritoContext);
  const navigate = useNavigate();
  const clienteId = parseInt(rawClienteId, 10);
  const [idReservaInput, setIdReservaInput] = useState('');
  const [reservasVerificadas, setReservasVerificadas] = useState([]);
  const [reservaError, setReservaError] = useState('');
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [reservaVerificadaBloquea, setReservaVerificadaBloquea] = useState(false);

  const aumentarCantidad = (id) => {
    const actualizado = carrito.map(p =>
      p.ID_PRODUCTO === id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
    setCarrito(actualizado);
  };

  const disminuirCantidad = (id) => {
    const actualizado = carrito.map(p =>
      p.ID_PRODUCTO === id && p.cantidad > 1 ? { ...p, cantidad: p.cantidad - 1 } : p
    );
    setCarrito(actualizado);
  };

  const eliminarReserva = (id) => {
    setReservasVerificadas(reservasVerificadas.filter(r => r.id_reserva !== id));
  };

  const totalProductos = carrito.reduce((acc, p) => acc + p.PRECIO * p.cantidad, 0);
  const totalReserva = reservasVerificadas.reduce((acc, r) => acc + r.total_reserva, 0);
  const totalPagar = totalProductos + totalReserva;

  const hayProductoInvalido = carrito.some(
    (p) => p.STOCK === 0 || p.DISPONIBILIDAD === 'Por llegar'
  );

  const handleConfirmar = async () => {
    if (!carrito.length && reservasVerificadas.length === 0) {
      alert("No hay productos ni reservas para procesar.");
      return;
    }

    const carritoValido = carrito.length === 0 || carrito.every(p => p.NOMBRE && p.PRECIO && p.cantidad > 0);
    if (!carritoValido) {
      alert("Tu carrito contiene productos inválidos.");
      return;
    }

    try {
      const productosFormateados = carrito.map(p => ({
        id_producto: p.ID_PRODUCTO,
        NOMBRE: p.NOMBRE,
        PRECIO: p.PRECIO,
        CANTIDAD: p.cantidad
      }));

      const reservasFormateadas = reservasVerificadas.map(r => ({
        id_producto: `reserva-${r.id_reserva}`,
        NOMBRE: `Reserva #${r.id_reserva}`,
        PRECIO: r.total_reserva,
        CANTIDAD: 1
      }));

      const todosLosItems = [...productosFormateados, ...reservasFormateadas];

      const payload = {
        ID_CLIENTE: clienteId,
        ID_PRODUCTOS: todosLosItems,
        TOTAL_PAGAR: totalPagar,
        id_reserva: reservasVerificadas.length > 0 ? reservasVerificadas.map(r => r.id_reserva) : null
      };

      console.log("📦 Payload enviado a /pagar:", JSON.stringify(payload, null, 2));

      const response = await axios.post('https://back-hypertoys.onrender.com/HyperToys/pagar', payload);
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('Error procesando la compra.');
    }
  };

  const handleReserva = async () => {
    if (!carrito.length) {
      alert("Tu carrito está vacío.");
      return;
    }

    if (!fechaSeleccionada) {
      alert("Por favor selecciona una fecha de reserva.");
      return;
    }

    try {
      const productosFormateados = carrito.map(p => ({
        id_producto: p.ID_PRODUCTO,
        cantidad: p.cantidad
      }));

      const totalReserva = carrito.reduce((acc, p) => acc + p.PRECIO * p.cantidad, 0);

      await axios.post('https://back-hypertoys.onrender.com/HyperToys/reservas', {
        id_cliente: clienteId,
        productos: productosFormateados,
        fechaReserva: new Date(fechaSeleccionada).toISOString(),
        total_reserva: totalReserva
      });

      alert('Reserva realizada con éxito');
      setCarrito([]);
      setFechaSeleccionada('');
    } catch (error) {
      console.error('Error al realizar la reserva:', error);
      alert('Hubo un error al hacer la reserva.');
    }
  };

  const verificarReserva = async () => {
    setReservaError('');

    if (!idReservaInput.trim()) return;

    try {
      const response = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/reserva/${idReservaInput}/cliente/${clienteId}`);
      const nuevaReserva = response.data.reserva;

      const yaExiste = reservasVerificadas.some(r => r.id_reserva === nuevaReserva.id_reserva);
      if (yaExiste) {
        setReservaError('Esa reserva ya fue agregada.');
        return;
      }

      setReservasVerificadas([...reservasVerificadas, nuevaReserva]);
      setIdReservaInput('');
      setReservaVerificadaBloquea(true);
    } catch (error) {
      console.error('Error al verificar reserva:', error);
      setReservaError('No se encontró la reserva.');
    }
  };

  return (
    <section className="h-100 gradient-custom">
      <div className="container py-5">
        <div className="row d-flex justify-content-center my-4">
          <div className="col-md-8">
            <div className="card mb-4 bg-dark text-white">
              <div className="card-header py-3">
                <h5 className="mb-0">Carrito de compras</h5>
              </div>
              <div className="card-body">
                {carrito.map(producto => (
                  <div className="row mb-3" key={producto.ID_PRODUCTO}>
                    <div className="col-lg-8">
                      <p className="mb-0"><strong>{producto.NOMBRE}</strong></p>
                      <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                        <button className="btn btn-danger btn-sm me-1 mb-2" onClick={() => eliminarProducto(producto.ID_PRODUCTO)} style={{display: 'inline-flex',alignItems: 'center',gap: '5px'}}>
                          <FontAwesomeIcon icon="trash-alt" /> Eliminar
                        </button>
                      </div>
                      <p className="text-muted">Precio: Q{producto.PRECIO} x {producto.cantidad}</p>
                    </div>
                    <div className="col-lg-4 d-flex justify-content-end align-items-center">
                      <button className="btn btn-outline-light btn-sm" onClick={() => disminuirCantidad(producto.ID_PRODUCTO)}>-</button>
                      <span className="mx-2">{producto.cantidad}</span>
                      <button className="btn btn-outline-light btn-sm" onClick={() => aumentarCantidad(producto.ID_PRODUCTO)}>+</button>
                    </div>
                  </div>
                ))}

                {reservasVerificadas.length > 0 && <hr className="text-white" />}

                {reservasVerificadas.map(reserva => (
                  <div className="row mb-3" key={`reserva-${reserva.id_reserva}`}>
                    <div className="col-lg-8">
                      <p className="mb-0"><strong>Reserva #{reserva.id_reserva}</strong></p>
                      <p className="text-muted">Total: Q{reserva.total_reserva.toFixed(2)}</p>
                    </div>
                    <div className="col-lg-4 d-flex justify-content-end align-items-center">
                      <button className="btn btn-danger btn-sm" onClick={() => eliminarReserva(reserva.id_reserva)}>Eliminar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-4 bg-dark text-white">
              <div className="card-body">
                <p><strong>Envío estimado:</strong></p>
                <p className="mb-0">En las próximas 48 horas</p>
              </div>
            </div>

            <div className="card mb-4 bg-dark text-white">
              <div className="card-body">
                <p><strong>Aceptamos</strong></p>
                <img className="me-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/visa.svg" alt="Visa" />
                <img className="me-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/amex.svg" alt="American Express" />
                <img className="me-2" width="45px" src="https://mdbcdn.b-cdn.net/wp-content/plugins/woocommerce-gateway-stripe/assets/images/mastercard.svg" alt="Mastercard" />
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card mb-4 bg-dark text-white">
              <div className="card-header py-3">
                <h5 className="mb-0">Resumen</h5>
              </div>
              <div className="card-body">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item resumen-item d-flex justify-content-between align-items-center px-0 bg-dark text-white">
                    Productos + Reservas
                    <span>Q{totalPagar.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item resumen-item d-flex justify-content-between align-items-center px-0 bg-dark text-white">
                    Envío
                    <span>Gratis</span>
                  </li>
                  <li className="list-group-item resumen-item d-flex justify-content-between align-items-center px-0 bg-dark text-white">
                    <strong>Total</strong>
                    <strong>Q{totalPagar.toFixed(2)}</strong>
                  </li>
                </ul>
                <label className="form-label mt-3">Fecha deseada para la reserva:</label>
                <input
                  type="date"
                  className="form-control mb-2"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                />
                <button className="btn btn-success w-100 mt-3" onClick={handleConfirmar} disabled={hayProductoInvalido}>
                  Confirmar y Pagar
                </button>
                {hayProductoInvalido && (
                  <p className="text-warning mt-2">
                    No puedes confirmar la compra porque hay productos con stock agotado o en estado "Por llegar".
                  </p>
                )}
                <button className="btn btn-secondary w-100 mt-2" onClick={handleReserva} disabled={reservaVerificadaBloquea}>Reservar</button>
              </div>
            </div>

            <div className="card mb-4 bg-dark text-white">
              <div className="card-header py-3">
                <label htmlFor="reservaId" className="form-label">Agregar ID de Reserva Existente:</label>
                <input
                  type="text"
                  className="form-control"
                  id="reservaId"
                  value={idReservaInput}
                  onChange={(e) => setIdReservaInput(e.target.value)}
                />
                <button className="btn btn-info mt-2" onClick={verificarReserva}>Verificar Reserva</button>
                {reservaError && <p className="text-danger mt-2">{reservaError}</p>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmarCompra;

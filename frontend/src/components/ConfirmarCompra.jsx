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
  const [reservaVerificada, setReservaVerificada] = useState(null);
  const [reservaError, setReservaError] = useState('');

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

  const totalProductos = carrito.reduce((acc, p) => acc + p.PRECIO * p.cantidad, 0);
  const totalReserva = reservaVerificada ? reservaVerificada.total_reserva : 0;
  const totalPagar = totalProductos + totalReserva;

  const handleConfirmar = async () => {
    if (!carrito.length && !reservaVerificada) {
      alert("No hay productos ni reserva para procesar.");
      return;
    }

    const carritoValido = carrito.every(p => p.NOMBRE && p.PRECIO && p.cantidad > 0);
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

      const payload = {
        ID_CLIENTE: clienteId,
        ID_PRODUCTOS: productosFormateados,
        TOTAL_PAGAR: totalPagar
      };

      if (reservaVerificada) {
        payload.ID_RESERVA = reservaVerificada.id_reserva;
      }

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

    if (reservaVerificada) return;

    try {
      const productosFormateados = carrito.map(p => ({
        id_producto: p.ID_PRODUCTO,
        cantidad: p.cantidad
      }));

      const fechaReserva = new Date();
      const totalReserva = carrito.reduce((acc, p) => acc + p.PRECIO * p.cantidad, 0);

      await axios.post('https://back-hypertoys.onrender.com/HyperToys/reservas', {
        id_cliente: clienteId,
        productos: productosFormateados,
        fechaReserva: fechaReserva.toISOString(),
        total_reserva: totalReserva
      });

      alert('Reserva realizada con éxito');
      setCarrito([]);
    } catch (error) {
      console.error('Error al realizar la reserva:', error);
      alert('Hubo un error al hacer la reserva.');
    }
  };

  const verificarReserva = async () => {
    setReservaError('');
    try {
      const response = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/reserva/${idReservaInput}/cliente/${clienteId}`);
      setReservaVerificada(response.data.reserva);
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
            <div className="card mb-4 bg-dark">
              <div className="card-header py-3">
                <h5 className="mb-0">Carrito - {carrito.length} productos</h5>
              </div>
              <div className="card-body">
                {carrito.map((p, i) => (
                  <div className="row" key={i}>
                    <div className="col-lg-3 col-md-12 mb-4 mb-lg-0">
                      <img src={p.IMAGEN || "https://via.placeholder.com/150"} className="w-100 rounded" alt={p.NOMBRE} />
                    </div>
                    <div className="col-lg-5 col-md-6 mb-4 mb-lg-0">
                      <p><strong>{p.NOMBRE}</strong></p>
                      <button 
                      className="btn btn-danger btn-sm me-1 mb-2" onClick={() => eliminarProducto(p.ID_PRODUCTO)} style={{display: 'inline-flex',alignItems: 'center',gap: '5px'}}>
                      <FontAwesomeIcon icon="trash-alt" /> Eliminar
                    </button>
                    </div>
                    <div className="col-lg-4 col-md-6 mb-4 mb-lg-0">
                      <div className="d-flex mb-4" style={{ maxWidth: '300px' }}>
                        <button className="btn btn-primary px-3 me-2" onClick={() => disminuirCantidad(p.ID_PRODUCTO)}>
                          <i className="fas fa-minus">-</i>
                        </button>
                        <input type="number" value={p.cantidad} min="1" className="form-control text-center" readOnly />
                        <button className="btn btn-primary px-3 ms-2" onClick={() => aumentarCantidad(p.ID_PRODUCTO)}>
                          <i className="fas fa-plus">+</i>
                        </button>
                      </div>
                      <p className="text-start text-md-center">
                        <strong>${(p.PRECIO * p.cantidad).toFixed(2)}</strong>
                      </p>
                    </div>
                    <hr className="my-4" />
                  </div>
                ))}
              </div>
            </div>

            <div className="card mb-4 bg-dark">
              <div className="card-body">
                <p><strong>Envío estimado:</strong></p>
                <p className="mb-0">En las próximas 48 horas</p>
              </div>
            </div>
            <div className="card mb-4 bg-dark">
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
                  <li className="list-group-item resumen-item d-flex justify-content-between align-items-center px-0">
                    Productos
                    <span>${totalPagar.toFixed(2)}</span>
                  </li>
                  <li className="list-group-item resumen-item d-flex justify-content-between align-items-center px-0">
                    Envío
                    <span>Gratis</span>
                  </li>
                  <li className="list-group-item resumen-item d-flex justify-content-between align-items-center px-0">
                    <div>
                      <strong>Total</strong>
                    </div>
                    <span><strong>${totalPagar.toFixed(2)}</strong></span>
                  </li>
                </ul>
                <button className="summary-btn" onClick={handleConfirmar}>
                  Confirmar y Pagar
                </button>
                <button className="summary-btn2 mt-2" onClick={handleReserva}>
                  Reservar
                </button>
              </div>            
            </div>
            <div className="card mb-4 bg-dark">
            <label htmlFor="reservaId" className="form-label">Agregar ID de Reserva Existente:</label>
            <input
              type="text"
              className="form-control"
              id="reservaId"
              value={idReservaInput}
              onChange={(e) => setIdReservaInput(e.target.value)}
            />
            <button className="btn btn-info mt-2" onClick={verificarReserva}>
              Verificar Reserva
            </button>
            {reservaError && <p className="text-danger mt-2">{reservaError}</p>}
            {reservaVerificada && (
              <p className="text-success mt-2">
                Reserva válida encontrada. Total ${reservaVerificada.total_reserva.toFixed(2)}
              </p>
            )}
          </div> 
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfirmarCompra;

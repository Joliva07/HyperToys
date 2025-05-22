import React, { useContext, useState } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import axios from 'axios';

const ConfirmarCompra = () => {
  const { carrito, setCarrito, eliminarProducto, clienteId: rawClienteId } = useContext(CarritoContext);
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
    <div className="container mt-5">
      <h2>Confirmar Compra</h2>

      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <>
          <ul className="list-group mb-3">
            {carrito.map((p, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  {p.NOMBRE} x{p.cantidad}
                  <div className="mt-2 d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => disminuirCantidad(p.ID_PRODUCTO)}>-</button>
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => aumentarCantidad(p.ID_PRODUCTO)}>+</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => eliminarProducto(p.ID_PRODUCTO)}>🗑️ Eliminar</button>
                  </div>
                </div>
                <span>${(p.PRECIO * p.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="mb-3">
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

          <h4>Total: ${totalPagar.toFixed(2)}</h4>
          <button className="btn btn-success" onClick={handleConfirmar}>
            Confirmar y Pagar
          </button>
          <button
            className="btn btn-warning ms-2"
            onClick={handleReserva}
            disabled={!!reservaVerificada}
          >
            Solo Reservar
          </button>
        </>
      )}
    </div>
  );
};

export default ConfirmarCompra;

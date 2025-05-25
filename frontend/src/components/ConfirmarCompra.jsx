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
  const totalReserva = reservasVerificadas.reduce((acc, r) => acc + r.total_reserva, 0);
  const totalPagar = totalProductos + totalReserva;

  const handleConfirmar = async () => {
    if (!carrito.length && reservasVerificadas.length === 0) {
      alert("No hay productos ni reservas para procesar.");
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
        id_reserva: reservasVerificadas.map(r => r.id_reserva)
      };

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
    } catch (error) {
      console.error('Error al verificar reserva:', error);
      setReservaError('No se encontró la reserva.');
    }
  };

  return (
    <section className="h-100 gradient-custom">
      <div className="container py-5">
        <div className="row d-flex justify-content-center my-4">
          {/* ... resto sin cambios ... */}
        </div>
      </div>
    </section>
  );
};

export default ConfirmarCompra;
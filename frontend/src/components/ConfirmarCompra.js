import React, { useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import axios from 'axios';

const ConfirmarCompra = () => {
  const { carrito, clienteId, vaciarCarrito } = useContext(CarritoContext);

  const totalPagar = carrito.reduce((acc, p) => acc + p.PRECIO * p.cantidad, 0);

  const handleConfirmar = async () => {
    try {
      const productosFormateados = carrito.map(p => ({
        NOMBRE: p.NOMBRE,
        PRECIO: p.PRECIO,
        CANTIDAD: p.cantidad
      }));

      const response = await axios.post('http://localhost:4000/HyperToys/pagos/create', {
        ID_CLIENTE: clienteId,
        ID_PRODUCTOS: productosFormateados,
        TOTAL_PAGAR: totalPagar
      });

      // Vaciar carrito opcionalmente (puede hacerse después del webhook también)
      vaciarCarrito();

      // Redirigir a Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('No se pudo procesar la compra.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Confirmar Compra</h2>
      {carrito.length === 0 ? (
        <p>No hay productos en el carrito.</p>
      ) : (
        <div>
          <ul className="list-group mb-3">
            {carrito.map((p, idx) => (
              <li key={idx} className="list-group-item d-flex justify-content-between">
                {p.NOMBRE} x{p.cantidad}
                <span>Q{(p.PRECIO * p.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <h4>Total: Q{totalPagar.toFixed(2)}</h4>
          <button className="btn btn-success" onClick={handleConfirmar}>
            Confirmar y Pagar
          </button>
        </div>
      )}
    </div>
  );
};

export default ConfirmarCompra;

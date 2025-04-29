import React, { useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import axios from 'axios';

const ConfirmarCompra = () => {
  const { carrito, setCarrito, eliminarProducto, clienteId } = useContext(CarritoContext);

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

  const totalPagar = carrito.reduce((acc, p) => acc + p.PRECIO * p.cantidad, 0);

  const handleConfirmar = async () => {
    if (!carrito.length) {
      alert("Tu carrito está vacío. Por favor agrega productos.");
      return;
    }

    const carritoValido = carrito.every(p => p.NOMBRE && p.PRECIO && p.cantidad > 0);

    if (!carritoValido) {
      alert("Tu carrito contiene productos inválidos. Por favor actualízalo.");
      return;
    }

    try {
      const productosFormateados = carrito.map(p => ({
        NOMBRE: p.NOMBRE,
        PRECIO: p.PRECIO,
        CANTIDAD: p.cantidad
      }));

      const totalPagar = carrito.reduce((acc, p) => acc + p.PRECIO * p.cantidad, 0);

      const response = await axios.post('http://localhost:4000/HyperToys/pagar', {
        ID_CLIENTE: clienteId,
        ID_PRODUCTOS: productosFormateados,
        TOTAL_PAGAR: totalPagar
      });

      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error al procesar la compra:', error);
      alert('Error procesando la compra.');
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
                <span>Q{(p.PRECIO * p.cantidad).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <h4>Total: Q{totalPagar.toFixed(2)}</h4>
          <button className="btn btn-success" onClick={handleConfirmar}>
            Confirmar y Pagar
          </button>
        </>
      )}
    </div>
  );
};

export default ConfirmarCompra;

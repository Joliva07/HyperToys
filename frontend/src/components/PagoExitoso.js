import React, { useEffect, useContext } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CarritoContext } from '../context/CarritoContext';

const PagoExitoso = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const sessionId = query.get('session_id');

  const { vaciarCarrito } = useContext(CarritoContext);

  useEffect(() => {
    // Solo una vez cuando se monta el componente
    vaciarCarrito();
  }, []); // 👈 Sin sessionId aquí

  return (
    <div className="container mt-5 text-center">
      <h2>🎉 ¡Gracias por tu compra! 🧾</h2>
      {sessionId ? (
        <p>Tu pedido ha sido procesado exitosamente. En breve podrás ver tu factura en tu perfil.</p>
      ) : (
        <p>No se encontró la sesión de pago.</p>
      )}
      <Link to="/catalogo" className="btn btn-primary mt-3">
        Volver al catálogo
      </Link>
    </div>
  );
};

export default PagoExitoso;

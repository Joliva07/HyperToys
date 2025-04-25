import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CarritoContext } from '../context/CarritoContext'; // importamos el contexto

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { clienteId } = useContext(CarritoContext); // usamos el clienteId

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get('http://localhost:4000/HyperToys/productos/all');
        setProductos(res.data.productos);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      } finally {
        setLoading(false);
      }
    };

    obtenerProductos();
  }, []);

  const handleComprarAhora = async (producto) => {
    try {
      const response = await axios.post('http://localhost:4000/HyperToys/pagar', {
        ID_CLIENTE: clienteId,
        ID_PRODUCTOS: [{
          NOMBRE: producto.NOMBRE,
          PRECIO: producto.PRECIO,
          CANTIDAD: 1
        }],
        TOTAL_PAGAR: producto.PRECIO
      });

      // Redireccionar a Stripe Checkout
      window.location.href = response.data.url;
    } catch (error) {
      console.error('Error al crear la sesión de pago:', error);
      alert('Hubo un error al intentar procesar el pago.');
    }
  };

  if (loading) return <div className="text-center mt-5">Cargando productos...</div>;

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Catálogo de Productos</h2>
      <div className="row">
        {productos.map(producto => (
          <div className="col-md-4 mb-4" key={producto.ID_PRODUCTO}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{producto.NOMBRE}</h5>
                <p className="card-text">{producto.DESCRIPCION}</p>
                <p><strong>Precio:</strong> Q{producto.PRECIO}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => handleComprarAhora(producto)}
                >
                  Comprar Ahora
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;

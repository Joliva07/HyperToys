import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CarritoContext } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const { agregarProducto, cerrarSesion } = useContext(CarritoContext);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProductos = async () => {
      try {
        const res = await axios.get('http://localhost:4000/HyperToys/productos/all');
        setProductos(res.data.productos);
      } catch (error) {
        console.error('Error al obtener productos:', error);
      }
    };

    obtenerProductos();
  }, []);

  const handleCantidadChange = (id, valor) => {
    setCantidades({ ...cantidades, [id]: parseInt(valor) });
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  const handleAgregarAlCarrito = (producto) => {
    const cantidad = cantidades[producto.ID_PRODUCTO] || 1;
    agregarProducto({ ...producto, cantidad });
    alert("¡Producto(s) agregado(s) correctamente!");
    // Ya NO redirigimos al carrito aquí
  };

  const irAlCarrito = () => {
    navigate('/confirmar-compra');
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Catálogo de Productos</h2>
        <button className="btn btn-warning" onClick={irAlCarrito}>
          🛒 Ver Carrito
        </button>
        <button className="btn btn-info" onClick={() => navigate('/perfil')}>
          👤 Mi Perfil
        </button>
        <button className="btn btn-danger" onClick={handleCerrarSesion}>
          🚪 Cerrar Sesión
        </button>
      </div>
      
      <div className="row">
        {productos.map(producto => (
          <div className="col-md-4 mb-4" key={producto.ID_PRODUCTO}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{producto.NOMBRE}</h5>
                <p className="card-text">{producto.DESCRIPCION}</p>
                <p><strong>Precio:</strong> Q{producto.PRECIO}</p>
                <label>Cantidad:</label>
                <input
                  type="number"
                  min="1"
                  className="form-control mb-2"
                  value={cantidades[producto.ID_PRODUCTO] || 1}
                  onChange={(e) => handleCantidadChange(producto.ID_PRODUCTO, e.target.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => handleAgregarAlCarrito(producto)}
                >
                  Agregar al Carrito
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

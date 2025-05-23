import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CarritoContext } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import Banner from './Banner'
import '../context/Catalogo.css';

const Catalogo = () => {
  const [pagina, setPagina] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const { agregarProducto, cerrarSesion } = useContext(CarritoContext);
  const navigate = useNavigate();

  useEffect(() => {
  const obtenerProductos = async () => {
    try {
      const res = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/productos/all?page=${pagina}`);
      setProductos(res.data.productos);
      setTotalPaginas(res.data.pages);
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  obtenerProductos();
}, [pagina]);

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
      <header className="catalogo-header sticky-top">
          <h1 className="titulo-principal">
            <span className="texto-hyper">Cáta</span>
            <span className="texto-toys">logo</span>
          </h1>
      </header>
      <Banner />
      <div className="row">
        {productos.map(producto => (
          <div className="col-md-4 mb-4" key={producto.ID_PRODUCTO}>
            <div className="card h-100">
              {producto.IMAGEN && (
                <img
                  src={`data:image/jpeg;base64,${producto.IMAGEN}`}
                  alt={producto.NOMBRE}
                  className="card-img-top"
                  style={{ cursor: 'pointer', maxHeight: '200px', objectFit: 'contain' }}
                  onClick={() => navigate(`/producto/${producto.ID_PRODUCTO}`)}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5
                  className="card-title text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/producto/${producto.ID_PRODUCTO}`)}
                >
                  {producto.NOMBRE}
                </h5>
                <p className="card-text">{producto.DESCRIPCION}</p>
                <p><strong>Precio:</strong> ${producto.PRECIO}</p>
                <p><strong>Disponibilidad:</strong> {producto.DISPONIBILIDAD}</p>
                <p><strong>Stock disponible:</strong> {producto.STOCK}</p>
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
                  disabled={producto.STOCK === 0 || ['Agotado', 'Descontinuado'].includes(producto.DISPONIBILIDAD)}
                >
                  Agregar al Carrito
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center mt-4">
        {[...Array(totalPaginas)].map((_, i) => (
          <button
            key={i}
            className={`btn mx-1 ${pagina === i + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setPagina(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;

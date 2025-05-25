import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { CarritoContext } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import Banner from './Banner'
import '../context/Catalogo.css';
import promo2 from '../Images/banners/promo2.jpg';
import promo1 from '../Images/banners/promo1.jpg';
import Categorias from './Categorias';


const Catalogo = () => {
  const [pagina, setPagina] = useState(1);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [totalPaginas, setTotalPaginas] = useState(1);
  const [productos, setProductos] = useState([]);
  const [cantidades, setCantidades] = useState({});
  const { agregarProducto, cerrarSesion, clienteId } = useContext(CarritoContext);
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

  useEffect(() => {
  if (productoSeleccionado) {
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
}, [productoSeleccionado]);


  const handleCantidadChange = (id, valor) => {
    setCantidades({ ...cantidades, [id]: parseInt(valor) });
  };

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

  const handleAgregarAlCarrito = (producto) => {
  if (!clienteId) {
    alert("Debes iniciar sesión para agregar productos al carrito.");
    navigate('/login');
    return;
  }

  const cantidad = cantidades[producto.ID_PRODUCTO] || 1;
  agregarProducto({ ...producto, cantidad });
  alert("¡Producto(s) agregado(s) correctamente!");
};

  const irAlCarrito = () => {
    navigate('/confirmar-compra');
  };

  return (
    <div className="container mt-5">
      <div className="row mb-4">
  {/* Banner principal grande */}
        <div className="col-md-8">
          <Banner />
        </div>

        {/* Banners pequeños a la derecha */}
        <div className="col-md-4 d-flex flex-column gap-3">
          <div className="card shadow-sm overflow-hidden banner" onClick={() => navigate(`/categoria/4`)}>
            <img src={promo1} alt="Promo 1" className="img-fluid banner-lateral" />
          </div>
          <div className="card shadow-sm overflow-hidden banner" onClick={() => navigate(`/categoria/1`)}>
            <img src={promo2} alt="Promo 2" className="img-fluid banner-lateral"/>
          </div>
        </div>
      </div>
      <div className="container">
      <Categorias />
      </div>
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
                 onClick={() => setProductoSeleccionado(producto)}
                />
              )}
              <div className="card-body d-flex flex-column">
                <h5
                  className="card-title text-primary"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setProductoSeleccionado(producto)}
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

        {/* Modal de producto */}
        {productoSeleccionado && (
              <div
                className="modal fade show"
                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                tabIndex="-1"
                role="dialog"
              >
                <div className="modal-dialog modal-lg" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">{productoSeleccionado.NOMBRE}</h5>
                      <button
                        type="button"
                        className="btn-close"
                        onClick={() => setProductoSeleccionado(null)}
                      ></button>
                    </div>
                    <div className="modal-body text-center">
                      {productoSeleccionado.IMAGEN && (
                        <img
                          src={`data:image/jpeg;base64,${productoSeleccionado.IMAGEN}`}
                          alt={productoSeleccionado.NOMBRE}
                          className="img-fluid mb-3"
                          style={{ maxHeight: '300px', objectFit: 'contain' }}
                        />
                      )}
                      <p><strong>Descripción:</strong> {productoSeleccionado.DESCRIPCION}</p>
                      <p><strong>Precio:</strong> ${productoSeleccionado.PRECIO}</p>
                      <p><strong>Disponibilidad:</strong> {productoSeleccionado.DISPONIBILIDAD}</p>
                      <p><strong>Stock:</strong> {productoSeleccionado.STOCK}</p>
                      <div className="form-group w-25 mx-auto">
                        <label>Cantidad:</label>
                        <input
                          type="number"
                          min="1"
                          className="form-control"
                          value={cantidades[productoSeleccionado.ID_PRODUCTO] || 1}
                          onChange={(e) => handleCantidadChange(productoSeleccionado.ID_PRODUCTO, e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button
                        className="btn btn-secondary"
                        onClick={() => setProductoSeleccionado(null)}
                      >
                        Cerrar
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={() => handleAgregarAlCarrito(productoSeleccionado)}
                        disabled={
                          productoSeleccionado.STOCK === 0 ||
                          ['Agotado', 'Descontinuado'].includes(productoSeleccionado.DISPONIBILIDAD)
                        }
                      >
                        Agregar al carrito
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

    </div>
  );
};

export default Catalogo;

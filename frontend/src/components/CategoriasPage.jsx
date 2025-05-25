import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CarritoContext } from '../context/CarritoContext';
import axios from 'axios';
import Categorias from './Categorias';

const CategoriasPage = () => {
  const { id } = useParams(); // ID_TIPO_PRODUCTO
  const [productos, setProductos] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [cantidades, setCantidades] = useState({});
  const { agregarProducto, clienteId } = useContext(CarritoContext); // si usas contexto aquí

  const navigate = useNavigate();

  useEffect(() => {
axios.get('https://back-hypertoys.onrender.com/HyperToys/productos/all?page=1&limit=1000')
  .then(res => {
    const productosTotales = res.data.productos; // 💥 aquí está el array
    const filtrados = productosTotales.filter(p => p.ID_TIPO_PRODUCTO == id);
    setProductos(filtrados);
  })
  .catch(err => {
    console.error('Error al obtener productos:', err.message);
    if (err.response) {
      console.log('Status:', err.response.status);
      console.log('Data:', err.response.data);
    }
  });
  }, [id]);

  useEffect(() => {
  if (productoSeleccionado) {
    document.body.classList.add('modal-open');
  } else {
    document.body.classList.remove('modal-open');
  }
}, [productoSeleccionado]);


  useEffect(() => {
    // Obtener nombre de la categoría
    axios.get(`https://back-hypertoys.onrender.com/HyperToys/tipos-producto/${id}`)
      .then(res => setNombreCategoria(res.data.TIPO))
      .catch(err => console.error('Error al obtener categoría:', err));
  }, [id]);


  const handleCantidadChange = (id, valor) => {
  setCantidades({ ...cantidades, [id]: parseInt(valor) });
};

const handleAgregarAlCarrito = (producto) => {
  if (!clienteId) {
    document.body.classList.remove('modal-open');
    setProductoSeleccionado(null);
    alert("Debes iniciar sesión para agregar productos al carrito.");
    navigate('/login');
    return;
  }

  const cantidad = cantidades[producto.ID_PRODUCTO] || 1;
  agregarProducto({ ...producto, cantidad });
  alert("¡Producto agregado al carrito!");
  setProductoSeleccionado(null); // cerrar el modal después de agregar
};


  return (
    <div className="container mt-5">
      <Categorias />
      <h3 className="mb-4 text-center">
        {nombreCategoria ? `Productos de la categoría: ${nombreCategoria}` : 'Cargando...'}
      </h3>

      <div className="row">
        {productos.length === 0 ? (
          <p className="text-center">No hay productos disponibles para esta categoría.</p>
        ) : (
          productos.map((producto) => (
            <div className="col-md-4 mb-4" key={producto.ID_PRODUCTO}>
              <div className="card h-100">
                {producto.IMAGEN && (
                  <img
                    src={`data:image/jpeg;base64,${producto.IMAGEN}`}
                    alt={producto.NOMBRE}
                    className="card-img-top producto-img"
                    style={{ cursor: 'pointer' }}
                    onClick={() => setProductoSeleccionado(producto)}
                  />

                )}
                <div className="card-body">
                  <h5 className="card-title text-primary producto-nombre" style={{ cursor: 'pointer' }} onClick={() => setProductoSeleccionado(producto)}>{producto.NOMBRE}</h5>
                  <p className="card-text">{producto.DESCRIPCION}</p>
                  <p><strong>Precio:</strong> ${producto.PRECIO}</p>
                  <p><strong>Disponibilidad:</strong> {producto.DISPONIBILIDAD}</p>
                  <p><strong>Stock:</strong> {producto.STOCK}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

         {/* Modal de producto */}
        {productoSeleccionado && (
              <div
                className="modal fade show"
                style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
                tabIndex="-1"
                role="dialog"
                  onClick={(e) => {
                  // si se da clic directamente en el fondo (y no en el modal-content), cerrar
                  if (e.target.classList.contains('modal') || e.target.classList.contains('fade')) {
                    setProductoSeleccionado(null);
                  }
                }}
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

export default CategoriasPage;

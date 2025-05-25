import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Categorias from './Categorias';

const CategoriasPage = () => {
  const { id } = useParams(); // ID_TIPO_PRODUCTO
  const [productos, setProductos] = useState([]);
  const [nombreCategoria, setNombreCategoria] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
axios.get('https://back-hypertoys.onrender.com/HyperToys/productos/all')
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
    // Obtener nombre de la categoría
    axios.get(`https://back-hypertoys.onrender.com/HyperToys/tipos-producto/${id}`)
      .then(res => setNombreCategoria(res.data.TIPO))
      .catch(err => console.error('Error al obtener categoría:', err));
  }, [id]);

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
                    className="card-img-top"
                    style={{ cursor: 'pointer', maxHeight: '200px', objectFit: 'contain' }}
                    onClick={() => navigate(`/producto/${producto.ID_PRODUCTO}`)}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title text-primary">{producto.NOMBRE}</h5>
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
    </div>
  );
};

export default CategoriasPage;

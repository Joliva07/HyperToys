// src/components/ProductosPorCategoria.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const ProductosPorCategoria = () => {
  const { id } = useParams();
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/productos/tipo/${id}`);
        setProductos(res.data);
      } catch (error) {
        console.error('Error al obtener productos por categoría:', error);
      }
    };

    fetchProductos();
  }, [id]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Productos por Categoría</h2>
      <div className="row">
        {productos.map(producto => (
          <div className="col-md-4 mb-4" key={producto.ID_PRODUCTO}>
            <div className="card h-100">
              <img
                src={`data:image/jpeg;base64,${producto.IMAGEN}`}
                alt={producto.NOMBRE}
                className="card-img-top"
                style={{ height: '200px', objectFit: 'contain', cursor: 'pointer' }}
                onClick={() => navigate(`/producto/${producto.ID_PRODUCTO}`)}
              />
              <div className="card-body">
                <h5>{producto.NOMBRE}</h5>
                <p>{producto.DESCRIPCION}</p>
                <p><strong>Q{producto.PRECIO}</strong></p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductosPorCategoria;

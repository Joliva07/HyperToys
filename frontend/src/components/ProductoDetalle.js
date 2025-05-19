import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { CarritoContext } from '../context/CarritoContext';

const ProductoDetalle = () => {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const { agregarProducto } = useContext(CarritoContext);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerProducto = async () => {
      try {
        const res = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/productos/${id}`);
        setProducto(res.data);
      } catch (error) {
        console.error('Error al obtener producto:', error);
      }
    };

    obtenerProducto();
  }, [id]);

  const handleAgregarAlCarrito = () => {
    agregarProducto({ ...producto, cantidad: parseInt(cantidad) });
    alert('¡Producto agregado al carrito!');
    navigate('/catalogo');
  };

  if (!producto) return <div className="container mt-5">Cargando producto...</div>;

  return (
    <div className="container mt-5 text-center">
      <h2>Figura - {producto.NOMBRE}</h2>
      {producto.IMAGEN && (
        <img
          src={`data:image/jpeg;base64,${producto.IMAGEN}`}
          alt={producto.NOMBRE}
          className="img-fluid mb-4"
          style={{ maxHeight: '400px', objectFit: 'contain' }}
        />
      )}
      <p><strong>Descripción:</strong> {producto.DESCRIPCION}</p>
      <p><strong>Precio:</strong> Q{producto.PRECIO}</p>
      <p><strong>Puntos:</strong> {producto.PUNTOS}</p>
      <div className="d-flex flex-column align-items-center">
        <label>Cantidad:</label>
        <input
          type="number"
          min="1"
          className="form-control w-25 mb-3"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />
        <button className="btn btn-primary" onClick={handleAgregarAlCarrito}>
          Agregar al carrito
        </button>
      </div>
    </div>
  );
};

export default ProductoDetalle;

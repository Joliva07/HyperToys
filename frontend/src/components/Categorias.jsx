// src/components/Categorias.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Categorias.css';

const imagenes = {
  'Figura coleccionable': require('../Images/categorias/figura_coleccionable.png'),
  'Mangas y comics': require('../Images/categorias/mangas_y_comics.png'),
  'Posters y decoracion': require('../Images/categorias/posters_y_decoracion.png'),
  'Productos gamer': require('../Images/categorias/productos_gamer.png'),
  'Ropa y accesorios': require('../Images/categorias/ropa_y_accesorios.png'),
  'Tarjeta coleccionable': require('../Images/categorias/tarjeta_coleccionable.png'),
  'Videojuegos': require('../Images/categorias/videojuegos.png'),
};

const Categorias = () => {
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('https://back-hypertoys.onrender.com/HyperToys/tipos-producto/all')
      .then((res) => setCategorias(res.data.tipos))
      .catch((err) => console.error('Error al obtener categorías:', err));
  }, []);

  const handleClickCategoria = (id) => {
    navigate(`/categoria/${id}`); // Ruta dinámica por ID
  };

  return (
    <div className="categorias-container">
      {categorias.map((cat) => (
        <div
          className="categoria-item"
          key={cat.ID_TIPO_PRODUCTO}
          onClick={() => handleClickCategoria(cat.ID_TIPO_PRODUCTO)}
          style={{ cursor: 'pointer' }}
        >
          <img
            src={imagenes[cat.TIPO] || '/img/default.png'}
            alt={cat.TIPO}
            className="categoria-icono"
          />
          <p className="categoria-nombre">{cat.TIPO}</p>
        </div>
      ))}
    </div>
  );
};

export default Categorias;

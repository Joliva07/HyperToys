// src/components/Categorias.jsx
import React, { useEffect, useState, useRef } from 'react';
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
  const containerRef = useRef(null);

  useEffect(() => {
    axios
      .get('https://back-hypertoys.onrender.com/HyperToys/tipos-producto/all')
      .then((res) => setCategorias(res.data.tipos))
      .catch((err) => console.error('Error al obtener categorías:', err));
  }, []);

  const handleScroll = (direction) => {
    const container = containerRef.current;
    if (container) {
      const scrollAmount = 200;
      container.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

return (
    <div className="categorias-wrapper">
      <button className="flecha-btn izquierda" onClick={() => handleScroll('left')}>
        ←
      </button>

      <div className="categorias-container" ref={containerRef}>
        {categorias.map((cat) => (
          <div
            className="categoria-item"
            key={cat.ID_TIPO_PRODUCTO}
            onClick={() => navigate(`/categoria/${cat.ID_TIPO_PRODUCTO}`)}
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

      <button className="flecha-btn derecha" onClick={() => handleScroll('right')}>
        →
      </button>
    </div>
  );
};

export default Categorias;

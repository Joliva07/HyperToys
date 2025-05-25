import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Categorias.css';

const categorias = [
  { id: 1, nombre: 'Figura coleccionable', imagen: '/categorias/figura_coleccionable.png' },
  { id: 3, nombre: 'Mangas y comics', imagen: '/categorias/mangas_y_comics.png' },
  { id: 5, nombre: 'Posters y decoracion', imagen: '/categorias/posters_y_decoracion.png' },
  { id: 7, nombre: 'Productos gamer', imagen: '/categorias/productos_gamer.png' },
  { id: 4, nombre: 'Ropa y accesorios', imagen: '/categorias/ropa_y_accesorios.png' },
  { id: 2, nombre: 'Tarjeta coleccionable', imagen: '/categorias/tarjeta_coleccionable.png' },
  { id: 6, nombre: 'Videojuegos', imagen: '/categorias/videojuegos.png' },
];

const Categorias = () => {
  const navigate = useNavigate();

  return (
    <div className="categorias-container">
      {categorias.map((categoria) => (
        <div key={categoria.id} className="categoria" onClick={() => navigate(`/categoria/${categoria.id}`)}>
          <div className="icono-categoria">
            <img src={categoria.imagen} alt={categoria.nombre} />
          </div>
          <p>{categoria.nombre}</p>
        </div>
      ))}
    </div>
  );
};

export default Categorias;
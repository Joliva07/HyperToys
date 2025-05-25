import React from 'react';
import { Carousel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Banner.css'; // Estilos personalizados (opcional)
import banner1 from '../Images/banners/banner1.jpg'; // Ajusta la ruta
import banner2 from '../Images/banners/banner2.jpg';
import banner3 from '../Images/banners/banner3.jpg';

const Banner = () => {
  // Datos del carrusel (puedes reemplazarlos con los de tu API)
  const banners = [
    {
      id: 1,
      titulo: "¡Oferta Especial!",
      descripcion: "Juguetes con 30% de descuento",
      imagen: banner1,
      enlace: "/ofertas"
    },
    {
      id: 2,
      titulo: "Nuevos Lanzamientos",
      descripcion: "Descubre los juguetes de esta temporada",
      imagen: banner2,
      enlace: "/nuevos"
    },
    {
      id: 3,
      titulo: "Envío Gratis",
      descripcion: "En compras mayores a Q200",
      imagen: banner3,
      enlace: "/envio"
    }
  ];

  return (
    <Carousel fade interval={3000} className="banner-carrusel">
      {banners.map((banner) => (
        <Carousel.Item key={banner.id}>
          <img
            className="d-block w-100"
            src={banner.imagen}
            alt={banner.titulo}
          />
          <Carousel.Caption className="banner-caption">
            <h3>{banner.titulo}</h3>
            <p>{banner.descripcion}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default Banner;
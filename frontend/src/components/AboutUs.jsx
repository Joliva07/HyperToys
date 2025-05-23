import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate } from 'react-router-dom';
import './AboutUs.css';

const AboutUs = () => {
const navigate = useNavigate();
    return (
    <div className="about-us-container">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="hero-overlay">
          <h1>Nuestra Historia</h1>
          <p>De un sueño infantil a la tienda de juguetes más innovadora</p>
        </div>
      </section>

      {/* Nuestra Historia */}
      <section className="our-story">
        <div className="container">
          <h2>¿Quiénes somos?</h2>
          <div className="story-content">
            <p>
              HyperToys nació en 2018 cuando nuestro fundador, Carlos "The Wizard" Mendez, 
              buscaba figuras de edición limitada de su anime favorito y descubrió que 
              Latinoamérica merecía un verdadero santuario geek. Lo que comenzó como 
              un pequeño local en Medellín lleno de figuras de acción, mangas y 
              coleccionables, hoy es el e-commerce especializado más grande en cultura 
              pop de la región.
            </p>
            <p>
              Somos el Hub definitivo para fans de anime, videojuegos, cómics y 
              tecnología. Desde figuras Figma hasta réplicas de armas de tus juegos 
              favoritos, cada producto en nuestro catálogo pasa por nuestro "Geek Test": 
              debe despertar esa chispa de emoción que solo los verdaderos fans 
              entendemos.
            </p>
          </div>
          <img src="/team.jpeg" alt="Equipo HyperToys" />
        </div>
      </section>

      {/* Nuestra Misión */}
      <section className="our-mission">
        <div className="container">
          <h2>Nuestra Misión</h2>
          <div className="mission-cards">
            <div className="mission-card">
              <FontAwesomeIcon icon="rocket" className="mission-icon" />
              <h3>Innovación</h3>
              <p>Buscamos constantemente los productos más novedosos y tecnológicos del mercado</p>
            </div>
            <div className="mission-card">
              <FontAwesomeIcon icon="child" className="mission-icon" />
              <h3>Comunidad Geek</h3>
              <p>No solo vendemos productos, construimos el punto de encuentro para la tribu geek latinoamericana</p>
            </div>
            <div className="mission-card">
              <FontAwesomeIcon icon="smile" className="mission-icon" />
              <h3>Felicidad Garantizada</h3>
              <p>Nos comprometemos con la satisfacción total de nuestros pequeños clientes</p>
            </div>
            <div className="mission-card">
              <FontAwesomeIcon icon="gift" className="mission-icon" />
              <h3>Magia en Cada Entrega</h3>
              <p>Cada pedido viene con un toque especial que hace la experiencia única</p>
            </div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="our-values">
        <div className="container">
          <h2>Nuestros Valores</h2>
          <div className="values-list">
            <ul>
              <li><strong>Autenticidad Geek:</strong> Todos en nuestro equipo pasamos el "Nerd Test"</li>
              <li><strong>Ediciones Especiales:</strong> Priorizamos lanzamientos exclusivos y limited edition</li>
              <li><strong>Know the Lore:</strong> Nuestro equipo conoce cada detalle de los productos que vendemos</li>
              <li><strong>Convenciones VIP:</strong> Patrocinamos eventos geek y llevamos productos exclusivos</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="container">
          <h2>¿Listo para una experiencia de compra mágica?</h2>
          <button className="cta-button" onClick={() => navigate('/')}>Explora Nuestros Juguetes</button>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
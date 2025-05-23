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
              HyperToys nació en 2018 cuando nuestro fundador, Carlos Mendez, buscaba regalos para sus sobrinos 
              y se dio cuenta de que faltaba magia en las tiendas de juguetes tradicionales. Lo que comenzó como 
              un pequeño local en el centro de Medellín, hoy es la tienda de juguetes en línea más innovadora 
              de Latinoamérica.
            </p>
            <p>
              Nos especializamos en juguetes que combinan diversión con aprendizaje, tecnología con creatividad, 
              y fantasía con realidad. Cada producto en nuestro catálogo es cuidadosamente seleccionado para 
              despertar la imaginación de niños y adultos por igual.
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
              <p>Buscamos constantemente los juguetes más novedosos y tecnológicos del mercado</p>
            </div>
            <div className="mission-card">
              <FontAwesomeIcon icon="child" className="mission-icon" />
              <h3>Diversión Educativa</h3>
              <p>Cada juguete debe estimular la creatividad y el aprendizaje</p>
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
              <li><strong>Pasión por el juego:</strong> Creemos que jugar es esencial a cualquier edad</li>
              <li><strong>Calidad premium:</strong> Todos nuestros productos pasan rigurosas pruebas</li>
              <li><strong>Sostenibilidad:</strong> Priorizamos juguetes ecológicos y materiales responsables</li>
              <li><strong>Comunidad:</strong> Apoyamos talleres educativos y donaciones a niños necesitados</li>
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
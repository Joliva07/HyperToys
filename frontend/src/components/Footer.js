import React from 'react';
import './Footer.css'; // Opcional: para estilos

const Footer = () => {
  return (
    <footer className="bg-dark text-light text-center py-3 mt-5">
      <p>© {new Date().getFullYear()} HyperToys. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CarritoContext } from '../context/CarritoContext';
import './Navbar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import '../context/Catalogo.css';




const Navbar = () => {
  const navigate = useNavigate();
  const { carrito } = React.useContext(CarritoContext);
  const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  const [open, setOpen] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);

  const handleToggle = () => setOpen(!open);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 960) setOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  return (
    <>
    <nav className={`navbar-custom navbar navbar-expand-lg fixed-top ${isScrolling ? 'scrolled' : ''}`}>
      <div className="container d-flex justify-content-between align-items-center">
        <h1 className="navbar-brand mb-0" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img
  src={isScrolling ? "/LOGO2.png" : "/LOGOBLANCO.png"}
  alt="Logo HyperToys"
  className="logonav img-fluid"
/>

          
        </h1>

        <button className="navbar-toggler" type="button" onClick={handleToggle}>
          {open ? '✖' : '☰'}
        </button>

        <div className={`collapse navbar-collapse ${open ? 'show' : ''}`}>
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0 text-center">
            <li className="nav-item" onClick={() => navigate('/')}>
              <span className="nav-link">Inicio</span>
            </li>
            <li className="nav-item">
              <span className="nav-link">Acerca de nosotros</span>
            </li>
            <li className="nav-item" onClick={() => navigate('/perfil')}>
              <span className="nav-link">
                <FontAwesomeIcon icon="circle-user" className="me-2" />
                Mi Perfil
              </span>
            </li>

            <li className="nav-item position-relative" onClick={() => navigate('/confirmar-compra')}>
              <span className="nav-link d-flex align-items-center">
                <FontAwesomeIcon icon="cart-shopping" />
                {totalItems > 0 && (
                  <span className="badge bg-danger rounded-circle position-absolute top-0 start-100 translate-middle p-1">
                    {totalItems}
                  </span>
                )}
                <span className="ms-2">Ver Carrito</span>
              </span>
            </li>

          </ul>

          <div className="navbar-icons mt-3 mt-lg-0 d-flex gap-2 justify-content-center">
            <i className="fa-brands fa-twitter nav-icon"></i>
            <i className="fa-brands fa-facebook nav-icon"></i>
            <i className="fa-brands fa-instagram nav-icon"></i>                
            <a onClick={() => navigate('/login')} rel="noreferrer">
              <button className="btn btn-outline-dark btn-sm">
              <FontAwesomeIcon icon="sign-in-alt" className="me-2" />
              Login
            </button>
            </a>

          </div>
        </div>
      </div>
    </nav>
    <div style={{ height: '60px' }}></div>
    </>
  );
};

export default Navbar;

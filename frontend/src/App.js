//import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext'; // ¡Muy importante!
import Login from './components/Login';
import Registro from './components/Registro';
import Catalogo from './components/Catalogo';
import ConfirmarCompra from './components/ConfirmarCompra';
import PagoExitoso from './components/PagoExitoso'; // nuevo
import PerfilCliente from './components/PerfilCliente';
import ProductoDetalle from './components/ProductoDetalle';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AboutUs from './components/AboutUs';
import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
  return (
    <CarritoProvider>
      <Router>
      <div className="app-wrapper">
        <Navbar />
        <div className="app-content">
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/confirmar-compra" element={<ConfirmarCompra />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/perfil" element={<PerfilCliente />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/AboutUs" element={<AboutUs />} />
        </Routes>
      </div>
      <Footer />
    </div>
  </Router>
    </CarritoProvider>
  );
}

export default App;

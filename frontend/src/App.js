import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext'; // ¡Muy importante!
import Login from './components/Login';
import Registro from './components/Registro';
import Catalogo from './components/Catalogo';
import ConfirmarCompra from './components/ConfirmarCompra';
import PagoExitoso from './components/PagoExitoso'; // nuevo
import PerfilCliente from './components/PerfilCliente';
import ProductoDetalle from './components/ProductoDetalle';

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/confirmar-compra" element={<ConfirmarCompra />} />
          <Route path="/pago-exitoso" element={<PagoExitoso />} />
          <Route path="/perfil" element={<PerfilCliente />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
        </Routes>
      </Router>
    </CarritoProvider>
  );
}

export default App;

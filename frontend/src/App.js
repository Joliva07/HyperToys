import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CarritoProvider } from './context/CarritoContext'; // ¡Muy importante!
import Login from './components/Login';
import Registro from './components/Registro';
import Catalogo from './components/Catalogo';

function App() {
  return (
    <CarritoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route path="/catalogo" element={<Catalogo />} />
        </Routes>
      </Router>
    </CarritoProvider>
  );
}

export default App;

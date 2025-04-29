import { createContext, useState, useEffect } from "react";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  const [clienteId, setClienteId] = useState(() => {
    const clienteGuardado = localStorage.getItem('clienteId');
    return clienteGuardado ? parseInt(clienteGuardado) : null;
  });

  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }, [carrito]);

  useEffect(() => {
    if (clienteId !== null) {
      localStorage.setItem('clienteId', clienteId.toString());
    }
  }, [clienteId]);

  const agregarProducto = (producto) => {
    const existe = carrito.find(p => p.ID_PRODUCTO === producto.ID_PRODUCTO);
    if (existe) {
      setCarrito(carrito.map(p =>
        p.ID_PRODUCTO === producto.ID_PRODUCTO
          ? { ...p, cantidad: p.cantidad + producto.cantidad }
          : p
      ));
    } else {
      setCarrito([...carrito, { ...producto }]);
    }
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter(p => p.ID_PRODUCTO !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('carrito');
    // ⚠️ OJO: ya no borramos el clienteId aquí
  };

  const cerrarSesion = () => {
    setCarrito([]);
    setClienteId(null);
    localStorage.removeItem('carrito');
    localStorage.removeItem('clienteId');
    localStorage.removeItem('token');
  };

  return (
    <CarritoContext.Provider value={{
      carrito,
      setCarrito,
      agregarProducto,
      eliminarProducto,
      vaciarCarrito,
      clienteId,
      setClienteId,
      cerrarSesion
    }}>
      {children}
    </CarritoContext.Provider>
  );
}

import { createContext, useState } from "react";

export const CarritoContext = createContext();

export function CarritoProvider({ children }) {
  const [carrito, setCarrito] = useState([]);
  const [clienteId, setClienteId] = useState(1); // ⚠️ Simulado: luego vendrá del login

  const agregarProducto = (producto) => {
    const existe = carrito.find(p => p.ID_PRODUCTO === producto.ID_PRODUCTO);
    if (existe) {
      setCarrito(carrito.map(p =>
        p.ID_PRODUCTO === producto.ID_PRODUCTO
          ? { ...p, cantidad: p.cantidad + 1 }
          : p
      ));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const eliminarProducto = (id) => {
    setCarrito(carrito.filter(p => p.ID_PRODUCTO !== id));
  };

  const vaciarCarrito = () => setCarrito([]);

  return (
    <CarritoContext.Provider value={{
      carrito,
      agregarProducto,
      eliminarProducto,
      vaciarCarrito,
      clienteId,
      setClienteId
    }}>
      {children}
    </CarritoContext.Provider>
  );
}
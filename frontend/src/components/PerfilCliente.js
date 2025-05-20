import React, { useEffect, useState, useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import axios from 'axios';

const PerfilCliente = () => {
  const { clienteId } = useContext(CarritoContext);
  const [cliente, setCliente] = useState(null);
  const [formulario, setFormulario] = useState({});
  const [editando, setEditando] = useState(false);
  const [facturas, setFacturas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [facturaExpandida, setFacturaExpandida] = useState(null);
  const [detalleFactura, setDetalleFactura] = useState([]);
  const [reservaExpandida, setReservaExpandida] = useState(null);
  const [detalleReserva, setDetalleReserva] = useState([]);

  useEffect(() => {
    const obtenerDatos = async () => {
      try {
        const clienteRes = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/cliente/${clienteId}`);
        setCliente(clienteRes.data);
        setFormulario(clienteRes.data);

        const facturasRes = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/verfactura/${clienteId}`);
        setFacturas(facturasRes.data.facturas);

        const reservasRes = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/reservas/${clienteId}`);
        setReservas(reservasRes.data.reservas);
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };

    obtenerDatos();
  }, [clienteId]);

  const handleChange = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const verDetalleFactura = async (idFactura) => {
    try {
      if (facturaExpandida === idFactura) {
        // Si ya está expandida, cierra
        setFacturaExpandida(null);
        setDetalleFactura([]);
        return;
      }
      
      const res = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/facturas/${idFactura}/detalles`);
      setDetalleFactura(res.data.detalles);
      setFacturaExpandida(idFactura);
    } catch (error) {
      console.error('Error al obtener detalle de factura:', error);
      alert('No se pudo cargar el detalle de esta factura.');
    }
  };

  const verDetalleReserva = async (idReserva) => {
    try {
      if (reservaExpandida === idReserva) {
        setReservaExpandida(null);
        setDetalleReserva([]);
        return;
      }

      const res = await axios.get(`https://back-hypertoys.onrender.com/HyperToys/reservas/${idReserva}/detalles`);
      setDetalleReserva(res.data.detalles);
      setReservaExpandida(idReserva);
    } catch (error) {
      console.error('Error al obtener detalle de reserva:', error);
      alert('No se pudo cargar el detalle de esta reserva.');
    }
  };

  const handleGuardar = async () => {
    try {
      await axios.put(`https://back-hypertoys.onrender.com/HyperToys/actualizarcliente/${clienteId}`, formulario);
      alert('Perfil actualizado correctamente');
      setCliente(formulario);
      setEditando(false);
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      alert('Hubo un error al actualizar el perfil.');
    }
  };

  if (!cliente) {
    return <div className="container mt-5">Cargando perfil...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Mi Perfil</h2>
      <div className="mt-4">
        {editando ? (
          <>
            <div className="mb-3">
              <label>Nombres:</label>
              <input
                type="text"
                name="NOMBRES"
                value={formulario.NOMBRES || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>Apellidos:</label>
              <input
                type="text"
                name="APELLIDOS"
                value={formulario.APELLIDOS || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>Correo electrónico:</label>
              <input
                type="email"
                name="CORREO_ELECTRONICO"
                value={formulario.CORREO_ELECTRONICO || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label>Dirección:</label>
              <input
                type="text"
                name="DIRECCION"
                value={formulario.DIRECCION || ''}
                onChange={handleChange}
                className="form-control"
              />
            </div>
            <button className="btn btn-success me-2" onClick={handleGuardar}>Guardar Cambios</button>
            <button className="btn btn-secondary" onClick={() => setEditando(false)}>Cancelar</button>
          </>
        ) : (
          <>
            <p><strong>Nombres:</strong> {cliente.NOMBRES}</p>
            <p><strong>Apellidos:</strong> {cliente.APELLIDOS}</p>
            <p><strong>Correo:</strong> {cliente.CORREO_ELECTRONICO}</p>
            <p><strong>Dirección:</strong> {cliente.DIRECCION}</p>
            <button className="btn btn-primary" onClick={() => setEditando(true)}>Editar Perfil</button>
          </>
        )}
      </div>

      <hr className="my-5" />

      <h3>Mis Facturas</h3>
      {facturas.length === 0 ? (
        <p>No tienes facturas registradas.</p>
      ) : (
        <ul className="list-group mb-5">
          {facturas.map((factura, idx) => (
            <li key={idx} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Factura #{factura.id_factura}</strong> - 
                  Fecha: {new Date(factura.fecha_factura).toLocaleDateString()} - 
                  Total: Q{factura.total_pagar.toFixed(2)}
                </div>
                <button className="btn btn-sm btn-outline-primary" onClick={() => verDetalleFactura(factura.id_factura)}>
                  {facturaExpandida === factura.id_factura ? '-' : '+'}
                </button>
              </div>

              {/* Mostrar detalle si está expandido */}
              {facturaExpandida === factura.id_factura && (
                <ul className="list-group mt-3">
                  {detalleFactura.length === 0 ? (
                    <li className="list-group-item">No hay productos en esta factura.</li>
                  ) : (
                    detalleFactura.map((producto, index) => (
                      <li key={index} className="list-group-item">
                        Producto: {producto.nombre_producto} | Cantidad: {producto.cantidad} | Precio: Q{producto.precio_unitario} | Subtotal: Q{(producto.precio_unitario * producto.cantidad).toFixed(2)}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}


      <h3>Mis Reservas</h3>
      {reservas.length === 0 ? (
        <p>No tienes reservas registradas.</p>
      ) : (
        <ul className="list-group mb-5">
          {reservas.map((reserva, idx) => (
            <li key={idx} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Reserva #{reserva.id_reserva}</strong> - 
                  Fecha Reserva: {new Date(reserva.fecha_reserva).toLocaleDateString()} - 
                  Fecha Límite Pago: {new Date(reserva.fecha_limite_pago).toLocaleDateString()} -
                  Total: Q{reserva.total_reserva.toFixed(2)}
                </div>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => verDetalleReserva(reserva.id_reserva)}
                >
                  {reservaExpandida === reserva.id_reserva ? '-' : '+'}
                </button>
              </div>

              {/* Mostrar detalle si está expandido */}
              {reservaExpandida === reserva.id_reserva && (
                <ul className="list-group mt-3">
                  {detalleReserva.length === 0 ? (
                    <li className="list-group-item">No hay productos en esta reserva.</li>
                  ) : (
                    detalleReserva.map((prod, index) => (
                      <li key={index} className="list-group-item">
                        Producto: {prod.nombre_producto} | Cantidad: {prod.cantidad} | Precio: Q{prod.precio_unitario} | Subtotal: Q{(prod.precio_unitario * prod.cantidad).toFixed(2)}
                      </li>
                    ))
                  )}
                </ul>
              )}
            </li>
          ))}
        </ul>
        )}
    </div>
  );
};

export default PerfilCliente;

import React, { useEffect, useState, useContext } from 'react';
import { CarritoContext } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css'; 

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
    return <div className="container mt-5">No estas registrado, inicia sesión, ve al login </div>;
  }

  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate('/');
  };

 return (
  <div className="login-wrapper">
    <div className="container">
      <div className="row main">
        {/* Lado izquierdo */}
          <div className="col-sm-6 right-side">
          <h1>Mi Perfil</h1>
          <p>Consulta o edita tu información, facturas y reservas.</p>

          <div className="form">
            {editando ? (
              <>
                <div className="form-group">
                  <label>Nombres:</label>
                  <input
                    type="text"
                    name="NOMBRES"
                    value={formulario.NOMBRES || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Apellidos:</label>
                  <input
                    type="text"
                    name="APELLIDOS"
                    value={formulario.APELLIDOS || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Correo electrónico:</label>
                  <input
                    type="email"
                    name="CORREO_ELECTRONICO"
                    value={formulario.CORREO_ELECTRONICO || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <label>Dirección:</label>
                  <input
                    type="text"
                    name="DIRECCION"
                    value={formulario.DIRECCION || ''}
                    onChange={handleChange}
                    className="form-control"
                  />
                </div>
                <div className="form-group row" style={{ marginTop: '20px' }}>
                  <div className="col-xs-6 text-left">
                    <button className="btn btn-deep-purple btn-half" onClick={handleGuardar}>
                      Guardar Cambios
                    </button>
                  </div>
                  <div className="col-xs-6 text-right">
                    <button className="btn btn-outline-secondary btn-half" onClick={() => setEditando(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <p><strong>Nombres:</strong> {cliente.NOMBRES}</p>
                <p><strong>Apellidos:</strong> {cliente.APELLIDOS}</p>
                <p><strong>Correo:</strong> {cliente.CORREO_ELECTRONICO}</p>
                <p><strong>Dirección:</strong> {cliente.DIRECCION}</p>
                <button className="btn btn-deep-purple btn-half" onClick={() => setEditando(true)}>
                  Editar Perfil
                </button>
              </>
            )}

            <hr className="my-4" />

            <h4>Mis Facturas</h4>
            {facturas.length === 0 ? (
              <p>No tienes facturas registradas.</p>
            ) : (
              <ul className="list-group mb-4">
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

            <h4>Mis Reservas</h4>
            {reservas.length === 0 ? (
              <p>No tienes reservas registradas.</p>
            ) : (
              <ul className="list-group mb-4">
                {reservas.map((reserva, idx) => (
                  <li key={idx} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>Reserva #{reserva.id_reserva}</strong> - 
                        Fecha Reserva: {reserva.fecha_reserva.split('T')[0].split('-').reverse().join('/')} - 
                        Límite: {reserva.fecha_limite_pago.split('T')[0].split('-').reverse().join('/')} - 
                        Total: Q{reserva.total_reserva.toFixed(2)}
                      </div>
                      <button className="btn btn-sm btn-outline-primary" onClick={() => verDetalleReserva(reserva.id_reserva)}>
                        {reservaExpandida === reserva.id_reserva ? '-' : '+'}
                      </button>
                    </div>
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

            <div className="text-center mt-4">
              <button className="btn btn-outline-secondary btn-half" onClick={handleCerrarSesion}>
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>

        {/* Lado derecho */}
        <div className="col-sm-6 left-side">
          <div className="login-img">
            <img
              src="/LOGO.PNG"
              alt="Logo HyperToys"
              className="logo-login img-fluid"
            />
          </div>
          <p>Administra tu perfil y revisa tus compras</p>
          <br />
          <p>Gracias por confiar en HyperToys 💜</p>
        </div>
      </div>
    </div>
  </div>
);
};

export default PerfilCliente;

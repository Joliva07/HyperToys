import React, { useState } from 'react';
import axios from 'axios';

const Registro = () => {
  const [form, setForm] = useState({
    NOMBRES: '',
    APELLIDOS: '',
    FECHA_NACIMIENTO: '',
    NIT: '',
    DIRECCION: '',
    CORREO_ELECTRONICO: '',
    USUARIO: '',
    CONTRASENA: ''
  });
  const [registroExitoso, setRegistroExitoso] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const res = await axios.post('https://hypertoys.onrender.com/HyperToys/crearUsuario', form);
      setMensaje('✅ Registro exitoso. Ahora puedes iniciar sesión.');
      setRegistroExitoso(true);
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al registrar usuario');
    }
  };

  const irAlLogin = () => {
    window.location.href = '/';
  };

  return (
    <div className="container mt-5">
      <h2>Registro de Cliente</h2>
      {!registroExitoso && (
        <form onSubmit={handleSubmit}>
          {Object.entries(form).map(([key, val]) => (
            <div className="mb-3" key={key}>
              <label className="form-label">{key.replace('_', ' ')}</label>
              <input
                type={key === 'FECHA_NACIMIENTO' ? 'date' : 'text'}
                name={key}
                className="form-control"
                value={val}
                onChange={handleChange}
                required={key !== 'NIT'}
              />
            </div>
          ))}
          <button type="submit" className="btn btn-success">Registrarse</button>
        </form>
      )}

      {mensaje && (
        <div className="alert alert-info mt-3">{mensaje}</div>
      )}

      {registroExitoso && (
        <button className="btn btn-primary mt-3" onClick={irAlLogin}>
          Iniciar Sesión
        </button>
      )}
    </div>
  );
};

export default Registro;

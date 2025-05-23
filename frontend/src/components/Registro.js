import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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
      const res = await axios.post('https://back-hypertoys.onrender.com/HyperToys/crearUsuario', form);
      setMensaje('✅ Registro exitoso. Ahora puedes iniciar sesión.');
      setRegistroExitoso(true);
    } catch (err) {
      setMensaje(err.response?.data?.error || 'Error al registrar usuario');
    }
  };

  const irAlLogin = () => {
    window.location.href = '/';
  };

  const navigate = useNavigate();

  return (
    <>
    
    <div className="login-wrapper">
        
      <div className="container">
        <div className="row main">

          <div className="col-sm-6 right-side">
            <h1>Registro</h1>
            <p>Completa el formulario para crear tu cuenta.</p>

            <div className="form">
              {!registroExitoso && (
                <form onSubmit={handleSubmit}>
                  {Object.entries(form).map(([key, val]) => (
                    <div className="form-group" key={key}>
                      <label className="form-label">
                        {key.replace('_', ' ').toLowerCase().replace(/^\w/, c => c.toUpperCase())}
                      </label>
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

                  <div className="form-group row" style={{ marginTop: '20px' }}>
                    <div className="col-xs-12 text-center">
                      <button type="submit" className="btn btn-deep-purple btn-half">
                        Registrarse
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {mensaje && (
                <div className="alert alert-info mt-3">{mensaje}</div>
              )}

              {registroExitoso && (
                <div className="form-group row" style={{ marginTop: '20px' }}>
                  <div className="col-xs-12 text-center">
                    <button className="btn btn-outline-secondary btn-half" onClick={irAlLogin}>
                      Iniciar sesión
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

         <div className="col-sm-6 left-side">
            <button 
              className="btn btn-outline-light mb-3" 
              onClick={() => navigate('/login')}
               style={{ marginTop: '20px', display: 'block', transition: 'all 0.3s ease' }}
            >
              ← Volver
            </button>

            <div className="login-img">
                        <img
                            src="/LOGO.png"
                            alt="Logo HyperToys"
                            className="logo-login img-fluid" /* Agrega la clase aquí */
                            />

                    </div>

            <h1>¡Únete a HyperToys!</h1>
            <p>Crea tu cuenta para explorar un mundo de diversión.</p>
            <p>Regístrate fácilmente y comienza tu aventura.</p>
          </div>        


        </div>
      </div>
    </div>
    
    </>
  );

};

export default Registro;

import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { CarritoContext } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setClienteId } = useContext(CarritoContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/login');
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {

            const response = await axios.post(
                'https://back-hypertoys.onrender.com/HyperToys/login',
                { username, password },
                { withCredentials: true } // 👈 esto es lo que habilita las cookies/tokens cross-domain
            );

            const token = response.data.token;
            const id = response.data.id;

            localStorage.setItem('token', token);
            setClienteId(id);

            navigate('/');
        } catch (err) {
            console.error('Respuesta del servidor:', err.response?.data);
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        }
    };

    return (
    <>
        <div className="login-wrapper">
            <div className="container">
                <div className="row main">
                    <div className="col-sm-6 left-side">
                        <div className="login-img">
                        <img
                            src="/LOGO.PNG"
                            alt="Logo HyperToys"
                            className="logo-login img-fluid" /* Agrega la clase aquí */
                            />

                    </div>

                        <p>¡Bienvenido a la mejor tienda de juguetes!</p>
                        <br />
                        <p>Inicia sesión con redes sociales</p>
                        <a className="fb" href="#">Login con Facebook</a>
                        <a className="tw" href="#">Login con Twitter</a>
                    </div>

                    <div className="col-sm-6 right-side">
                        <h1>Iniciar sesión</h1>
                        <p>¿No tienes cuenta? Regístrate en un minuto.</p>

                        <div className="form">
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="form2">Email</label>
                                    <input
                                        type="text"
                                        id="form2"
                                        className="form-control"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="form4">Contraseña</label>
                                    <input
                                        type="password"
                                        id="form4"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-2">{error}</div>
                                )}
                                <div className="form-group row" style={{ marginTop: '25px' }}>
                                    <div className="col-xs-4 text-left">
                                        <button type="submit" className="btn btn-deep-purple btn-half">
                                            Iniciar sesión
                                        </button>
                                    </div>
                                    <div className="col-xs-4 text-right">
                                        <button
                                            className="btn btn-outline-secondary btn-half"
                                            onClick={() => navigate('/registro')}
                                        >
                                            Registrarse
                                        </button>
                                    </div>
                                </div>

                                </form>
                            <div className="logi-forgot text-right mt-3">
                                <a href="#">¿Olvidaste tu contraseña?</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
  </>
    );
};

export default Login;

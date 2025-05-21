import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { CarritoContext } from '../context/CarritoContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { setClienteId } = useContext(CarritoContext);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/catalogo');
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

            navigate('/catalogo');
        } catch (err) {
            console.error('Respuesta del servidor:', err.response?.data);
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Login HyperToys</h1>

            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <button type="submit" className="btn btn-primary">
                    Iniciar sesión
                </button>
                <button
                    type="button"
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate('/registro')}
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
};

export default Login;

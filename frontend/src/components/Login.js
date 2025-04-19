import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await axios.post('http://localhost:4000/clientes/login', {
                username,
                password,
            });

            const token = response.data.token;
            setToken(token);
            localStorage.setItem('token', token);
        } catch (err) {
            console.error('Respuesta del servidor:', err.response?.data);
            setError(err.response?.data?.error || 'Error al iniciar sesión');
        }
    };

    const handleLogout = () => {
        setToken(null);
        localStorage.removeItem('token');
    };

    const accessProtectedRoute = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:4000/clientes/protected', {
                headers: {
                    Authorization: token,
                },
            });

            alert(response.data.message);
        } catch (err) {
            alert('No tienes acceso. Token inválido o expirado.');
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center">Login con React + JWT</h1>

            {!token ? (
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
                </form>
            ) : (
                <div>
                    <h2 className="text-success">Sesión iniciada</h2>
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Cerrar sesión
                    </button>
                    <button className="btn btn-info ms-3" onClick={accessProtectedRoute}>
                        Acceder a ruta protegida
                    </button>
                </div>
            )}
        </div>
    );
};

export default Login;

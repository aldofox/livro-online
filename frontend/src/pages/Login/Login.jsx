import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import { showFlash } from '../../utils/flash';
import './Login.css';
import { Link } from 'react-router-dom';

function Login() {

    const navigate =
        useNavigate();

    const { login } =
        useAuth();

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    async function handleSubmit(
        e
    ) {

        e.preventDefault();

        try {

            const data =
                await loginRequest(
                    email,
                    password
                );

            login(
                data.user,
                data.token
            );

            navigate('/');

        } catch (error) {

            showFlash(error.response?.data?.message || 'Erro ao fazer login.', 'error');

        }

    }

    return (

    <div className="login-page">

        <div className="login-container">

            <h1>
                Entrar
            </h1>

            <form
                className="login-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                />

                <input
                    type="password"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                />

                <button
                    type="submit"
                    className="login-btn"
                >

                    Entrar

                </button>

            </form>

            <div className="login-footer">

                <p>

                    Não possui conta?

                    {' '}

                    <Link to="/register">

                        Cadastre-se

                    </Link>

                </p>

            </div>

        </div>

    </div>

);

}

export default Login;
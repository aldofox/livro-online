import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerRequest } from '../../services/authService';
import { showFlash } from '../../utils/flash';
import './Register.css';
import { Link } from 'react-router-dom';

function Register() {

    const navigate =
        useNavigate();

    const [name, setName] =
        useState('');

    const [email, setEmail] =
        useState('');

    const [password, setPassword] =
        useState('');

    async function handleSubmit(
        e
    ) {

        e.preventDefault();

        try {

            await registerRequest(
                name,
                email,
                password
            );

            showFlash('Cadastro realizado com sucesso!', 'success');

            navigate('/login');

        } catch (error) {

            showFlash(error.response?.data?.message || 'Erro ao cadastrar.', 'error');

        }

    }

    return (

    <div className="register-page">

        <div className="register-container">

            <h1>
                Criar Conta
            </h1>

            <form
                className="register-form"
                onSubmit={handleSubmit}
            >

                <input
                    type="text"
                    placeholder="Nome Completo"
                    value={name}
                    onChange={(e) =>
                        setName(
                            e.target.value
                        )
                    }
                />

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
                    className="register-btn"
                >

                    Criar Conta

                </button>

            </form>

            <div className="register-footer">

                <p>

                    Já possui conta?

                    {' '}

                    <Link to="/login">

                        Entrar

                    </Link>

                </p>

            </div>

        </div>

    </div>

);

}

export default Register;
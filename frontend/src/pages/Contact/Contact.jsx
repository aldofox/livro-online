import { useState } from 'react';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import api from '../../services/api';
import { showFlash } from '../../utils/flash';

import './Contact.css';

function Contact() {

    const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [sending, setSending] = useState(false);
    function handleChange(e) {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        setSending(true);
        try {

            await api.post('/contact', form);

            showFlash('Mensagem enviada com sucesso! Em breve entraremos em contato.', 'success');

            setForm({
                name: '',
                email: '',
                subject: '',
                message: ''
            });

        } catch (error) {

            showFlash(error.response?.data?.message || 'Erro ao enviar mensagem.', 'error');

        } finally {

            setSending(false);

        }

    }

    return (

        <>
            <Header />

            <main className="contact-page">

                <h1>Contato</h1>

                <p className="contact-subtitle">
                    Tem alguma dúvida? Fale com a gente!
                </p>

                <div className="contact-grid">

                    <div className="contact-info">

                        <h2>Informações</h2>

                        <div className="info-item">

                            <i className="fas fa-map-marker-alt"></i>

                            <div>

                                <h4>Endereço</h4>

                                <p>
                                    Rua das Livrarias, 123
                                    <br />
                                    São Paulo - SP
                                </p>

                            </div>

                        </div>

                        <div className="info-item">

                            <i className="fas fa-phone-alt"></i>

                            <div>

                                <h4>Telefone</h4>

                                <p>
                                    (11) 99999-9999
                                </p>

                            </div>

                        </div>

                        <div className="info-item">

                            <i className="fas fa-envelope"></i>

                            <div>

                                <h4>E-mail</h4>

                                <p>
                                    contato@bookstore.com
                                </p>

                            </div>

                        </div>

                        <div className="info-item">

                            <i className="fas fa-clock"></i>

                            <div>

                                <h4>Horário</h4>

                                <p>
                                    Seg à Sex: 9h às 18h
                                    <br />
                                    Sáb: 9h às 13h
                                </p>

                            </div>

                        </div>

                    </div>

                    <form
                        className="contact-form"
                        onSubmit={handleSubmit}
                    >

                        <h2>Envie sua mensagem</h2>

                        <input
                            type="text"
                            name="name"
                            placeholder="Seu nome"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="email"
                            name="email"
                            placeholder="Seu e-mail"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <input
                            type="text"
                            name="subject"
                            placeholder="Assunto"
                            value={form.subject}
                            onChange={handleChange}
                        />

                        <textarea
                            name="message"
                            placeholder="Sua mensagem"
                            value={form.message}
                            onChange={handleChange}
                            required
                        />

                        <button
                            type="submit"
                            disabled={sending}
                        >
                            {sending
                                ? 'Enviando...'
                                : 'Enviar Mensagem'}
                        </button>

                    </form>

                </div>

            </main>

            <Footer />
        </>

    );

}

export default Contact;

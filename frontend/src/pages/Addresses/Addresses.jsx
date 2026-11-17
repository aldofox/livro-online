import { useEffect, useState } from 'react';
import { showFlash } from '../../utils/flash';

import Header from '../../components/Header/Header';
import Footer from '../../components/Footer/Footer';

import api from '../../services/api';

import './Addresses.css';

function Addresses() {

    const [addresses, setAddresses] =
        useState([]);

    const [formData, setFormData] =
        useState({
            zip_code: '',
            street: '',
            number: '',
            complement: '',
            district: '',
            city: '',
            state: '',
            reference_point: ''
        });

    async function loadAddresses() {

        try {

            const token =
                localStorage.getItem(
                    'bookstore_token'
                );

            const response =
                await api.get(
                    '/addresses',
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

            setAddresses(
                response.data.addresses
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar seus endereços.', 'error');

        }

    }

    useEffect(() => {

        loadAddresses();

    }, []);

    async function handleSubmit(e) {

        e.preventDefault();

        try {

            const token =
                localStorage.getItem(
                    'bookstore_token'
                );

            await api.post(
                '/addresses',
                formData,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            setFormData({
                zip_code: '',
                street: '',
                number: '',
                complement: '',
                district: '',
                city: '',
                state: '',
                reference_point: ''
            });

            loadAddresses();

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível salvar o endereço.', 'error');

        }

    }

    async function removeAddress(id) {

        try {

            const token =
                localStorage.getItem(
                    'bookstore_token'
                );

            await api.delete(
                `/addresses/${id}`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            loadAddresses();

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível excluir o endereço.', 'error');

        }

    }

    return (

        <>
            <Header />

            <main className="addresses-page">
                
                <h1>
                    Meus Endereços
                </h1>
            <div className="addresses-container">
                <form
                    className="address-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        placeholder="CEP"
                        value={formData.zip_code}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                zip_code:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Rua"
                        value={formData.street}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                street:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Número"
                        value={formData.number}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                number:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Bairro"
                        value={formData.district}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                district:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Cidade"
                        value={formData.city}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                city:
                                    e.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Estado"
                        value={formData.state}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                state:
                                    e.target.value
                            })
                        }
                    />

                    <button type="submit">

                        Salvar Endereço

                    </button>

                </form>

                <div className="address-list">

                    {addresses.map(address => (

                        <div
                            key={address.id}
                            className="address-card"
                        >

                            <h3>
                                {address.street},
                                {' '}
                                {address.number}
                            </h3>

                            <p>
                                {address.district}
                            </p>

                            <p>
                                {address.city}
                                {' - '}
                                {address.state}
                            </p>

                            <button
                                onClick={() =>
                                    removeAddress(
                                        address.id
                                    )
                                }
                            >
                                Excluir
                            </button>

                        </div>

                    ))}

                </div>
                </div>
            </main>

            <Footer />
        </>

    );

}

export default Addresses;
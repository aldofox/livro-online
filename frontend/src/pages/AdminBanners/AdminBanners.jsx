import { useEffect, useState } from 'react';

import AdminLayout from '../../components/Admin/AdminLayout';
import { showFlash } from '../../utils/flash';
import { getBooks } from '../../services/adminBookService';
import {
    getBanners,
    createBanner,
    updateBanner,
    deleteBanner
} from '../../services/adminService';

import './AdminBanners.css';

function AdminBanners() {

    const [banners, setBanners] = useState([]);
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        reference_id: '',
        title: '',
        subtitle: '',
        description: '',
        button_text: 'Ver Detalhes',
        status: 'active'
    });

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [bannerRes, bookRes] = await Promise.all([
                getBanners(),
                getBooks()
            ]);

            setBanners(bannerRes.banners || []);
            setBooks(bookRes.books || []);
        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os banners.', 'error');
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function resetForm() {
        setForm({
            reference_id: '',
            title: '',
            subtitle: '',
            description: '',
            button_text: 'Ver Detalhes',
            status: 'active'
        });
        setEditingId(null);
    }

    function handleEdit(banner) {
        setEditingId(banner.id);
        setForm({
            reference_id: banner.reference_id || '',
            title: banner.title || '',
            subtitle: banner.subtitle || '',
            description: banner.description || '',
            button_text: banner.button_text || 'Ver Detalhes',
            status: banner.status || 'active'
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.reference_id) {
            showFlash('Selecione um livro para o banner.', 'warning');
            return;
        }

        try {
            if (editingId) {
                await updateBanner(editingId, form);
                showFlash('Banner atualizado com sucesso!', 'success');
            } else {
                await createBanner(form);
                showFlash('Banner criado com sucesso!', 'success');
            }

            resetForm();
            loadData();
        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao salvar banner.', 'error');
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Deseja realmente excluir este banner?')) return;

        try {
            await deleteBanner(id);
            loadData();
        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao excluir banner.', 'error');
        }
    }

    function imgSrc(image) {
        return image
            ? `http://localhost:5000/uploads/books/${image}`
            : 'https://placehold.co/80x120?text=Sem+imagem';
    }

    if (loading) {
        return (
            <AdminLayout>
                <h2>Carregando banners...</h2>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>

<div className="admin-header">
                <h1>
                    <i className="fas fa-images"></i>
                    {' '}
                    Gerenciar Banners
                </h1>
            </div>

            <div className="banner-admin-grid">

                {/* ---- Formulário ---- */}
                <form className="banner-form" onSubmit={handleSubmit}>

                    <h2>
                        {editingId ? 'Editar Banner' : 'Novo Banner'}
                    </h2>

                    <label>Livro do Banner *</label>
                    <select
                        name="reference_id"
                        value={form.reference_id}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Selecione um livro</option>
                        {books.map(book => (
                            <option key={book.id} value={book.id}>
                                {book.title}
                            </option>
                        ))}
                    </select>

                    <label>Título (opcional)</label>
                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        placeholder="Deixe vazio para usar o título do livro"
                    />

                    <label>Sub-título (opcional)</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={form.subtitle}
                        onChange={handleChange}
                        placeholder="Ex: Lançamento imperdível"
                    />

                    <label>Descrição (opcional)</label>
                    <textarea
                        name="description"
                        value={form.description}
                        onChange={handleChange}
                        rows="3"
                        placeholder="Deixe vazio para usar a descrição do livro"
                    />

                    <label>Texto do Botão (opcional)</label>
                    <input
                        type="text"
                        name="button_text"
                        value={form.button_text}
                        onChange={handleChange}
                    />

                    <label>Status</label>
                    <select name="status" value={form.status} onChange={handleChange}>
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                    </select>

<div className="banner-form-actions">
                        <button type="submit" className="btn-primary">
                            <i className="fas fa-save"></i>
                            {' '}
                            {editingId ? 'Salvar Alterações' : 'Criar Banner'}
                        </button>
                        {editingId && (
                            <button type="button" className="btn-cancel" onClick={resetForm}>
                                <i className="fas fa-times"></i>
                                {' '}
                                Cancelar
                            </button>
                        )}
                    </div>

                </form>

                {/* ---- Lista ---- */}
                <div className="banner-list">

                    {banners.length === 0 ? (
                        <p className="banner-empty">
                            Nenhum banner cadastrado. Crie um ao lado.
                        </p>
                    ) : (
                        banners.map(banner => (
                            <div key={banner.id} className="banner-admin-card">

                                <div className="banner-thumb">
                                    <img src={imgSrc(banner.book_image || banner.image)} alt={banner.book_title} />
                                </div>

                                <div className="banner-admin-info">
                                    <h3>{banner.book_title || banner.title}</h3>
                                    <p>{banner.subtitle || '—'}</p>
                                    <span className={`badge ${banner.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                                        {banner.status === 'active' ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>

<div className="banner-admin-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(banner)}>
                                        <i className="fas fa-pen"></i>
                                        {' '}
                                        Editar
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(banner.id)}>
                                        <i className="fas fa-trash"></i>
                                        {' '}
                                        Excluir
                                    </button>
                                </div>

                            </div>
                        ))
                    )}

                </div>

            </div>

        </AdminLayout>
    );

}

export default AdminBanners;

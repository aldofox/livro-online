import { useEffect, useState } from 'react';

import AdminLayout from '../../components/Admin/AdminLayout';
import { showFlash } from '../../utils/flash';
import {
    getAuthors,
    createAuthor,
    updateAuthor,
    deleteAuthor,
    getCategories
} from '../../services/adminService';

import './AdminAuthors.css';

function AdminAuthors() {

    const [authors, setAuthors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    const [editingId, setEditingId] = useState(null);

    const [form, setForm] = useState({
        name: '',
        bio: '',
        category_id: '',
        status: 'active'
    });

    const [photo, setPhoto] = useState(null);

    useEffect(() => {
        loadData();
    }, []);

    async function loadData() {
        try {
            const [authorRes, catRes] = await Promise.all([
                getAuthors(),
                getCategories()
            ]);

            setAuthors(authorRes.authors || []);
            setCategories(catRes.categories || []);
        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os autores.', 'error');
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

    function handlePhoto(e) {
        setPhoto(e.target.files[0]);
    }

    function resetForm() {
        setForm({
            name: '',
            bio: '',
            category_id: '',
            status: 'active'
        });
        setPhoto(null);
        setEditingId(null);
    }

    function handleEdit(author) {
        setEditingId(author.id);
        setForm({
            name: author.name || '',
            bio: author.bio || '',
            category_id: author.category_id || '',
            status: author.status || 'active'
        });
        setPhoto(null);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.name) {
            showFlash('Informe o nome do autor.', 'warning');
            return;
        }

        const formData = new FormData();

        formData.append('name', form.name);
        formData.append('bio', form.bio);
        formData.append('category_id', form.category_id);
        formData.append('status', form.status);

        if (photo) {
            formData.append('photo', photo);
        }

        try {
            if (editingId) {
                await updateAuthor(editingId, formData);
                showFlash('Autor atualizado com sucesso!', 'success');
            } else {
                await createAuthor(formData);
                showFlash('Autor criado com sucesso!', 'success');
            }

            resetForm();
            loadData();
        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao salvar autor.', 'error');
        }
    }

    async function handleDelete(id) {
        if (!window.confirm('Deseja realmente excluir este autor?')) return;

        try {
            await deleteAuthor(id);
            loadData();
        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao excluir autor.', 'error');
        }
    }

    function photoSrc(photo) {
        return photo
            ? `http://localhost:5000/uploads/authors/${photo}`
            : 'https://placehold.co/80x80?text=Sem+Foto';
    }

    if (loading) {
        return (
            <AdminLayout>
                <h2>Carregando autores...</h2>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>

<div className="admin-header">
                <h1>
                    <i className="fas fa-user-pen"></i>
                    {' '}
                    Gerenciar Autores
                </h1>
            </div>

            <div className="author-admin-grid">

                {/* ---- Formulário ---- */}
                <form className="author-form" onSubmit={handleSubmit}>

                    <h2>
                        {editingId ? 'Editar Autor' : 'Novo Autor'}
                    </h2>

                    <label>Nome *</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Nome do autor"
                        required
                    />

                    <label>Biografia</label>
                    <textarea
                        name="bio"
                        value={form.bio}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Breve biografia"
                    />

                    <label>Categoria</label>
                    <select
                        name="category_id"
                        value={form.category_id}
                        onChange={handleChange}
                    >
                        <option value="">Sem categoria</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    <label>Foto</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhoto}
                    />

                    <label>Status</label>
                    <select name="status" value={form.status} onChange={handleChange}>
                        <option value="active">Ativo</option>
                        <option value="inactive">Inativo</option>
                    </select>

<div className="author-form-actions">
                        <button type="submit" className="btn-primary">
                            <i className="fas fa-save"></i>
                            {' '}
                            {editingId ? 'Salvar Alterações' : 'Criar Autor'}
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
                <div className="author-list">

                    {authors.length === 0 ? (
                        <p className="author-empty">
                            Nenhum autor cadastrado. Crie um ao lado.
                        </p>
                    ) : (
                        authors.map(author => (
                            <div key={author.id} className="author-admin-card">

                                <div className="author-thumb">
                                    <img src={photoSrc(author.photo)} alt={author.name} />
                                </div>

                                <div className="author-admin-info">
                                    <h3>{author.name}</h3>
                                    <p>{author.category_name || 'Sem categoria'}</p>
                                    <span className={`badge ${author.status === 'active' ? 'badge-success' : 'badge-danger'}`}>
                                        {author.status === 'active' ? 'Ativo' : 'Inativo'}
                                    </span>
                                </div>

<div className="author-admin-actions">
                                    <button className="btn-edit" onClick={() => handleEdit(author)}>
                                        <i className="fas fa-pen"></i>
                                        {' '}
                                        Editar
                                    </button>
                                    <button className="btn-delete" onClick={() => handleDelete(author.id)}>
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

export default AdminAuthors;

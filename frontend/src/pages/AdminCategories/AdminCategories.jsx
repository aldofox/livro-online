import { useEffect, useState } from 'react';

import AdminLayout from '../../components/Admin/AdminLayout';
import { showFlash } from '../../utils/flash';

import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from '../../services/adminService';

import './AdminCategories.css';

function AdminCategories() {

    const [categories, setCategories] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [form, setForm] =
        useState({
            id: null,
            name: '',
            image: ''
        });

const [isEditing, setIsEditing] =
        useState(false);

    async function loadCategories() {

        try {

            const data =
                await getCategories();

            setCategories(
                data.categories || []
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar as categorias.', 'error');

} finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        (async () => {
            await loadCategories();
        })();

    }, []);

    function handleChange(e) {

        setForm({
            ...form,
            name: e.target.value
        });

    }

    function startEdit(category) {

        setForm({
            id: category.id,
            name: category.name,
            image: category.image || ''
        });

        setIsEditing(true);

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });

    }

    function cancelEdit() {

        setForm({ id: null, name: '', image: '' });

        setIsEditing(false);

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!form.name.trim()) {

            showFlash('Informe o nome da categoria', 'warning');

            return;

        }

        try {

            if (isEditing) {

                await updateCategory(
                    form.id,
                    { name: form.name, image: form.image }
                );

                showFlash('Categoria atualizada com sucesso!', 'success');

            } else {

                await createCategory(
                    { name: form.name, image: form.image }
                );

                showFlash('Categoria criada com sucesso!', 'success');

            }

            cancelEdit();

            loadCategories();

        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao salvar categoria.', 'error');

        }

    }

    async function handleDelete(id) {

        if (
            !window.confirm(
                'Deseja realmente excluir esta categoria?'
            )
        ) {

            return;

        }

        try {

            await deleteCategory(id);

            loadCategories();

        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao excluir categoria.', 'error');

        }

    }

    if (loading) {

        return (
            <AdminLayout>
                <h2>Carregando categorias...</h2>
            </AdminLayout>
        );

    }

    return (

        <AdminLayout>

            <div className="admin-header">

                <h1>
                    <i className="fa-solid fa-tags"></i>
                    {' '}
                    Categorias
                </h1>

            </div>

            <form
                className="category-form"
                onSubmit={handleSubmit}
            >

                <h2>
                    {isEditing
                        ? 'Editar Categoria'
                        : 'Nova Categoria'}
                </h2>

                <input
                    type="text"
                    placeholder="Nome da categoria"
                    value={form.name}
                    onChange={handleChange}
                />

                <div className="form-actions">

<button
                        type="submit"
                        className="btn-primary"
                    >
                        <i className="fas fa-save"></i>
                        {' '}
                        {isEditing
                            ? 'Salvar Alterações'
                            : 'Cadastrar'}
                    </button>

                    {isEditing && (

                        <button
                            type="button"
                            className="btn-delete"
                            onClick={cancelEdit}
                        >
                            <i className="fas fa-times"></i>
                            {' '}
                            Cancelar
                        </button>

                    )}

                </div>

            </form>

            {categories.length === 0 ? (

                <p>
                    Nenhuma categoria cadastrada.
                </p>

            ) : (

                <div className="categories-grid">

                    {categories.map(category => (

                        <div
                            key={category.id}
                            className="category-card"
                        >

                            <h3>
                                {category.name}
                            </h3>

                            <span className="slug">
                                /{category.slug}
                            </span>

                            <span className="book-count">

                                {category.book_count || 0}
                                {' '}
                                livro(s)

                            </span>

                            <div className="cat-actions">

<button
                                    className="btn-edit"
                                    onClick={() =>
                                        startEdit(category)
                                    }
                                >
                                    <i className="fas fa-pen"></i>
                                    {' '}
                                    Editar
                                </button>

                                <button
                                    className="btn-delete"
                                    onClick={() =>
                                        handleDelete(category.id)
                                    }
                                >
                                    <i className="fas fa-trash"></i>
                                    {' '}
                                    Excluir
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </AdminLayout>

    );

}

export default AdminCategories;


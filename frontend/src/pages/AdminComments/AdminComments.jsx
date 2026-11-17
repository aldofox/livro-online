import { useEffect, useState } from 'react';

import AdminLayout from '../../components/Admin/AdminLayout';
import { showFlash } from '../../utils/flash';

import {
    getTestimonials,
    updateTestimonialStatus
} from '../../services/adminService';

import './AdminComments.css';

function AdminComments() {

    const [comments, setComments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    async function loadComments() {

        try {

            const data =
                await getTestimonials();

            setComments(
                data.testimonials || []
            );

        } catch (error) {
            showFlash(error.response?.data?.message || 'Não foi possível carregar os comentários.', 'error');

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        (async () => {
            await loadComments();
        })();

    }, []);

    async function handleStatus(id, status) {

        try {

            await updateTestimonialStatus(
                id,
                status
            );

            setComments(prev =>
                prev.map(c =>
                    c.id === id
                        ? { ...c, status }
                        : c
                )
            );
            showFlash('Status do comentário atualizado.', 'success');

        } catch (error) {
            showFlash(error.response?.data?.message || 'Erro ao atualizar status.', 'error');

        }

    }

    function statusBadge(status) {

        if (status === 'approved') {

            return (
                <span className="badge badge-success">
                    Aprovado
                </span>
            );

        }

        if (status === 'rejected') {

            return (
                <span className="badge badge-danger">
                    Rejeitado
                </span>
            );

        }

        return (
            <span className="badge badge-warning">
                Pendente
            </span>
        );

    }

    function renderStars(rating) {

        const total = 5;

        return (
            <span className="rating-stars">

                {'★'.repeat(rating || 0)}
                {'☆'.repeat(total - (rating || 0))}

            </span>
        );

    }

    if (loading) {

        return (
            <AdminLayout>
                <h2>Carregando comentários...</h2>
            </AdminLayout>
        );

    }

    return (

        <AdminLayout>

            <div className="admin-header">

                <h1>
                    <i className="fa-solid fa-comments"></i>
                    {' '}
                    Comentários
                </h1>

            </div>

            {comments.length === 0 ? (

                <p>
                    Nenhum comentário encontrado.
                </p>

            ) : (

                <div className="comments-list">

                    {comments.map(comment => (

                        <div
                            key={comment.id}
                            className="comment-card"
                        >

                            <div className="comment-header">

                                <div className="comment-author">

                                    <div className="customer-avatar">

                                        {(comment.customer_name || '?')
                                            .split(' ')
                                            .map(part => part[0])
                                            .slice(0, 2)
                                            .join('')
                                            .toUpperCase()}

                                    </div>

                                    <div>

                                        <div className="author-name">
                                            {comment.customer_name || 'Anônimo'}
                                        </div>

                                        <div className="author-email">
                                            {comment.customer_email}
                                        </div>

                                    </div>

                                </div>

                                {renderStars(comment.rating)}

                            </div>

                            <p className="comment-message">
                                {comment.message}
                            </p>

                            <div className="comment-footer">

                                <div className="comment-date">

                                    {new Date(
                                        comment.created_at
                                    ).toLocaleDateString('pt-BR')}

                                    {' '}
                                    {statusBadge(comment.status)}

                                </div>

                                <div className="comment-actions">

                                    {comment.status !== 'approved' && (

                                        <button
                                            className="btn-edit"
                                            onClick={() =>
                                                handleStatus(
                                                    comment.id,
                                                    'approved'
                                                )
                                            }
                                        >
                                            Aprovar
                                        </button>

                                    )}

                                    {comment.status !== 'rejected' && (

                                        <button
                                            className="btn-delete"
                                            onClick={() =>
                                                handleStatus(
                                                    comment.id,
                                                    'rejected'
                                                )
                                            }
                                        >
                                            Rejeitar
                                        </button>

                                    )}

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </AdminLayout>

    );

}

export default AdminComments;

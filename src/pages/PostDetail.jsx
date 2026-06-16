import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { api } from '../api';
import Avatar from '../components/Avatar';
import { UserContext } from '../context';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr + 'Z')) / 1000;
  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return `${Math.floor(diff / 86400)} д назад`;
}

export default function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/posts/${id}`).then(setPost);
  }, [id]);

  if (!post) return (
    <div className="container py-5 text-center" style={{ color: 'var(--tf-muted)' }}>
      <div className="spinner-border" style={{ color: 'var(--tf-accent)' }} />
    </div>
  );

  const isOwner = currentUser && currentUser.id === post.user_id;

  const handleDelete = async () => {
    if (!window.confirm('Удалить объявление?')) return;
    setDeleting(true);
    await api.delete(`/posts/${id}`);
    navigate('/posts');
  };

  return (
    <div className="container py-5" style={{ maxWidth: 720 }}>
      <Link to="/posts" className="tf-nav-link mb-4 d-inline-flex align-items-center gap-2">
        <i className="bi bi-arrow-left" />Назад к объявлениям
      </Link>

      <div className="tf-card p-4 p-md-5 mt-3">
        {/* Author */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <Link to={`/profile/${post.user_id}`}>
            <Avatar name={post.nickname} size="lg" />
          </Link>
          <div>
            <Link to={`/profile/${post.user_id}`} style={{ fontWeight: 700, color: 'var(--tf-text)', textDecoration: 'none', fontSize: '1.1rem' }}>
              {post.nickname}
            </Link>
            <div style={{ color: 'var(--tf-muted)', fontSize: '.82rem' }}>
              {post.user_rank && <><i className="bi bi-trophy-fill me-1" />{post.user_rank} · </>}
              {post.user_role && <><i className="bi bi-person-fill me-1" />{post.user_role} · </>}
              {timeAgo(post.created_at)}
            </div>
          </div>
          {isOwner && (
            <button className="ms-auto btn btn-sm" style={{ background: 'rgba(255,77,109,.1)', border: '1px solid rgba(255,77,109,.3)', color: 'var(--tf-danger)', borderRadius: 8 }}
              onClick={handleDelete} disabled={deleting}>
              <i className="bi bi-trash me-1" />Удалить
            </button>
          )}
        </div>

        <hr className="tf-divider mb-4" />

        {/* Details */}
        <div className="row g-3 mb-4">
          <div className="col-6">
            <div className="tf-label">Игра</div>
            <span className="tf-badge tf-badge-game fs-6">{post.game}</span>
          </div>
          {post.needed_role && (
            <div className="col-6">
              <div className="tf-label">Нужна роль</div>
              <span className="tf-badge tf-badge-role fs-6">{post.needed_role}</span>
            </div>
          )}
          {post.rank && (
            <div className="col-6">
              <div className="tf-label">Ранг</div>
              <span className="tf-badge tf-badge-rank fs-6">{post.rank}</span>
            </div>
          )}
        </div>

        {post.description && (
          <>
            <div className="tf-label">Описание</div>
            <p style={{ color: 'var(--tf-text)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{post.description}</p>
          </>
        )}

        {post.about && (
          <div className="mt-3 p-3" style={{ background: 'var(--tf-surface2)', borderRadius: 12 }}>
            <div className="tf-label mb-1">О себе (автор)</div>
            <p style={{ color: 'var(--tf-muted)', fontSize: '.9rem', marginBottom: 0 }}>{post.about}</p>
          </div>
        )}

        <hr className="tf-divider my-4" />

        <Link to={`/profile/${post.user_id}`} className="btn btn-tf w-100">
          <i className="bi bi-person-fill me-2" />Посмотреть профиль автора
        </Link>
      </div>
    </div>
  );
}

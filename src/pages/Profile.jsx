import { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api';
import Avatar from '../components/Avatar';
import PostCard from '../components/PostCard';
import { UserContext } from '../context';

export default function Profile() {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const [user, setUser] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  useEffect(() => {
    api.get(`/users/${id}`).then(u => {
      setUser(u);
      setLikesCount(u.likes_count || 0);
    });
    if (currentUser) {
      api.get(`/likes/${currentUser.id}`).then(ids => setLiked(ids.includes(Number(id))));
    }
  }, [id, currentUser]);

  const toggleLike = async () => {
    if (!currentUser) { alert('Войди, чтобы ставить лайки'); return; }
    const res = await api.post('/likes', { from_user_id: currentUser.id, to_user_id: Number(id) });
    setLiked(res.liked);
    setLikesCount(c => res.liked ? c + 1 : c - 1);
  };

  if (!user) return (
    <div className="container py-5 text-center">
      <div className="spinner-border" style={{ color: 'var(--tf-accent)' }} />
    </div>
  );

  const isOwn = currentUser && currentUser.id === Number(id);

  return (
    <div className="container py-5" style={{ maxWidth: 760 }}>
      {/* Profile card */}
      <div className="tf-card p-4 p-md-5 mb-4">
        <div className="d-flex align-items-start gap-4 flex-wrap">
          <Avatar name={user.nickname} size="lg" />
          <div className="flex-grow-1">
            <div className="d-flex align-items-center gap-3 flex-wrap mb-2">
              <h1 style={{ fontWeight: 800, fontSize: '1.6rem', marginBottom: 0 }}>{user.nickname}</h1>
              {user.age && <span style={{ color: 'var(--tf-muted)', fontSize: '.9rem' }}>{user.age} лет</span>}
            </div>
            <div className="d-flex flex-wrap gap-2 mb-3">
              {user.game && <span className="tf-badge tf-badge-game">{user.game}</span>}
              {user.rank && <span className="tf-badge tf-badge-rank"><i className="bi bi-trophy-fill me-1" />{user.rank}</span>}
              {user.role && <span className="tf-badge tf-badge-role"><i className="bi bi-person-fill me-1" />{user.role}</span>}
            </div>
            {user.about && <p style={{ color: 'var(--tf-muted)', lineHeight: 1.6, marginBottom: 0 }}>{user.about}</p>}
          </div>
          <div className="d-flex flex-column align-items-end gap-2">
            {!isOwn && (
              <button className={`like-btn${liked ? ' liked' : ''}`} onClick={toggleLike}>
                <i className={`bi bi-heart${liked ? '-fill' : ''}`} />
                {likesCount > 0 && <span>{likesCount}</span>}
              </button>
            )}
            {isOwn && (
              <span style={{ color: 'var(--tf-accent2)', fontSize: '.82rem', fontWeight: 600 }}>
                <i className="bi bi-star-fill me-1" />Ваш профиль
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Posts */}
      {user.posts && user.posts.length > 0 && (
        <div>
          <h2 className="tf-section-title mb-3">
            <i className="bi bi-megaphone-fill me-2" style={{ color: 'var(--tf-accent)' }} />
            Объявления
          </h2>
          <div className="row g-4">
            {user.posts.map(p => (
              <div key={p.id} className="col-md-6">
                <PostCard post={{ ...p, nickname: user.nickname }} />
              </div>
            ))}
          </div>
        </div>
      )}

      {isOwn && (
        <div className="mt-4">
          <Link to="/posts/new" className="btn btn-tf">
            <i className="bi bi-plus-lg me-2" />Опубликовать объявление
          </Link>
        </div>
      )}
    </div>
  );
}

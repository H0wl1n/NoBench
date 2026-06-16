import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import Avatar from '../components/Avatar';
import { UserContext } from '../context';

export default function Players() {
  const { currentUser } = useContext(UserContext);
  const [players, setPlayers] = useState([]);
  const [liked, setLiked] = useState([]);
  const [search, setSearch] = useState('');
  const [gameFilter, setGameFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/users').then(d => { setPlayers(Array.isArray(d) ? d : []); setLoading(false); });
    if (currentUser) api.get(`/likes/${currentUser.id}`).then(setLiked);
  }, [currentUser]);

  const toggleLike = async (toId) => {
    if (!currentUser) { alert('Войди, чтобы ставить лайки'); return; }
    const res = await api.post('/likes', { from_user_id: currentUser.id, to_user_id: toId });
    setLiked(prev => res.liked ? [...prev, toId] : prev.filter(id => id !== toId));
    setPlayers(prev => prev.map(p => p.id === toId
      ? { ...p, likes_count: res.liked ? p.likes_count + 1 : p.likes_count - 1 }
      : p));
  };

  const games = [...new Set(players.map(p => p.game).filter(Boolean))];
  const visible = players.filter(p => {
    if (search && !p.nickname.toLowerCase().includes(search.toLowerCase())) return false;
    if (gameFilter && p.game !== gameFilter) return false;
    return true;
  });

  return (
    <div className="container py-5">
      <h1 className="tf-section-title mb-1">Игроки</h1>
      <p className="tf-section-sub mb-4">Найди интересных тиммейтов</p>

      {/* Search & filter */}
      <div className="tf-card p-4 mb-5">
        <div className="row g-3">
          <div className="col-md-8">
            <label className="tf-label">Поиск по нику</label>
            <input className="form-control tf-input" placeholder="Введи никнейм..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <div className="col-md-4">
            <label className="tf-label">Игра</label>
            <select className="form-select tf-input" value={gameFilter} onChange={e => setGameFilter(e.target.value)}>
              <option value="">Все игры</option>
              {games.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border" style={{ color: 'var(--tf-accent)' }} /></div>
      ) : visible.length === 0 ? (
        <div className="tf-alert"><i className="bi bi-people" style={{ fontSize: '2rem', display: 'block', marginBottom: '.5rem' }} />Игроков не найдено</div>
      ) : (
        <div className="row g-4">
          {visible.map(p => (
            <div key={p.id} className="col-sm-6 col-lg-4">
              <div className="tf-card p-4 h-100">
                <div className="d-flex align-items-start gap-3 mb-3">
                  <Link to={`/profile/${p.id}`}>
                    <Avatar name={p.nickname} />
                  </Link>
                  <div className="flex-grow-1 min-w-0">
                    <Link to={`/profile/${p.id}`} style={{ fontWeight: 700, color: 'var(--tf-text)', textDecoration: 'none', display: 'block', fontSize: '1rem' }}>
                      {p.nickname}
                    </Link>
                    {p.age && <div style={{ color: 'var(--tf-muted)', fontSize: '.78rem' }}>{p.age} лет</div>}
                  </div>
                  {(!currentUser || currentUser.id !== p.id) && (
                    <button className={`like-btn${liked.includes(p.id) ? ' liked' : ''}`} onClick={() => toggleLike(p.id)}>
                      <i className={`bi bi-heart${liked.includes(p.id) ? '-fill' : ''}`} />
                      {p.likes_count > 0 && <span>{p.likes_count}</span>}
                    </button>
                  )}
                </div>

                <div className="d-flex flex-wrap gap-2 mb-3">
                  {p.game && <span className="tf-badge tf-badge-game">{p.game}</span>}
                  {p.rank && <span className="tf-badge tf-badge-rank">{p.rank}</span>}
                  {p.role && <span className="tf-badge tf-badge-role">{p.role}</span>}
                </div>

                {p.about && (
                  <p style={{ color: 'var(--tf-muted)', fontSize: '.84rem', lineHeight: 1.5,
                    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', marginBottom: 0 }}>
                    {p.about}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../api';
import PostCard from '../components/PostCard';

const GAMES  = ['', 'Dota 2', 'Valorant', 'CS2', 'League of Legends', 'Apex Legends', 'Overwatch 2'];
const ROLES  = ['', 'Carry', 'Mid', 'Support', 'Offlane', 'Jungler', 'Duelist', 'Controller', 'Sentinel', 'Initiator', 'Entry', 'Sniper', 'Any'];
const RANKS  = ['', 'Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal',
                'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Immortal', 'Radiant',
                'LEM', 'Global Elite', 'Legend+', 'Archon+', 'Diamond+', 'Platinum+'];

export default function Posts() {
  const [params, setParams] = useSearchParams();
  const [posts, setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);

  const game = params.get('game') || '';
  const rank = params.get('rank') || '';
  const role = params.get('role') || '';

  useEffect(() => {
    setLoading(true);
    const q = new URLSearchParams();
    if (game) q.set('game', game);
    if (rank) q.set('rank', rank);
    if (role) q.set('role', role);
    api.get('/posts?' + q.toString())
      .then(d => setPosts(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }, [game, rank, role]);

  const set = (key, val) => {
    const next = new URLSearchParams(params);
    if (val) next.set(key, val); else next.delete(key);
    setParams(next);
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-start mb-4 flex-wrap gap-3">
        <div>
          <h1 className="tf-section-title">Объявления</h1>
          <p className="tf-section-sub">Найди тиммейтов по своим критериям</p>
        </div>
      </div>

      {/* Filters */}
      <div className="tf-card p-4 mb-5">
        <div className="row g-3 align-items-end">
          <div className="col-md-4">
            <label className="tf-label">Игра</label>
            <select className="form-select tf-input" value={game} onChange={e => set('game', e.target.value)}>
              <option value="">Все игры</option>
              {GAMES.slice(1).map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="tf-label">Роль</label>
            <select className="form-select tf-input" value={role} onChange={e => set('role', e.target.value)}>
              <option value="">Любая роль</option>
              {ROLES.slice(1).map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="col-md-4">
            <label className="tf-label">Ранг</label>
            <select className="form-select tf-input" value={rank} onChange={e => set('rank', e.target.value)}>
              <option value="">Любой ранг</option>
              {RANKS.slice(1).map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          {(game || rank || role) && (
            <div className="col-12">
              <button className="btn btn-tf-outline btn-sm" onClick={() => setParams({})}>
                <i className="bi bi-x-circle me-1" />Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5" style={{ color: 'var(--tf-muted)' }}>
          <div className="spinner-border mb-3" style={{ color: 'var(--tf-accent)' }} />
          <p>Загрузка...</p>
        </div>
      ) : posts.length === 0 ? (
        <div className="tf-alert">
          <i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '.5rem' }} />
          Объявлений не найдено. Попробуй изменить фильтры.
        </div>
      ) : (
        <>
          <p className="tf-section-sub mb-4">Найдено: {posts.length}</p>
          <div className="row g-4">
            {posts.map(p => (
              <div key={p.id} className="col-md-6 col-lg-4">
                <PostCard post={p} />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api';
import { UserContext } from '../context';

const GAMES = ['Dota 2', 'Valorant', 'CS2', 'League of Legends', 'Apex Legends', 'Overwatch 2', 'Fortnite'];
const ROLES = ['Carry', 'Mid', 'Support', 'Offlane', 'Jungler', 'Duelist', 'Controller', 'Sentinel', 'Entry', 'Sniper'];
const RANKS = ['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal',
               'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Radiant', 'LEM', 'Global Elite'];

export default function CreateProfile() {
  const { currentUser, setCurrentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ nickname: '', age: '', game: '', rank: '', role: '', about: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (currentUser) {
    navigate(`/profile/${currentUser.id}`);
    return null;
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.nickname.trim()) { setError('Никнейм обязателен'); return; }
    setLoading(true);
    setError('');
    const res = await api.post('/users', { ...form, age: form.age ? Number(form.age) : null });
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    setCurrentUser(res);
    navigate(`/profile/${res.id}`);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 560 }}>
      <div className="tf-card p-4 p-md-5">
        <div style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>🎮</div>
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', textAlign: 'center', marginBottom: '.4rem' }}>Создать профиль</h1>
        <p style={{ color: 'var(--tf-muted)', textAlign: 'center', marginBottom: '2rem' }}>Один раз — и ты в игре</p>

        {error && (
          <div className="mb-3 p-3" style={{ background: 'rgba(255,77,109,.1)', border: '1px solid rgba(255,77,109,.3)', borderRadius: 10, color: 'var(--tf-danger)', fontSize: '.9rem' }}>
            <i className="bi bi-exclamation-circle me-2" />{error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="tf-label">Никнейм *</label>
            <input className="form-control tf-input" placeholder="Твой игровой ник" value={form.nickname}
              onChange={e => set('nickname', e.target.value)} required />
          </div>

          <div className="mb-3">
            <label className="tf-label">Возраст</label>
            <input type="number" className="form-control tf-input" placeholder="18" min={12} max={60}
              value={form.age} onChange={e => set('age', e.target.value)} />
          </div>

          <div className="mb-3">
            <label className="tf-label">Любимая игра</label>
            <select className="form-select tf-input" value={form.game} onChange={e => set('game', e.target.value)}>
              <option value="">Выбери игру</option>
              {GAMES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="tf-label">Ранг</label>
              <select className="form-select tf-input" value={form.rank} onChange={e => set('rank', e.target.value)}>
                <option value="">Выбери ранг</option>
                {RANKS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-6">
              <label className="tf-label">Роль</label>
              <select className="form-select tf-input" value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="">Выбери роль</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="tf-label">О себе</label>
            <textarea className="form-control tf-input" rows={4}
              placeholder="Расскажи немного о себе: как играешь, что ищешь в тиммейтах..."
              value={form.about} onChange={e => set('about', e.target.value)} />
          </div>

          <button type="submit" className="btn btn-tf w-100 py-3" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-check2-circle me-2" />}
            Создать профиль
          </button>
        </form>
      </div>
    </div>
  );
}

import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api';
import { UserContext } from '../context';

const GAMES = ['Dota 2', 'Valorant', 'CS2', 'League of Legends', 'Apex Legends', 'Overwatch 2', 'Fortnite'];
const ROLES = ['Carry', 'Mid', 'Support', 'Offlane', 'Jungler', 'Duelist', 'Controller', 'Sentinel', 'Entry', 'Sniper', 'Any'];
const RANKS = ['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal',
               'Iron', 'Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ascendant', 'Radiant',
               'LEM', 'Global Elite', 'Legend+', 'Archon+', 'Diamond+', 'Platinum+'];

export default function CreatePost() {
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ game: '', needed_role: '', rank: '', description: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!currentUser) {
    return (
      <div className="container py-5 text-center" style={{ maxWidth: 480 }}>
        <div className="tf-card p-5">
          <div style={{ fontSize: '2.5rem' }}>🔒</div>
          <h3 style={{ fontWeight: 700, marginTop: '1rem' }}>Нужен профиль</h3>
          <p style={{ color: 'var(--tf-muted)', margin: '1rem 0' }}>Чтобы публиковать объявления, создай профиль.</p>
          <Link to="/register" className="btn btn-tf">Создать профиль</Link>
        </div>
      </div>
    );
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.game) { setError('Выбери игру'); return; }
    setLoading(true);
    setError('');
    const res = await api.post('/posts', { ...form, user_id: currentUser.id });
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    navigate(`/posts/${res.id}`);
  };

  return (
    <div className="container py-5" style={{ maxWidth: 620 }}>
      <Link to="/posts" className="tf-nav-link mb-4 d-inline-flex align-items-center gap-2">
        <i className="bi bi-arrow-left" />Назад
      </Link>

      <div className="tf-card p-4 p-md-5 mt-3">
        <h1 style={{ fontWeight: 800, fontSize: '1.5rem', marginBottom: '.4rem' }}>Новое объявление</h1>
        <p style={{ color: 'var(--tf-muted)', marginBottom: '2rem' }}>Расскажи, кого ищешь</p>

        {error && (
          <div className="mb-3 p-3" style={{ background: 'rgba(255,77,109,.1)', border: '1px solid rgba(255,77,109,.3)', borderRadius: 10, color: 'var(--tf-danger)', fontSize: '.9rem' }}>
            <i className="bi bi-exclamation-circle me-2" />{error}
          </div>
        )}

        <form onSubmit={submit}>
          <div className="mb-3">
            <label className="tf-label">Игра *</label>
            <select className="form-select tf-input" value={form.game} onChange={e => set('game', e.target.value)} required>
              <option value="">Выбери игру</option>
              {GAMES.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          <div className="row g-3 mb-3">
            <div className="col-6">
              <label className="tf-label">Нужна роль</label>
              <select className="form-select tf-input" value={form.needed_role} onChange={e => set('needed_role', e.target.value)}>
                <option value="">Любая</option>
                {ROLES.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
            <div className="col-6">
              <label className="tf-label">Минимальный ранг</label>
              <select className="form-select tf-input" value={form.rank} onChange={e => set('rank', e.target.value)}>
                <option value="">Любой</option>
                {RANKS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-4">
            <label className="tf-label">Описание</label>
            <textarea
              className="form-control tf-input"
              rows={5}
              placeholder="Расскажи подробнее: когда играешь, что ждёшь от напарника, условия..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-tf w-100" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2" /> : <i className="bi bi-send-fill me-2" />}
            Опубликовать
          </button>
        </form>
      </div>
    </div>
  );
}

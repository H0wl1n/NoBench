import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api';
import PostCard from '../components/PostCard';

const GAMES = [
  { name: 'Dota 2',           icon: '🛡️', color: '#cc3300' },
  { name: 'Valorant',         icon: '🔫', color: '#ff4655' },
  { name: 'CS2',              icon: '💣', color: '#f0a500' },
  { name: 'League of Legends',icon: '⚔️', color: '#c89b3c' },
  { name: 'Apex Legends',     icon: '🦅', color: '#cd4820' },
  { name: 'Overwatch 2',      icon: '🦸', color: '#f99e1a' },
];

const STATS = [
  { label: 'Игроков зарегистрировано', value: '1 200+', icon: 'bi-people-fill' },
  { label: 'Активных объявлений',      value: '340+',   icon: 'bi-megaphone-fill' },
  { label: 'Игр поддерживается',       value: '7',      icon: 'bi-controller' },
];

export default function Home() {
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/posts').then(data => setRecent(Array.isArray(data) ? data.slice(0, 3) : []));
  }, []);

  return (
    <>
      {/* Hero */}
      <section className="tf-hero">
        <div className="container">
          <h1>Найди своих тиммейтов<br />и побеждай вместе</h1>
          <p>TeamFinder объединяет игроков, которые ищут напарников для совместной игры в любимые игры.</p>
          <div className="d-flex gap-3 justify-content-center mt-4 flex-wrap">
            <Link to="/posts" className="btn btn-tf btn-lg px-5">
              <i className="bi bi-search me-2" />Найти команду
            </Link>
            <Link to="/register" className="btn btn-tf-outline btn-lg px-5">
              Создать профиль
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-4" style={{ background: 'var(--tf-surface)', borderBottom: '1px solid var(--tf-border)' }}>
        <div className="container">
          <div className="row g-0 text-center">
            {STATS.map(s => (
              <div key={s.label} className="col-4">
                <div className="py-3">
                  <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--tf-accent2)' }}>{s.value}</div>
                  <div style={{ fontSize: '.8rem', color: 'var(--tf-muted)', marginTop: '.2rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Games */}
      <section className="py-5">
        <div className="container">
          <h2 className="tf-section-title mb-1">Популярные игры</h2>
          <p className="tf-section-sub mb-4">Выбери игру и найди тиммейтов</p>
          <div className="row g-3">
            {GAMES.map(g => (
              <div key={g.name} className="col-6 col-md-4 col-lg-2">
                <Link to={`/posts?game=${encodeURIComponent(g.name)}`} className="game-chip">
                  <span style={{ fontSize: '1.4rem' }}>{g.icon}</span>
                  <span>{g.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent posts */}
      <section className="py-5" style={{ background: 'var(--tf-surface)' }}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="tf-section-title mb-0">Свежие объявления</h2>
              <p className="tf-section-sub mb-0">Игроки ищут тиммейтов прямо сейчас</p>
            </div>
            <Link to="/posts" className="btn btn-tf-outline btn-sm">Все объявления</Link>
          </div>
          <div className="row g-4">
            {recent.map(p => (
              <div key={p.id} className="col-md-4">
                <PostCard post={p} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-5">
        <div className="container text-center">
          <div className="tf-card p-5 d-inline-block w-100" style={{ maxWidth: 640 }}>
            <div style={{ fontSize: '2.5rem' }}>🚀</div>
            <h3 style={{ fontWeight: 800, marginTop: '1rem' }}>Готов найти команду?</h3>
            <p style={{ color: 'var(--tf-muted)', margin: '1rem 0 1.5rem' }}>
              Создай профиль, опубликуй объявление и найди идеальных напарников.
            </p>
            <Link to="/posts/new" className="btn btn-tf btn-lg px-5">Опубликовать объявление</Link>
          </div>
        </div>
      </section>
    </>
  );
}

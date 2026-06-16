import { Link, NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../context';

export default function Navbar() {
  const { currentUser, setCurrentUser } = useContext(UserContext);

  return (
    <nav className="tf-navbar">
      <div className="container d-flex align-items-center gap-4">
        <Link to="/" className="tf-logo me-auto">🎮 TeamFinder</Link>

        <NavLink to="/posts" className={({ isActive }) => 'tf-nav-link' + (isActive ? ' active' : '')}>
          Объявления
        </NavLink>
        <NavLink to="/players" className={({ isActive }) => 'tf-nav-link' + (isActive ? ' active' : '')}>
          Игроки
        </NavLink>

        {currentUser ? (
          <div className="d-flex align-items-center gap-3">
            <Link to="/posts/new" className="btn btn-tf btn-sm">
              <i className="bi bi-plus-lg me-1" />Создать
            </Link>
            <Link to={`/profile/${currentUser.id}`} className="tf-nav-link d-flex align-items-center gap-2">
              <span
                className="tf-avatar"
                style={{ width: 32, height: 32, fontSize: '.85rem', background: avatarGrad(currentUser.nickname) }}
              >
                {currentUser.nickname[0].toUpperCase()}
              </span>
              <span>{currentUser.nickname}</span>
            </Link>
            <button
              className="tf-nav-link border-0 bg-transparent"
              onClick={() => setCurrentUser(null)}
              title="Выйти"
            >
              <i className="bi bi-box-arrow-right" />
            </button>
          </div>
        ) : (
          <Link to="/register" className="btn btn-tf btn-sm">Войти / Создать профиль</Link>
        )}
      </div>
    </nav>
  );
}

function avatarGrad(name) {
  const colors = [
    'linear-gradient(135deg,#6c63ff,#a855f7)',
    'linear-gradient(135deg,#00d4aa,#0891b2)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#ec4899,#8b5cf6)',
    'linear-gradient(135deg,#10b981,#3b82f6)',
  ];
  return colors[name.charCodeAt(0) % colors.length];
}

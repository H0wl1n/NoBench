import { Link } from 'react-router-dom';
import Avatar from './Avatar';

const GAME_ICONS = {
  'Dota 2': '🛡️',
  'Valorant': '🔫',
  'CS2': '💣',
  'League of Legends': '⚔️',
  'Apex Legends': '🦅',
  'Fortnite': '🏗️',
  'Overwatch 2': '🦸',
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr + 'Z')) / 1000;
  if (diff < 60) return 'только что';
  if (diff < 3600) return `${Math.floor(diff / 60)} мин назад`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} ч назад`;
  return `${Math.floor(diff / 86400)} д назад`;
}

export default function PostCard({ post }) {
  return (
    <Link to={`/posts/${post.id}`} className="text-decoration-none">
      <div className="tf-card p-4 h-100">
        <div className="d-flex align-items-center gap-3 mb-3">
          <Avatar name={post.nickname} />
          <div>
            <div className="fw-600" style={{ color: 'var(--tf-text)', fontWeight: 600 }}>{post.nickname}</div>
            <div style={{ fontSize: '.78rem', color: 'var(--tf-muted)' }}>{timeAgo(post.created_at)}</div>
          </div>
        </div>

        <div className="d-flex flex-wrap gap-2 mb-3">
          <span className="tf-badge tf-badge-game">
            {GAME_ICONS[post.game] || '🎮'} {post.game}
          </span>
          {post.needed_role && (
            <span className="tf-badge tf-badge-role">
              <i className="bi bi-person-fill me-1" />{post.needed_role}
            </span>
          )}
          {post.rank && (
            <span className="tf-badge tf-badge-rank">
              <i className="bi bi-trophy-fill me-1" />{post.rank}
            </span>
          )}
        </div>

        {post.description && (
          <p style={{ color: 'var(--tf-muted)', fontSize: '.88rem', lineHeight: 1.5,
            display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {post.description}
          </p>
        )}

        <div className="mt-3 pt-2" style={{ borderTop: '1px solid var(--tf-border)' }}>
          <span className="btn btn-tf-outline btn-sm w-100" style={{ pointerEvents: 'none' }}>
            <i className="bi bi-chat-dots-fill me-2" />Связаться
          </span>
        </div>
      </div>
    </Link>
  );
}

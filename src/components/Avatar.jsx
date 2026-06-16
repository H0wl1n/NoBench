const GRADS = [
  'linear-gradient(135deg,#6c63ff,#a855f7)',
  'linear-gradient(135deg,#00d4aa,#0891b2)',
  'linear-gradient(135deg,#f59e0b,#ef4444)',
  'linear-gradient(135deg,#ec4899,#8b5cf6)',
  'linear-gradient(135deg,#10b981,#3b82f6)',
];

export default function Avatar({ name, size = 'md' }) {
  const bg = GRADS[(name || 'A').charCodeAt(0) % GRADS.length];
  const cls = `tf-avatar${size === 'lg' ? ' tf-avatar-lg' : ''}`;
  return (
    <div className={cls} style={{ background: bg }}>
      {(name || '?')[0].toUpperCase()}
    </div>
  );
}

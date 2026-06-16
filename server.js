const express = require('express');
const cors = require('cors');
const db = require('./database');

const app = express();
app.use(cors());
app.use(express.json());

// ── USERS ──────────────────────────────────────────────
app.get('/api/users', (req, res) => {
  const users = db.prepare(`
    SELECT u.*, COUNT(l.id) as likes_count
    FROM users u
    LEFT JOIN likes l ON l.to_user_id = u.id
    GROUP BY u.id
    ORDER BY u.created_at DESC
  `).all();
  res.json(users);
});

app.get('/api/users/:id', (req, res) => {
  const user = db.prepare(`
    SELECT u.*, COUNT(l.id) as likes_count
    FROM users u
    LEFT JOIN likes l ON l.to_user_id = u.id
    WHERE u.id = ?
    GROUP BY u.id
  `).get(req.params.id);
  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });
  const posts = db.prepare('SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC').all(req.params.id);
  res.json({ ...user, posts });
});

app.post('/api/users', (req, res) => {
  const { nickname, age, game, rank, role, about } = req.body;
  if (!nickname) return res.status(400).json({ error: 'Никнейм обязателен' });
  try {
    const result = db.prepare(
      'INSERT INTO users (nickname, age, game, rank, role, about) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(nickname, age || null, game || null, rank || null, role || null, about || null);
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(user);
  } catch (e) {
    if (e.message.includes('UNIQUE')) return res.status(400).json({ error: 'Никнейм уже занят' });
    res.status(500).json({ error: 'Ошибка сервера' });
  }
});

// ── POSTS ──────────────────────────────────────────────
app.get('/api/posts', (req, res) => {
  const { game, rank, role } = req.query;
  let sql = `
    SELECT p.*, u.nickname, u.rank as user_rank, u.role as user_role
    FROM posts p
    JOIN users u ON u.id = p.user_id
    WHERE 1=1
  `;
  const params = [];
  if (game)  { sql += ' AND p.game = ?';        params.push(game); }
  if (rank)  { sql += ' AND p.rank = ?';         params.push(rank); }
  if (role)  { sql += ' AND p.needed_role = ?';  params.push(role); }
  sql += ' ORDER BY p.created_at DESC';
  res.json(db.prepare(sql).all(...params));
});

app.get('/api/posts/:id', (req, res) => {
  const post = db.prepare(`
    SELECT p.*, u.nickname, u.age, u.rank as user_rank, u.role as user_role, u.about, u.game as user_game
    FROM posts p JOIN users u ON u.id = p.user_id
    WHERE p.id = ?
  `).get(req.params.id);
  if (!post) return res.status(404).json({ error: 'Объявление не найдено' });
  res.json(post);
});

app.post('/api/posts', (req, res) => {
  const { user_id, game, needed_role, rank, description } = req.body;
  if (!user_id || !game) return res.status(400).json({ error: 'user_id и game обязательны' });
  const result = db.prepare(
    'INSERT INTO posts (user_id, game, needed_role, rank, description) VALUES (?, ?, ?, ?, ?)'
  ).run(user_id, game, needed_role || null, rank || null, description || null);
  const post = db.prepare('SELECT * FROM posts WHERE id = ?').get(result.lastInsertRowid);
  res.status(201).json(post);
});

app.delete('/api/posts/:id', (req, res) => {
  db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
  res.json({ ok: true });
});

// ── LIKES ──────────────────────────────────────────────
app.post('/api/likes', (req, res) => {
  const { from_user_id, to_user_id } = req.body;
  if (from_user_id === to_user_id) return res.status(400).json({ error: 'Нельзя лайкнуть себя' });
  try {
    db.prepare('INSERT INTO likes (from_user_id, to_user_id) VALUES (?, ?)').run(from_user_id, to_user_id);
    res.json({ liked: true });
  } catch {
    db.prepare('DELETE FROM likes WHERE from_user_id = ? AND to_user_id = ?').run(from_user_id, to_user_id);
    res.json({ liked: false });
  }
});

app.get('/api/likes/:userId', (req, res) => {
  const likes = db.prepare('SELECT to_user_id FROM likes WHERE from_user_id = ?').all(req.params.userId);
  res.json(likes.map(l => l.to_user_id));
});

// ── META ───────────────────────────────────────────────
app.get('/api/games', (_req, res) => {
  res.json(['Dota 2', 'Valorant', 'CS2', 'League of Legends', 'Apex Legends', 'Fortnite', 'Overwatch 2']);
});

const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => console.log(`TeamFinder API → http://localhost:${PORT}`));
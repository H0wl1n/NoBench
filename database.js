const { DatabaseSync } = require('node:sqlite');
const path = require('path');

const db = new DatabaseSync(path.join(__dirname, 'teamfinder.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nickname TEXT NOT NULL UNIQUE,
    age INTEGER,
    game TEXT,
    rank TEXT,
    role TEXT,
    about TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    game TEXT NOT NULL,
    needed_role TEXT,
    rank TEXT,
    description TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    from_user_id INTEGER NOT NULL,
    to_user_id INTEGER NOT NULL,
    UNIQUE(from_user_id, to_user_id),
    FOREIGN KEY (from_user_id) REFERENCES users(id),
    FOREIGN KEY (to_user_id) REFERENCES users(id)
  );
`);

// Seed demo data if empty
const userCount = db.prepare('SELECT COUNT(*) as c FROM users').get().c;
if (userCount === 0) {
  const insertUser = db.prepare(
    'INSERT INTO users (nickname, age, game, rank, role, about) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const insertPost = db.prepare(
    'INSERT INTO posts (user_id, game, needed_role, rank, description) VALUES (?, ?, ?, ?, ?)'
  );

  const u1 = insertUser.run('Shadow_Pro', 23, 'Dota 2', 'Ancient 3', 'Mid', 'Играю каждый день, ищу стабильную команду для рейтинга. Тильт не наклоняю.').lastInsertRowid;
  const u2 = insertUser.run('IceQueen', 20, 'Valorant', 'Diamond', 'Controller', 'Люблю поддержку и тактическую игру. Дискорд обязателен.').lastInsertRowid;
  const u3 = insertUser.run('FrostByte', 25, 'CS2', 'Global Elite', 'Entry', 'Ищу 5ку для фейсита. Играю серьёзно.').lastInsertRowid;
  const u4 = insertUser.run('NightOwl', 18, 'Dota 2', 'Legend', 'Carry', 'Катаю по ночам, нужен нормальный саппорт.').lastInsertRowid;
  const u5 = insertUser.run('StormRider', 22, 'Valorant', 'Platinum', 'Duelist', 'Хочу дуо в рейтинг, умею играть агрессивно.').lastInsertRowid;

  insertPost.run(u1, 'Dota 2', 'Support', 'Legend+', 'Собираем стак на вечер, нужен опытный саппорт 5-й позиции. Дискорд обязателен.');
  insertPost.run(u2, 'Valorant', 'Duelist', 'Diamond+', 'Ищем дуелиста для рейтинга. Умеем играть в команде, без токсиков.');
  insertPost.run(u3, 'CS2', 'Any', 'LEM+', 'Набираем команду на фейсит уровень 8+. Играем вечером по будням.');
  insertPost.run(u4, 'Dota 2', 'Support', 'Archon+', 'Нужен саппорт 4-5 позиции, без токсиков, с дискордом.');
  insertPost.run(u5, 'Valorant', 'Controller', 'Platinum+', 'Ищу контроллера для дуо рейтинга. Умею делать клатчи.');
}

module.exports = db;

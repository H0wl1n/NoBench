const BASE = 'http://193.22.242.2:3001/api'


export const api = {
  get: (path) => fetch(BASE + path).then(r => r.json()),
  post: (path, body) => fetch(BASE + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).then(r => r.json()),
  delete: (path) => fetch(BASE + path, { method: 'DELETE' }).then(r => r.json()),
};

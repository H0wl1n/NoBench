1. Установить Node.js (LTS) с nodejs.org, если ещё не установлен.

2. Клонировать репозиторий:
   git clone https://github.com/твой_username/teamfinder.git
   cd teamfinder

3. Установить и запустить backend:
   cd backend
   npm install
   npm run dev
   → сервер поднимется на http://localhost:3001
   (база данных teamfinder.db создастся автоматически при первом запуске,
   с тестовыми данными)

4. В отдельном терминале установить и запустить frontend:
   cd frontend
   npm install
   npm run dev
   → приложение откроется на http://localhost:3000

5. Открыть в браузере http://localhost:3000
   Запросы с фронтенда на /api автоматически перенаправляются
   на backend (настроено через proxy в vite.config.js),
   поэтому отдельно указывать адрес бэкенда не нужно.

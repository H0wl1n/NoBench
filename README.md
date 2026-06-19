АРХИТЕКТУРА И ТА ЖЕ ИНСТРУКЦИЯ ЕСТЬ В ФАЙЛЕ README.me КОТОРЫЙ НАХОДИТЬСЯ В NoBench.Zip
1. Скачать файл NoBench.Zip разархировать в удобную папку и открыть ее в VS Code
2. Установить Node.js (LTS) с nodejs.org, если ещё не установлен.

3. Клонировать репозиторий:
   git clone https://github.com/H0wl1n/teamfinder.git
   cd teamfinder

4. Установить и запустить backend:
   cd backend
   npm install
   npm run dev
   → сервер поднимется на http://localhost:3001
   (база данных teamfinder.db создастся автоматически при первом запуске,
   с тестовыми данными)

5. В отдельном терминале установить и запустить frontend:
   cd frontend
   npm install
   npm run dev
   → приложение откроется на http://localhost:3000

6. Открыть в браузере http://localhost:3001
   Запросы с фронтенда на /api автоматически перенаправляются
   на backend (настроено через proxy в vite.config.js),
   поэтому отдельно указывать адрес бэкенда не нужно.


   

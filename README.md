инструкция
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

6. Открыть в браузере http://localhost:3000
   Запросы с фронтенда на /api автоматически перенаправляются
   на backend (настроено через proxy в vite.config.js),
   поэтому отдельно указывать адрес бэкенда не нужно.
   
   Структура каталогов
teamfinder/
├── frontend/                  # React-приложение (UI)
│   ├── src/
│   │   ├── components/        # переиспользуемые блоки интерфейса
│   │   │   ├── Navbar.jsx     # навигация по страницам
│   │   │   ├── Footer.jsx     # подвал
│   │   │   ├── Avatar.jsx     # аватар пользователя
│   │   │   └── PostCard.jsx   # карточка объявления в списке
│   │   ├── pages/              # страницы приложения
│   │   │   ├── Home.jsx
│   │   │   ├── Posts.jsx       # список объявлений
│   │   │   ├── PostDetail.jsx  # одно объявление
│   │   │   ├── CreatePost.jsx  # форма создания объявления
│   │   │   ├── Players.jsx     # список игроков
│   │   │   ├── Profile.jsx     # профиль игрока
│   │   │   └── CreateProfile.jsx
│   │   ├── api.js              # обёртка над fetch для запросов к /api
│   │   ├── context.js          # хранение текущего пользователя
│   │   ├── App.jsx             # роутинг между страницами
│   │   └── main.jsx             # точка входа React
│   ├── index.html
│   ├── vite.config.js          # настройки Vite + proxy на бэкенд
│   └── package.json
│
├── backend/                    # сервер
│   ├── server.js               # Express, все API-роуты
│   ├── database.js             # подключение к SQLite + схема таблиц
│   ├── teamfinder.db           # файл базы данных (создаётся сам, в .gitignore)
│   └── package.json
│
├── .gitignore
└── README.md

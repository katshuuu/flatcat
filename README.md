# FlatCat — Лежанки-домики для кошек

## Описание

«FlatCat» — онлайн-магазин лежанок-домиков для кошек, где каждый питомец получает персональное укрытие с характером. Пользователи выбирают линейку (ушки, когтеточка, фрукт, кубик), текстуру «кошачьей шерсти», окрас и оформляют заказ через конструктор. Система включает каталог, авторизацию с RBAC, GraphQL API (книги/авторы) и асинхронную обработку задач через RabbitMQ.

### Функциональность

- **Конструктор домиков** — шаблон, текстура, окрас, ручная роспись, вышивка имени, доставка
- **Каталог** — 4 линейки: ушки, когтеточки, фруктовые, кубик
- **Авторизация** — JWT, роли admin / manager / customer
- **Заказы** — клиенты видят свои заказы, менеджеры управляют статусами
- **GraphQL** — каталог книг и авторов (учебное задание)
- **RabbitMQ** — очередь задач, retry, DLQ, два воркера

## Стек технологий

- Frontend: React
- Backend: Node.js, Express
- База данных: PostgreSQL
- Авторизация: JWT
- Контейнеризация: Docker, Docker Compose

## Запуск проекта

### Требования

- Docker и Docker Compose

### Шаги

1. Клонировать репозиторий: `git clone https://github.com/katshuuu/flatcat.git`
2. Скопировать файл переменных окружения: `cp .env.example .env`
3. Заполнить `.env` (Supabase URL, ключи, JWT-секрет)
4. Применить миграцию в Supabase: `supabase/migrations/20260520181549_001_initial_schema.sql`
5. Запустить все сервисы: `docker compose up --build`
6. Открыть в браузере: http://localhost:3000

## Переменные окружения

| Переменная | Описание |
|---|---|
| `SUPABASE_URL` | URL проекта Supabase |
| `SUPABASE_ANON_KEY` | Публичный ключ Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role ключ |
| `JWT_SECRET` | Секрет для JWT |
| `JWT_EXPIRES_IN` | Срок токена (по умолчанию 24h) |
| `RABBITMQ_URL` | URL RabbitMQ |
| `PORT` | Порт backend (4000) |
| `NODE_ENV` | development / production |

## API Endpoints

### REST API

| Метод | Путь | Описание | Доступ |
|---|---|---|---|
| POST | `/api/auth/register` | Регистрация | Публичный |
| POST | `/api/auth/login` | Вход | Публичный |
| GET | `/api/auth/me` | Текущий пользователь | Авторизованный |
| GET | `/api/products` | Каталог домиков | Публичный |
| GET | `/api/orders/my` | Мои заказы | Авторизованный |
| POST | `/api/orders` | Заказ кастомного домика | Авторизованный |
| PATCH | `/api/orders/:id/status` | Статус заказа | Admin, Manager |
| POST | `/api/tasks` | Асинхронная задача | Авторизованный |
| POST | `/tasks` | Асинхронная задача (алиас по ТЗ) | Авторизованный |

### GraphQL API

Endpoint: `/graphql` — Query: `books`, `book`, `authors`; Mutation: `createBook`, `createAuthor`

## RabbitMQ

- Producer: `POST /tasks` или `POST /api/tasks` (тело: `{ "type": "email", "payload": {...} }`)
- Consumer: 2 воркера в docker-compose
- Retry: 3 попытки, экспоненциальная задержка
- DLQ: `tasks_dlq`

## Запуск тестов

```bash
cd backend && npm test && npm run test:coverage
cd frontend && npm test && npm run test:coverage
```

## Анализ бандла

После `npm run build` в `frontend/` создаётся `bundle-report.html`.

## Скриншоты для отчёта

Инструкция и список файлов: [docs/screenshots/README.md](docs/screenshots/README.md).

Положите PNG/JPG в папку `docs/screenshots/` (бандл, GraphQL Sandbox, при необходимости RabbitMQ).

## Репозиторий

https://github.com/katshuuu/flatcat

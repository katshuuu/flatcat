# Скриншоты для отчёта по курсу

Положите сюда изображения (PNG или JPG), которые приложите к отчёту или README.

## Обязательные скриншоты

### 1. Анализ бандла (React / Vite)

**Файл:** `01-bundle-report.png`

**Как получить:**

```bash
cd frontend
npm run build
open bundle-report.html
```

Сделайте скриншот treemap из `rollup-plugin-visualizer` (размеры чанков `vendor`, страниц и т.д.).

---

### 2. GraphQL — Apollo Sandbox (минимум 3 запроса)

**Файлы:**

| Файл | Запрос |
|------|--------|
| `02-graphql-books.png` | Query: все книги |
| `03-graphql-book.png` | Query: одна книга по `id` |
| `04-graphql-authors.png` | Query: все авторы |
| `05-graphql-mutation.png` | Mutation: `createAuthor` или `createBook` (по желанию) |

**Как получить:**

1. Запустите backend: `cd backend && npm run dev`
2. Откройте: http://localhost:4000/graphql
3. Выполните запросы и снимите экран с результатом.

**Примеры запросов:**

```graphql
query {
  books { id title author { name } }
}
```

```graphql
query ($id: ID!) {
  book(id: $id) { id title isbn year author { name bio } }
}
```

```graphql
query {
  authors { id name books { title } }
}
```

```graphql
mutation {
  createAuthor(name: "Тест Автор", bio: "Описание") {
    id name
  }
}
```

---

### 3. RabbitMQ (по желанию, для отчёта)

**Файлы:**

| Файл | Что показать |
|------|----------------|
| `06-rabbitmq-management.png` | Очередь `tasks_queue` в UI RabbitMQ (http://localhost:15672, guest/guest) |
| `07-tasks-api-response.png` | Ответ `POST /tasks` или `POST /api/tasks` (201 + тело задачи) |

**Пример запроса (нужен JWT после логина):**

```bash
curl -X POST http://localhost:4000/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"type":"email","payload":{"to":"cat@flatcat.ru","subject":"Привет"}}'
```

---

## Именование файлов

- Только латиница, цифры и дефис: `01-bundle-report.png`
- Разрешение: не меньше 1280 px по ширине для читаемости текста
- Не коммитьте секреты: токены, ключи Supabase, пароли

## Проверка перед сдачей

- [ ] `01-bundle-report.png` — отчёт бандла
- [ ] `02-graphql-books.png` — Query books
- [ ] `03-graphql-book.png` — Query book
- [ ] `04-graphql-authors.png` — Query authors
- [ ] `05-graphql-mutation.png` — Mutation (рекомендуется)
- [ ] Скриншоты открываются в Markdown-превью отчёта

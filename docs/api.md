# api

все изменяющие запросы принимают только `application/json`. браузерные cross origin запросы отклоняются.

## получить proof-of-work challenge

`GET /api/challenge`

```json
{
  "challenge": "timestamp.difficulty.random.signature",
  "difficulty": 16
}
```
клиент перебирает десятичный nonce, пока sha-256 от строки challenge:nonce не будет иметь нужное число ведущих нулевых битов.
челендж действует пять минут и используется один раз

## создать публикацию

`POST /api/posts`

```json
{
  "title": "заголовок",
  "content": "текст",
  "challenge": "значение из /api/challenge",
  "nonce": "найденное число"
}
```

успешный ответ имеет статус `201`:

```json
{
  "id": "aB3dE5fG7hJ9",
  "path": "/aB3dE5fG7hJ9"
}
```

ограничения на заголовок 120 символов, на контент 50000 символов.

## прочитать публикацию

`GET /api/posts/:id`

```json
{
  "id": "aB3dE5fG7hJ9",
  "title": "заголовок",
  "html": "<p>очищенный html</p>",
  "createdOn": "2026-03-01"
}
```

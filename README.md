# Тестовое задание для разработчика Node.js
Ссылка на API - https://api.evoaccessbrand.site/api

## Действия с пользователем 
ссылка на API - https://api.evoaccessbrand.site/api/u

### Регистрация
> POST /regUser
Формат отправки данных
```
{
  name: STRING, 
  email: STRING, (с проверкой на @)
  password: STRING
}
```
Ответ
```
{
  "message": "User created successfully"
}
```
> POST /logUser
Формат отправки данных
```
{
  email: STRING, (с проверкой на @)
  password: STRING
}
```
Ответ
```
JWT TOKEN
```

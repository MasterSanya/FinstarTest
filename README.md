# Finstar Test Project

## Описание

Этот проект представляет собой полнофункциональное веб-приложение, включающее серверную и клиентскую части.

## Структура проекта

```
FinstarTest/
├── FT-Client/
└── FT-Server/
```

## Установка

### Клонирование репозитория

```sh
git clone https://github.com/MasterSanya/FinstarTest.git
cd FinstarTest
```

### Запуск серверной части

Перейдите в директорию серверной части и выполните следующие команды:

```sh
cd FT-Server
dotnet restore
dotnet build
dotnet run
```

### Запуск клиентской части

Перейдите в директорию клиентской части и выполните следующие команды:

```sh
cd FT-Client
npm install
npm start
```

## Использование

После запуска серверной части сервер будет доступен по адресу `https://localhost:7212` (или `http://localhost:5047`).

Клиентская часть будет доступна по адресу `http://localhost:3000`.

## Контакты

Если у вас возникли вопросы, пожалуйста, свяжитесь со мной по адресу mr.sanya.sh@gmail.com.

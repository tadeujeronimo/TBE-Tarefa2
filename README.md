# TBE-Tarefa2

Projeto full-stack do **Sistema de Monitorias** (IF Sudeste MG), organizado da seguinte forma:

```
TBE-Tarefa2/
├── backend/    # API REST (Node.js + TypeScript + Express 5 + Prisma + Zod + PostgreSQL/Docker) – Tarefa 2
└── frontend/   # Interface (React + TypeScript + Vite + Bootstrap 5) – evolução da Tarefa 4 de Front-End
```

- O **backend** implementa o CRUD completo de editais, com validação (Zod), tratamento de erros (400/404/500) e CORS. Detalhes de endpoints, payloads e testes: [`backend/README.md`](backend/README.md).
- O **frontend** lista os editais consumindo a API. Detalhes: [`frontend/README.md`](frontend/README.md).

## O que vem da API e o que é local

| Funcionalidade                             | Origem                                   |
| ------------------------------------------ | ---------------------------------------- |
| Listagem de editais                        | **API** (`GET /api/editais`)             |
| CRUD completo (GET, POST, PUT, DELETE)     | **API** – testado no Insomnia            |
| Cadastro de edital pelo formulário do site | Local (`useState`), não grava no banco   |
| Inscrição em monitoria                     | Local (`useState`), não grava no banco   |

## Como rodar (3 passos)

Pré-requisitos: Node.js 18+ e Docker com Docker Compose.

**1. Backend e banco de dados** (terminal 1)

```bash
cd TBE-Tarefa2/backend
cp .env.example .env
npm install
docker compose up -d
npx prisma generate
npm run prisma:migrate
npm run seed
npm run dev
```

A API sobe em `http://localhost:3333`.

**2. Frontend** (terminal 2)

```bash
cd TBE-Tarefa2/frontend
npm install
npm run dev
```

O site abre em `http://localhost:5173` (origem liberada no CORS do backend).

**3. Testar a API no Insomnia**

Importe `backend/insomnia/Insomnia_Editais.json` e execute as requisições. Cada uma indica o status esperado.

## Portas

| Serviço    | Porta  |
| ---------- | ------ |
| Frontend   | 5173   |
| Backend    | 3333   |
| PostgreSQL | 5432   |

## Vídeo de demonstração (YouTube – não listado):

[https://youtu.be/#](https://youtu.be/#)

## Autor

- **Nome**: Tadeu dos Santos Jerônimo
- **Matrícula**: 2026202194
- **E-mail**: <tadeus.jeronimo@gmail.com>
- **Disciplina**: Tecnologias Back-End - IF Sudeste/MG

## Licença

[MIT](LICENSE)

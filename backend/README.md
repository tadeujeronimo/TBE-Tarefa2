# Backend – Sistema de Monitorias (Tarefa 2)

API REST do **Sistema de Monitorias**, desenvolvida com Node.js, TypeScript, Express 5, PostgreSQL, Prisma e Zod para a Tarefa 2 da disciplina Tecnologias Back-End: **CRUD completo**, validação em runtime, tratamento de erros e CORS habilitado para o front-end.

> Evolução da [Tarefa 1](https://github.com/tadeujeronimo/TBE-Tarefa1): a entidade `Edital` é o equivalente ao `Product` pedido no enunciado.

## Tecnologias

- Node.js + TypeScript
- Express 5
- PostgreSQL 15 (Docker / Docker Compose)
- Prisma ORM (migrations + seed + Prisma Studio)
- Zod (validação em tempo de execução)
- CORS (`cors`)
- Insomnia (testes dos endpoints)

## Modelo de dados (Prisma)

Modelo `Edital` (análogo ao `Product` do enunciado):

| Campo            | Tipo          | Observação                                     |
| ---------------- | ------------- | ---------------------------------------------- |
| id               | Int           | `@id @default(autoincrement())`                |
| disciplina       | String        | mapeado para a coluna `title`                  |
| descricao        | String (Text) | mapeado para a coluna `description`            |
| imageUrl         | String        | imagem/banner do edital (coluna `image_url`)   |
| professor        | String        | nome do professor responsável                  |
| curso            | String        | curso ao qual a disciplina pertence            |
| vagas            | Int           | número de vagas ofertadas                      |
| dataAbertura     | DateTime      | abertura das inscrições                        |
| dataEncerramento | DateTime      | encerramento das inscrições                    |
| status           | Enum          | `ABERTO` (padrão) ou `ENCERRADO`               |
| destaque         | Boolean       | edital em destaque no catálogo (padrão `false`) |
| createdAt        | DateTime      | `@default(now())`                              |
| updatedAt        | DateTime      | `@updatedAt`                                   |

## Endpoints

| Método | Rota               | Descrição                          | Status possíveis            |
| ------ | ------------------ | ---------------------------------- | --------------------------- |
| GET    | `/`                | Status da API (`{ "status": "ok" }`) | 200                       |
| GET    | `/api/editais`     | Lista todos os editais             | 200, 500                    |
| GET    | `/api/editais/:id` | Retorna um edital por id           | 200, 400, 404, 500          |
| POST   | `/api/editais`     | Cria um edital                     | 201, 400, 500               |
| PUT    | `/api/editais/:id` | Atualização **parcial**            | 200, 400, 404, 500          |
| DELETE | `/api/editais/:id` | Remove um edital                   | 204, 400, 404, 500          |

Significado dos códigos:

- **200 OK** – sucesso (com corpo JSON).
- **201 Created** – edital criado.
- **204 No Content** – edital removido (sem corpo).
- **400 Bad Request** – `:id` inválido (não é inteiro positivo), payload que não passa no Zod ou JSON malformado.
- **404 Not Found** – edital inexistente (no PUT/DELETE, é o erro **P2025** do Prisma).
- **500 Internal Server Error** – erro inesperado (ex.: banco fora do ar).

## Validação com Zod

Os schemas ficam em `src/schemas/edital.schema.ts`:

| Campo do enunciado | Campo do projeto | Regra                                         |
| ------------------ | ---------------- | --------------------------------------------- |
| `title`            | `disciplina`     | `string().min(3)`                             |
| `description`      | `descricao`      | `string().min(10)`                            |
| `imageUrl`         | `imageUrl`       | `string().min(1)`                             |
| —                  | `professor`, `curso` | `string().min(1)`                         |
| —                  | `vagas`          | número inteiro maior que zero                 |
| —                  | `dataAbertura`, `dataEncerramento` | data válida (`AAAA-MM-DD` ou ISO 8601) |
| —                  | `status`         | opcional: `ABERTO` ou `ENCERRADO`             |
| —                  | `destaque`       | opcional: `true` ou `false`                   |

- **Criação (POST):** `criarEditalSchema` – campos obrigatórios.
- **Atualização (PUT):** `atualizarEditalSchema = criarEditalSchema.partial()` – todos os campos opcionais, mas cada um enviado segue a mesma regra da criação.

Como o Zod impede dados inválidos: o corpo da requisição passa por `schema.parse(req.body)` **antes** de qualquer acesso ao banco. Se algo violar as regras, o Zod lança um `ZodError`, o `catch` o converte em **400** com a lista de problemas, e o Prisma nem chega a ser chamado.

O `catch` de cada rota diferencia três casos:

| Erro                                 | Resposta |
| ------------------------------------ | -------- |
| `ZodError`                           | 400      |
| `PrismaClientKnownRequestError` P2025 (registro não encontrado) | 404 |
| qualquer outro                       | 500      |

## Política de CORS

Configuração em `src/app.ts`:

```ts
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGIN ?? "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);
```

| Item     | Política adotada                                        | Justificativa |
| -------- | ------------------------------------------------------- | ------------- |
| Origens  | Apenas `ALLOWED_ORIGIN` do `.env` (padrão `http://localhost:5173`, o front-end em Vite) | Nunca usamos `*`: só o front-end da aplicação pode consumir a API pelo navegador. Em produção basta trocar a variável pelo domínio real. |
| Métodos  | `GET`, `POST`, `PUT`, `DELETE`                          | São exatamente os métodos do CRUD. Qualquer outro (ex.: `PATCH`) não é liberado. |
| Headers  | `Content-Type`                                          | Único header necessário para enviar JSON. Sem cookies ou autenticação, portanto sem `credentials`. |

Observações:

- O front-end deste projeto (pasta `../frontend`, Vite) roda em `http://localhost:5173`, que é a origem liberada por padrão.
- A resposta sempre anuncia apenas a origem permitida; quando uma página de **outra** origem tenta usar a API, o navegador bloqueia a resposta.
- O CORS é uma proteção **do navegador**: Insomnia, curl e similares continuam funcionando normalmente.
- As requisições `PUT`/`DELETE` e as que enviam `Content-Type: application/json` disparam um *preflight* (`OPTIONS`), que o middleware responde automaticamente com `204`.

## Como rodar do zero

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose

### Passo a passo

1. **Entre na pasta do backend e instale as dependências**

```bash
cd TBE-Tarefa2/backend
npm install
```

2. **Configure as variáveis de ambiente**

```bash
cp .env.example .env
```

O `.env` já vem com valores compatíveis com o `docker-compose.yml`. Variáveis:

| Variável          | Descrição                                   | Padrão                  |
| ----------------- | ------------------------------------------- | ----------------------- |
| `POSTGRES_*`      | Usuário, senha e nome do banco (Docker)     | ver `.env.example`      |
| `DATABASE_URL`    | String de conexão usada pelo Prisma         | ver `.env.example`      |
| `PORT`            | Porta da API                                | `3333`                  |
| `ALLOWED_ORIGIN`  | Origem do front-end liberada no CORS        | `http://localhost:5173` |

3. **Suba o banco PostgreSQL com Docker Compose**

```bash
docker compose up -d
```

Cria o container `catalogo-editais-db` (PostgreSQL 15), expõe a porta `5432` e persiste os dados em um volume Docker. Confira com `docker ps`.

4. **Gere o Prisma Client e aplique a migration**

```bash
npx prisma generate
npm run prisma:migrate
```

5. **Popule o banco com os editais de exemplo (seed)**

```bash
npm run seed
```

Insere 6 editais (ids 1 a 6; 3 abertos e 3 encerrados). Pode ser executado várias vezes: a tabela é limpa e os ids voltam a começar em 1.

6. **(Opcional) Confira os dados no Prisma Studio**

```bash
npm run prisma:studio
```

7. **Inicie a API em modo desenvolvimento**

```bash
npm run dev
```

A API sobe em `http://localhost:3333`.

8. **Teste os endpoints no Insomnia**

Importe `insomnia/Insomnia_Editais.json` (`Application` → `Preferences` → `Data` → `Import Data`) e execute as requisições, na ordem. Cada uma traz, no nome e na aba **Docs**, o status esperado.

## Testes no Insomnia – status esperados

Variáveis do ambiente (Base Environment): `base_url` (`http://localhost:3333`), `id_valido` (1), `id_inexistente` (9999) e `id_delete` (6).

| #  | Requisição                                   | Status esperado |
| -- | -------------------------------------------- | --------------- |
| 01 | `GET /`                                      | 200             |
| 02 | `GET /api/editais`                           | 200             |
| 03 | `GET /api/editais/:id` (ID válido)           | 200             |
| 04 | `GET /api/editais/abc` (ID inválido)         | 400             |
| 05 | `GET /api/editais/9999` (inexistente)        | 404             |
| 06 | `POST /api/editais` (payload válido)         | 201             |
| 07 | `POST /api/editais` (payload inválido)       | 400             |
| 08 | `PUT /api/editais/:id` (parcial válido)      | 200             |
| 09 | `PUT /api/editais/:id` (`vagas` negativas)   | 400             |
| 10 | `PUT /api/editais/9999` (inexistente)        | 404             |
| 11 | `DELETE /api/editais/:id` (válido)           | 204             |
| 12 | `DELETE /api/editais/9999` (inexistente)     | 404             |
| 13 | `GET /api/editais` com o banco parado (`docker compose stop`) | 500 |

Dica: depois do teste 11, rode `npm run seed` para restaurar o edital removido. Depois do teste 13, rode `docker compose start`.

## Exemplos de payloads

**POST `/api/editais` – válido (201 Created)**

```json
{
  "disciplina": "Compiladores",
  "descricao": "Edital de monitoria da disciplina de Compiladores.",
  "imageUrl": "/images/compiladores.png",
  "professor": "Nome do Professor",
  "curso": "Ciência da Computação",
  "vagas": 2,
  "dataAbertura": "2026-08-01",
  "dataEncerramento": "2026-08-20",
  "status": "ABERTO",
  "destaque": false
}
```

`status` e `destaque` são opcionais (padrão: `ABERTO` e `false`).

**POST `/api/editais` – inválido (400 Bad Request)**

```json
{
  "disciplina": "ab",
  "descricao": "curta",
  "imageUrl": "",
  "professor": "Nome do Professor",
  "curso": "Ciência da Computação",
  "vagas": -1,
  "dataAbertura": "2026-08-01",
  "dataEncerramento": "2026-08-20"
}
```

Resposta:

```json
{
  "error": "Payload inválido",
  "issues": [
    { "path": "disciplina", "message": "Disciplina deve ter pelo menos 3 caracteres" },
    { "path": "descricao", "message": "Descrição deve ter pelo menos 10 caracteres" },
    { "path": "imageUrl", "message": "imageUrl não pode ser vazio" },
    { "path": "vagas", "message": "Vagas deve ser maior que zero" }
  ]
}
```

**PUT `/api/editais/1` – atualização parcial (200 OK)**

```json
{ "vagas": 3, "destaque": true }
```

Só os campos enviados são alterados; os demais permanecem como estão.

**PUT `/api/editais/1` – inválido (400 Bad Request)**

```json
{ "vagas": -5 }
```

**DELETE `/api/editais/6`** – responde `204 No Content` (sem corpo). Se o id não existir: `404` com `{ "error": "Edital não encontrado." }`.

## Scripts disponíveis

| Script                    | Comando                   | Descrição                            |
| ------------------------- | ------------------------- | ------------------------------------ |
| `npm run dev`             | `tsx watch src/server.ts` | Roda a API em modo desenvolvimento   |
| `npm run build`           | `tsc`                     | Compila o TypeScript para `dist/`    |
| `npm start`               | `node dist/server.js`     | Roda a API já compilada              |
| `npm run seed`            | `tsx prisma/seed.ts`      | Popula o banco com 6 editais         |
| `npm run prisma:migrate`  | `prisma migrate dev`      | Cria/aplica migrations               |
| `npm run prisma:generate` | `prisma generate`         | Gera o Prisma Client                 |
| `npm run prisma:studio`   | `prisma studio`           | Abre o Prisma Studio                 |

## Estrutura de pastas

```
backend/
├── docker-compose.yml
├── .env.example
├── package.json
├── tsconfig.json
├── prisma/
│   ├── schema.prisma
│   ├── seed.ts
│   └── migrations/
├── insomnia/
│   └── Insomnia_Editais.json
└── src/
    ├── app.ts                    # Express, CORS, rotas e tratamento final de erros
    ├── server.ts                 # Sobe o servidor
    ├── prisma.ts                 # Instância do Prisma Client
    ├── schemas/
    │   └── edital.schema.ts      # Schemas Zod (criação e atualização parcial)
    ├── controllers/
    │   └── edital.controller.ts  # Handlers do CRUD + tratamento de erros
    └── routes/
        └── edital.routes.ts
```

## Vídeo de demonstração

(link do vídeo – a adicionar)

## Autor

- **Nome**: Tadeu dos Santos Jerônimo
- **Matrícula**: 2026202194
- **E-mail**: <tadeus.jeronimo@gmail.com>
- **Disciplina**: Tecnologias Back-End - IF Sudeste/MG

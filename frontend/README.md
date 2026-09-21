# Frontend – Sistema de Monitorias

Front-end em **React, TypeScript, Vite e Bootstrap 5**, evolução do projeto da Tarefa 4 da disciplina **Tecnologias Front-End**. Agora a lista de editais vem da **API do backend** (`../backend`) em vez de dados fixos no código.

## Funcionalidades

- Lista de editais carregada da API (`GET /api/editais`) com `useEffect`
- Estados de **carregando** e de **erro**, com botão "Tentar novamente"
- Card com **imagem** (`imageUrl`), descrição, datas e status
- Busca em tempo real por disciplina, professor e curso, e filtros (Todos, Abertos, Encerrados, Destaque)
- Formulário de cadastro de edital (com `descricao` e `imageUrl`)
- Formulário de inscrição em monitoria (Tarefa 4)
- Layout responsivo com Bootstrap 5

> **Atenção:** só a **listagem** vem da API. O cadastro de edital e a inscrição em monitoria funcionam apenas na tela (`useState`) e são perdidos ao recarregar a página.

## Como a API é consumida

O acesso à API fica em `src/services/api.ts`:

- URL base: variável `VITE_API_URL` (padrão `http://localhost:3333`).
- Ajusta as datas recebidas: o formato ISO (`2026-06-01T00:00:00.000Z`) vira `2026-06-01`.

## Imagens

O campo `imageUrl` guarda apenas o **caminho** da imagem, que fica em `public/images/`:

```
public/images/
├── engenharia-de-software.png
├── programacao-web.png
├── banco-de-dados.png
├── inteligencia-artificial.png
├── machine-learning.png
├── redes-de-computadores.png
└── padrao.png                 # usada por padrão no formulário de novo edital
```

Os nomes correspondem aos do seed do backend. O Vite serve a pasta `public/` na raiz, então `/images/padrao.png` funciona direto no `<img src>`.

## Estrutura de Arquivos

```
src/
├── types/
│   ├── Edital.ts                  # Interface de dados do Edital
│   └── Candidatura.ts             # Interface de dados da Candidatura
├── services/
│   └── api.ts                     # Chamadas à API (fetch) e conversão de dados
├── components/
│   ├── EditalCard.tsx             # Card individual de edital (com imagem)
│   ├── BuscaEdital.tsx            # Campo de busca
│   ├── NovoEditalForm.tsx         # Formulário de cadastro de edital (local)
│   └── InscricaoMonitoriaForm.tsx # Formulário de inscrição em monitoria (local)
├── vite-env.d.ts                  # Tipos do Vite (import.meta.env)
└── App.tsx                        # Estado central e carregamento da API
```

## Como Executar

O **backend precisa estar rodando** (veja `../README.md`). Depois:

```bash
cp .env.example .env    # opcional: só necessário se a API não estiver em localhost:3333
npm install
npm run dev
```

Abra `http://localhost:5173`. Se a API estiver fora do ar, a página mostra a mensagem de erro com o botão "Tentar novamente".

## Autor

- **Nome**: Tadeu dos Santos Jerônimo
- **Matrícula**: 2026202194
- **E-mail**: tadeus.jeronimo@gmail.com
- **Disciplina**: Tecnologias Front-End - IF Sudeste/MG

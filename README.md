# RotaPadel

O **RotaPadel** é uma aplicação web para agendamento de quadras de padel.  
Jogadores podem visualizar horários disponíveis, registrar-se, fazer login e reservar quadras.  
O estabelecimento pode acompanhar e gerenciar reservas pela API.

## 🚀 Visão rápida (para começar em minutos)
Se for sua primeira vez no projeto, basta rodar os comandos abaixo e acessar o site:

```bash
npm install
npm run dev:all
```

- Frontend: [http://localhost:5173](http://localhost:5173)
- API: [http://localhost:4000](http://localhost:4000)

---

## 📑 Sumário
- Visão geral
- Stack e estrutura do projeto
- Pré‑requisitos
- Configuração do backend (server)
- Execução separada (frontend e backend)
- Execução conjunta (um único comando)
- Variáveis de ambiente
- URLs úteis
- Dicas e resolução de problemas
- Contribuindo

## 🔎 Visão geral
- **Frontend:** React + Vite + React Router + styled-components  
- **Backend:** Node.js + Express + JWT + Neon/Postgres  
- **Autenticação:** JWT armazenado no `localStorage`  

## 🗂️ Stack e estrutura do projeto
```
RotaPadel/
  server/            # Backend (Express)
    src/
      app.js
      controllers/
      routes/
      middlewares/
      db/
      utils/
  src/               # Frontend (React + Vite)
    components/
    containers/
    routes/
    services/
    styles/
```

## ⚙️ Pré‑requisitos
- Node.js 18+ e npm  
- Banco Postgres (Neon, RDS, local, etc.) com URL de conexão

## 🔧 Configuração do backend (server)
1. Entre na pasta `server` e crie um arquivo `.env` com:  
   ```env
   DATABASE_URL="postgres://usuario:senha@host:5432/database"
   JWT_SECRET="um_segredo_forte_aqui"
   PORT=4000
   ```

2. Instale as dependências do backend:  
   ```bash
   cd server
   npm install
   ```

3. Rode em desenvolvimento (com nodemon):  
   ```bash
   npm run dev
   ```

   O backend estará disponível em [http://localhost:4000](http://localhost:4000).

💡 Observação sobre e-mail de recuperação:  
Atualmente, o transporte SMTP está definido em código em `server/src/utils/email.js`.  
Para produção, ajuste para ler credenciais via variáveis de ambiente e nunca commitar senhas.

## ▶️ Execução separada (frontend e backend)
- Backend:
  ```bash
  cd server
  npm run dev
  ```

- Frontend (em outra aba/terminal na raiz do projeto):
  ```bash
  npm install
  npm run dev
  ```

O frontend sobe em `http://localhost:5173` (padrão Vite) e consome a API em `http://localhost:4000`.

## 🔗 Execução conjunta (um único comando)
Sem alterar arquivos, você pode usar o `concurrently` diretamente:
```bash
npx concurrently "npm run dev" "npm --prefix server run dev"
```

Se preferir um script permanente (recomendado):

1. Instale o concurrently na raiz do projeto:
   ```bash
   npm i -D concurrently
   ```

2. No `package.json` da raiz, adicione os scripts:
   ```json
   {
     "scripts": {
       "dev:front": "vite",
       "dev:back": "npm --prefix server run dev",
       "dev:all": "concurrently -n FRONT,BACK -c green,blue \"npm run dev:front\" \"npm run dev:back\""
     }
   }
   ```

3. Execute tudo com um único comando:
   ```bash
   npm run dev:all
   ```

## 🌍 Variáveis de ambiente (resumo)
- Backend (`server/.env`):
  - `DATABASE_URL`: string de conexão Postgres (**obrigatória**)
  - `JWT_SECRET`: segredo usado para assinar tokens JWT
  - `PORT`: porta da API (opcional, default 4000)

⚠️ Frontend já vem configurado para consumir `http://localhost:4000`.  
Não é necessário configurar `.env` no frontend para desenvolvimento local.

## 🔗 URLs úteis
- Frontend (Vite): [http://localhost:5173](http://localhost:5173)  
- Backend (Express): [http://localhost:4000](http://localhost:4000)  
- Healthcheck: [http://localhost:4000/health](http://localhost:4000/health)  
- Auth base: [http://localhost:4000/api/auth](http://localhost:4000/api/auth)  
- Reservas base: [http://localhost:4000/api](http://localhost:4000/api)  

## 🛠️ Dicas e resolução de problemas
- **CORS:** já habilitado no backend (`cors({ origin: true, credentials: true })`).  
- **Token JWT:** salvo no `localStorage` como `token`. Ao deslogar, o token é removido.  
- **Erros de conexão com DB:** verifique `DATABASE_URL` no `.env` e se o banco está acessível.  
- **Porta ocupada:** ajuste `PORT` no `.env` do backend ou encerre processos na porta.  

## 🤝 Contribuindo
Pull requests são bem-vindos!  
Para contribuir, abra uma issue descrevendo a mudança ou bug antes.

---
Qualquer dúvida, abra uma issue ou descreva o problema no repositório.

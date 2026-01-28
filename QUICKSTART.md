# ⚡ Guia Rápido - Participa-DF | Ouvidoria PWA

Este guia mostra como colocar a aplicação funcionando em **menos de 15 minutos**.

## 📋 Checklist Pré-Instalação

- [ ] Node.js 18+ instalado
- [ ] pnpm ou yarn instalado
- [ ] Git instalado
- [ ] Navegador moderno (Chrome, Firefox, Edge, Safari)
- [ ] Contas nas seguintes plataformas (opcional):
  - [ ] Google Cloud (OAuth - opcional para login)

## 🚀 Instalação em 4 Passos

### 1. Clone e Acesse o Projeto (1 min)

```bash
git clone https://github.com/OshanKHZ/participa-df-pwa.git
cd participa-df-pwa
```

### 2. Instale Dependências (2 min)

```bash
# Usando npm
npm install

# OU usando yarn
yarn install
```

### 3. Configure Variáveis de Ambiente (3 min)

Copie o arquivo de exemplo e edite:

```bash
cp .env.example .env.local
```

Ou crie manualmente o arquivo `.env.local` na raiz do projeto:

```env
# Database (SQLite local - já configurado)
DATABASE_URL="file:./database/dev.db"

# NextAuth (gere com: openssl rand -base64 32)
NEXTAUTH_SECRET=sua-chave-secreta-aqui
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (opcional - apenas para login)
GOOGLE_CLIENT_ID=seu-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=seu-client-secret

# Email (opcional - apenas para magic links)
EMAIL_SERVER_HOST=smtp.gmail.com
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=seu-email@gmail.com
EMAIL_SERVER_PASSWORD=senha-app-gmail
EMAIL_FROM=noreply@participa-df.com
```

**Dica:** Para testar rapidamente, você só precisa do `NEXTAUTH_SECRET`. Login/cadastro são opcionais!

### 4. Inicialize o Banco de Dados (2 min)

```bash
# Criar tabelas no banco
npm run db:push

# OU manualmente:
npx drizzle-kit push:sqlite

# (Opcional) Popular com dados de exemplo
npm run db:seed
```

## 🎯 Execute o Projeto (1 min)

### Modo Desenvolvimento

```bash
npm run dev
# OU
yarn dev
```

Acesse: **http://localhost:3000**

### Modo Produção (Build)

```bash
# Build otimizado
npm run build

# Executar build
npm start
```

## 🔧 Troubleshooting Rápido

### Erro: "Command not found: npm"

```bash
# Instale Node.js de https://nodejs.org
# Verifique instalação:
node --version
npm --version
```

### Erro: "Port 3000 already in use"

```bash
# Mude a porta
PORT=3001 npm run dev

# OU mate o processo na porta 3000 (Windows)
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# OU (Linux/Mac)
lsof -ti:3000 | xargs kill
```

### Erro: "Drizzle client não encontrado"

```bash
npm run db:push
```

### Erro: "Module not found"

```bash
# Limpe cache e reinstale
rm -rf node_modules package-lock.json
npm install

# OU
rm -rf node_modules yarn.lock
yarn install
```

### Erro: Database locked

```bash
# Feche Drizzle Studio e outras conexões ao banco
rm database/dev.db
npm run db:push
```

## 🎨 Customizações Rápidas

### Alterar Cores do Tema

Edite `src/app/globals.css`:

```css
@theme {
  --color-primary: #192d4b;        /* Azul escuro do header */
  --color-secondary: #0369a1;      /* Azul dos botões */
  --color-success: #549250;        /* Verde de sucesso */
  /* ... */
}
```

### Alterar Tipos de Manifestação

Edite `src/shared/constants/manifestationTypes.ts`:

```typescript
export const MANIFESTATION_TYPES = [
  { id: 'denuncia', label: 'Denúncia', icon: RiAlertLine },
  { id: 'reclamacao', label: 'Reclamação', icon: RiErrorWarningLine },
  // Adicione novos tipos aqui
]
```

### Configurar Google OAuth

1. Acesse https://console.cloud.google.com
2. Crie um novo projeto
3. Ative "Google+ API"
4. Crie credenciais OAuth 2.0
5. Adicione URLs autorizadas:
   - http://localhost:3000
   - http://localhost:3000/api/auth/callback/google
6. Copie Client ID e Secret para `.env.local`

---

**Tempo estimado total:** 10-15 minutos

# ⚡ Guia Rápido - Participa-DF | Ouvidoria PWA

Este guia mostra como colocar a aplicação funcionando em **menos de 15 minutos**.

## 📋 Checklist Pré-Instalação

- [ ] Node.js 18+ instalado
- [ ] pnpm ou yarn instalado
- [ ] Git instalado
- [ ] Navegador moderno (Chrome, Firefox, Edge, Safari)
- [ ] Conta no [Resend](https://resend.com) (para API Key)

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

# Resend (Envio de Email/OTP)
RESEND_API_KEY="re_..."
EMAIL_FROM="nao-responda@participa.df.gov.br"
```

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

---

**Tempo estimado total:** 10-15 minutos

# 🏛️ Participa-DF | Ouvidoria PWA

Progressive Web App (PWA) para registro de manifestações da Ouvidoria do Distrito Federal.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-14+-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)](https://www.typescriptlang.org/)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG-2.1%20AA-green)](https://www.w3.org/WAI/WCAG21/quickref/)

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Critérios do Hackathon](#critérios-do-hackathon)
- [Tecnologias](#tecnologias)
- [Instalação Rápida](#instalação-rápida)
- [Configuração](#configuração)
- [Como Usar](#como-usar)
- [Arquitetura](#arquitetura)
- [Acessibilidade](#acessibilidade)
- [Testes](#testes)
- [Deploy](#deploy)
- [Contribuindo](#contribuindo)
- [Licença](#licença)

## 🎯 Visão Geral

O **Participa-DF** é uma plataforma digital que facilita o registro de manifestações (denúncias, reclamações, sugestões, elogios, solicitações e pedidos de informação) de forma acessível, inclusiva e multicanal.

### Características Principais

- 📱 **PWA Instalável** - Funciona offline e pode ser instalado como app nativo
- ♿ **100% Acessível** - Conformidade total com WCAG 2.1 AA
- 🎙️ **Multicanal** - Texto, áudio, imagem e vídeo
- 🔒 **Anonimato Opcional** - Escolha entre identificação ou anonimato total
- 🎨 **UX Simplificada** - Máximo de 4 passos para completar manifestação
- 📄 **Protocolo Instantâneo** - Geração imediata de protocolo de acompanhamento

## ⚙️ Funcionalidades

### 1. Registro de Manifestações Multicanal

**Canais suportados:**
- ✍️ **Texto** - Editor de texto com validação de caracteres
- 🎤 **Áudio** - Gravação direta via navegador
- 📷 **Imagem** - Upload ou captura de fotos
- 🎬 **Vídeo** - Upload de vídeos

**Combinações permitidas:** Texto + múltiplos anexos

### 2. Sistema de Identificação Flexível

**Opção 1: Manifestação Anônima**
- Identidade preservada em sigilo
- Checkbox de consentimento obrigatório
- Aviso claro sobre limitações de acompanhamento

**Opção 2: Manifestação Identificada**
- Login via Email (Código OTP)
- Dados preenchidos automaticamente
- Acompanhamento completo via dashboard

### 3. Acessibilidade Avançada

- **Navegação por teclado** - 100% navegável via Tab/Enter/Space/Esc
- **Screen readers** - Suporte completo NVDA/VoiceOver/JAWS
- **Alto contraste** - Ratio ≥4.5:1 em todos os textos
- **Text-to-Speech** - Botões de leitura em cabeçalhos
- **Fontes ajustáveis** - Menu de acessibilidade integrado
- **Foco visível** - Indicadores claros em todos os elementos interativos

### 4. Progressive Web App (PWA)

- **Instalável** - "Adicionar atalho" em mobile e desktop
- **Offline-first** - Service Worker com cache inteligente
- **Notificações push** - Atualizações sobre manifestações (futuro)
- **App-like** - Fullscreen sem barras do navegador

## 🛠️ Tecnologias

### Frontend
- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utilitária
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas

### Backend
- **Drizzle ORM** - Gerenciamento de banco de dados
- **SQLite** - Banco de dados local (dev)

### PWA
- **next-pwa** - Service Worker e manifest
- **Workbox** - Estratégias de cache

### Acessibilidade
- **React ARIA** - Patterns acessíveis
- **axe-core** - Testes de acessibilidade

### Qualidade
- **ESLint** - Linting
- **Prettier** - Formatação de código
- **Husky** - Git hooks

## 🚀 Instalação Rápida

**Tempo estimado:** 10-15 minutos

### Pré-requisitos

- Node.js 18+
- pnpm, npm ou yarn
- Git

### Comandos

```bash
# 1. Clone o repositório
git clone https://github.com/OshanKHZ/participa-df-pwa.git
cd participa-df-pwa

# 2. Instale dependências
npm install

# 3. Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com sua chave Resend

# 4. Inicialize o banco de dados
npm run db:push
# OU manualmente:
npx drizzle-kit push:sqlite

# 5. Execute em desenvolvimento
npm run dev
```

Acesse: **http://localhost:3000**

**📖 Para instruções detalhadas, veja [QUICKSTART.md](./QUICKSTART.md)**

## ⚙️ Configuração

### Variáveis de Ambiente

```env
# Database
DATABASE_URL="file:./database/dev.db"

# Resend (Envio de Email/OTP)
RESEND_API_KEY="re_..."
EMAIL_FROM="nao-responda@participa.df.gov.br"
```

### Banco de Dados

**Desenvolvimento:** SQLite local em `database/dev.db`
**Produção:** PostgreSQL, MySQL ou SQLite via Drizzle

```bash
# Migrar schema
npm run db:push

# Visualizar dados (Drizzle Studio)
npm run db:studio
# OU SQLite direto:
sqlite3 database/dev.db
```

## 🎮 Como Usar

### Fluxo de Criação de Manifestação

**Passo 1: Tipo de Manifestação** (5s)
- Selecione: Denúncia, Reclamação, Sugestão, Elogio, Solicitação ou Informação

**Passo 2: Assunto** (15s)
- Digite palavras-chave
- Selecione assunto da lista autocomplete
- Ou insira manualmente

**Passo 3: Conteúdo** (2-5min)
- Escolha canal(is): Texto, Áudio, Imagem e/ou Vídeo
- Preencha/grave/anexe conteúdo
- Mínimo 10 caracteres em texto

**Passo 4: Identificação** (30s)
- **Opção A:** Manifestação anônima (marque checkbox de consentimento)
- **Opção B:** Faça login/cadastro via Email (OTP)

**Passo 5: Revisão e Envio** (1min)
- Revise todas as informações
- Confirme envio
- Receba protocolo instantaneamente

**Tempo total:** 4-7 minutos

### Recursos Avançados

**Menu de Acessibilidade (Alt+A):**
- Aumentar/diminuir fonte
- Alto contraste
- Ativar leitor de tela
- Navegação simplificada

**Atalhos de Teclado:**
- `Tab` - Próximo campo
- `Shift+Tab` - Campo anterior
- `Enter/Space` - Ativar botão
- `Esc` - Fechar modal/voltar

## 🏗️ Arquitetura

### Estrutura de Diretórios

```
participa-df/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── layout.tsx           # Layout raiz (SessionProvider)
│   │   ├── page.tsx             # Home
│   │   └── manifestacao/        # Fluxo de manifestação
│   │       ├── page.tsx         # Passo 1: Tipo
│   │       ├── assunto/         # Passo 2: Assunto
│   │       ├── conteudo/        # Passo 3: Conteúdo
│   │       ├── dados/           # Passo 4: Identificação
│   │       └── revisar/         # Passo 5: Revisão
│   ├── features/                # Features modulares
│   │   └── manifestation/       # Lógica de manifestação
│   │       ├── components/      # Componentes específicos
│   │       ├── hooks/           # Hooks customizados
│   │       └── utils/           # Utilitários
│   ├── shared/                  # Código compartilhado
│   │   ├── components/          # Componentes reutilizáveis
│   │   ├── hooks/               # Hooks globais
│   │   ├── utils/               # Utilitários globais
│   │   ├── constants/           # Constantes
│   │   └── providers/           # Context Providers
│   ├── server/                  # Lógica server-side
│   │   ├── auth.ts             # Auth logic
│   │   └── db/                 # Drizzle ORM (schema + client)
│   └── lib/                    # Bibliotecas externas
│       └── api/                # Integrações API
├── public/                      # Arquivos estáticos
│   ├── icons/                  # Ícones PWA
│   ├── manifest.json           # PWA manifest
│   └── sw.js                   # Service Worker
├── drizzle/                     # Drizzle migrations
│   └── migrations/             # SQL migrations
├── database/                    # Banco SQLite (dev)
└── docs/                       # Documentação adicional
```

### Fluxo de Dados

```
┌─────────────────┐
│   Usuário       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js App    │  Client-side rendering
└────────┬────────┘
         │
         ├──────────► [LocalStorage] - Draft persistence
         │
         ├──────────► [IndexedDB] - Arquivos temporários
         │
         ▼
┌─────────────────┐
│  API Routes     │  Server-side processing
└────────┬────────┘
         │
         ├──────────► [Participa-DF API] - Busca assuntos
         │
         ├──────────► [Auth Service] - Autenticação (OTP)
         │
         ▼
┌─────────────────┐
│  Drizzle ORM    │  Database abstraction
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  SQLite/Postgres│  Persistência final
└─────────────────┘
```

### Testes de Acessibilidade

**Ferramentas:**
```bash
# Lighthouse CI
npm run lighthouse

# axe-core
npm run test:a11y

# WAVE (manual)
# Extensão: https://wave.webaim.org/extension/
```

### Variáveis de Ambiente (Produção)

```env
DATABASE_URL=postgresql://user:pass@host:5432/db
RESEND_API_KEY=re_123...
# ... outras variáveis
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Forkeie o projeto
2. Crie uma branch de feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'feat: Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

### Convenções

**Commits:**
```
feat: Nova funcionalidade
fix: Correção de bug
docs: Documentação
style: Formatação
refactor: Refatoração
test: Testes
chore: Manutenção
```

**Código:**
- TypeScript strict mode
- ESLint + Prettier
- Componentes funcionais
- Hooks ao invés de classes

## 🙏 Créditos

Desenvolvido para o **1º Hackathon de Controle Social** da Controladoria-Geral do Distrito Federal (CGDF).

**Tecnologias:**
- [Next.js](https://nextjs.org/) - Framework React
- [Drizzle ORM](https://orm.drizzle.team/) - Type-safe ORM
- [Tailwind CSS](https://tailwindcss.com/) - Estilização
- [React Hook Form](https://react-hook-form.com/) - Formulários
- [Zod](https://zod.dev/) - Validação

**APIs:**
- [Participa-DF](https://www.participa.df.gov.br/) - Busca de assuntos

**Recursos:**
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/) - Diretrizes de Acessibilidade
- [PWA Checklist](https://web.dev/pwa-checklist/) - Guia PWA

---

**Desenvolvido para fortalecer a democracia participativa no Distrito Federal**

Para dúvidas ou sugestões, abra uma [issue](https://github.com/OshanKHZ/participa-df-pwa/issues) ou entre em contato.

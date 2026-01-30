# 🏛️ Participa-DF | Ouvidoria PWA

Progressive Web App (PWA) para registro de manifestações da Ouvidoria do Distrito Federal.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16+-black)](https://nextjs.org/)
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

O Participa-DF é uma plataforma que:

1. Facilita o registro de manifestações (denúncias, reclamações, sugestões, elogios, solicitações e pedidos de informação) para a Ouvidoria
2. Coleta relatos multicanais via texto, áudio, imagem e vídeo
3. Garante acessibilidade universal (WCAG 2.1 AA) com interface inclusiva
4. Funciona offline e permite instalação como aplicativo nativo (PWA)
5. Protege a identidade com opções de envio anônimo ou identificado
6. Processa feedback cidadão gerando protocolos instantâneos de acompanhamento

## ⚙️ Funcionalidades

### 1. Registro Simplificado e Guiado
- **Fluxo Passo-a-Passo** - Interface intuitiva que guia o cidadão
- **Tipos Claros** - Denúncia, Reclamação, Sugestão, Elogio, Solicitação, Informação
- **Busca de Assuntos** - Autocomplete para encontrar o setor correto
- **Validação em Tempo Real** - Feedback imediato sobre o preenchimento

### 2. Captura Multicanal Integrada
- **Texto** - Editor acessível com contagem de caracteres
- **Áudio** - Gravador nativo integrado ao navegador
- **Imagens** - Upload ou captura direta da câmera
- **Vídeo** - Suporte para envio de evidências em vídeo

### 3. Acessibilidade Universal (WCAG 2.1 AA)
- **Leitores de Tela** - Otimizado para NVDA, VoiceOver e TalkBack
- **Navegação** - Suporte total a teclado e dispositivos apontadores
- **Linguagem Simples** - Textos claros e diretos

### 4. Tecnologia PWA (Offline-First)
- **Instalação** - Funciona como app nativo em Android/iOS/Desktop
- **Modo Offline** - Permite iniciar manifestações sem internet
- **Sincronização** - Envio automático quando a conexão retorna
- **Performance** - Carregamento instantâneo via cache

### 5. Identidade e Privacidade
- **Anonimato** - Opção segura para denúncias sensíveis
- **Autenticação OTP** - Login simplificado via código por email
- **Proteção de Dados** - Conformidade com LGPD
- **Gestão de Perfil** - Histórico de manifestações (quando identificado)

### 6. Feedback e Protocolos
- **Geração Instantânea** - Protocolo único para acompanhamento
- **Rastreabilidade** - Status claro do andamento
- **Notificações** - Alertas sobre atualizações (Email)
- **Transparência** - Visualização clara das interações

## 🛠️ Tecnologias

### Frontend
- **Next.js 16** - Framework React com App Router
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

### Pré-requisitos

- Node.js 18+
- pnpm, npm ou yarn
- Git

### Passo-a-passo

1. **Clone o repositório:**

```bash
git clone https://github.com/OshanKHZ/participa-df-pwa.git
cd participa-df-pwa
```

2. **Instale dependências:**
```bash
npm install
# ou
yarn install
# ou
pnpm install
```

3. **Inicialize o banco de dados:**
```bash
npm run db:push
```

4. **Execute em desenvolvimento:**
```bash
npm run dev
```

Acesse: **http://localhost:3000**

## ⚙️ Configuração

### 1. Variáveis de Ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env.local
```

Edite `.env.local` com suas credenciais:

```env
# Database (Supabase / PostgreSQL)
# Use a porta 6543 (Transaction Pooler) para a aplicação
DATABASE_URL="postgresql://postgres.[ref]:[pass]@aws-0-region.pooler.supabase.com:6543/postgres"

# Use a porta 5432 (Session) para migrações (drizzle-kit)
DATABASE_MIGRATION_URL="postgresql://postgres.[ref]:[pass]@aws-0-region.pooler.supabase.com:5432/postgres"

# Resend (Emails e Autenticação OTP)
RESEND_API_KEY="re_..."
EMAIL_FROM="participa-df@sua-org.com"
SESSION_SECRET="gere-com-openssl-rand-base64-32"
```

### 2. Banco de Dados

O projeto utiliza **Drizzle ORM** com **PostgreSQL (Supabase)**.

```bash
# Atualizar o schema do banco (Push)
npm run db:push

# Gerar migrações (se necessário)
npm run db:generate

# Visualizar dados (Drizzle Studio)
npm run db:studio
```

## 📚 APIs Necessárias

### Resend (Envio de Emails & Auth)

O Resend é utilizado para enviar os códigos de acesso (OTP) para login.

1. Acesse [Resend.com](https://resend.com)
2. Crie uma conta gratuita
3. Navegue até **API Keys**
4. Crie uma nova chave (Full Access)
5. Copie a chave (começa com `re_`) para seu `.env.local`
6. **Custo:** Grátis até 3.000 emails/mês

## 🔎 SEO e Metadados

O projeto implementa uma estratégia de SEO robusta e centralizada, garantindo consistência em todas as páginas.

### Configuração Centralizada

Toda a configuração de SEO, incluindo URLs canônicas, títulos e descrições, é gerenciada em um único arquivo de fonte de verdade:

📄 **Arquivo:** `src/lib/seo/config.ts`

Neste arquivo você define:
- **`SITE_CONFIG`**: Nome da organização, descrição padrão, palavras-chave e dados de contato.
- **`ROUTES`**: Mapeamento de rotas com títulos e descrições específicas para cada página.
- **`SITE_URL`**: URL base dinâmico (env var `NEXT_PUBLIC_SITE_URL` ou fallback).

### Implementação nas Páginas

O projeto utiliza a API de Metadata do Next.js 14+ em `src/app/layout.tsx` e nas páginas individuais, consumindo as constantes do arquivo de configuração:

```typescript
// Exemplo de uso em page.tsx
import { ROUTES, getCanonicalUrl } from '@/lib/seo/config';

export const metadata: Metadata = {
  title: ROUTES.manifestacao.title,
  description: ROUTES.manifestacao.description,
  alternates: {
    canonical: getCanonicalUrl('manifestacao'),
  },
};
```

## 🎮 Como Usar

### Fluxo de Criação de Manifestação

**Passo 1: Tipo de Manifestação** (5s)
- Selecione: Denúncia, Reclamação, Sugestão, Elogio, Solicitação ou Informação

**Passo 2: Identificação** (30s)
- **Opção A:** Manifestação anônima (marque checkbox de consentimento)
- **Opção B:** Faça login/cadastro via Email (OTP receberá um código de acesso)

**Passo 3: Assunto** (15s)
- Digite palavras-chave
- Selecione assunto da lista autocomplete
- Ou insira manualmente

**Passo 4: Conteúdo** (2-5min)
- Escolha canal(is): Texto, Áudio, Imagem e/ou Vídeo
- Preencha/grave áudio/anexe conteúdo
- Mínimo 20 caracteres em texto

**Passo 5: Revisão e Envio** (1min)
- Revise todas as informações
- Confirme envio
- Receba o número do protocolo instantaneamente

**Tempo total:** 4-7 minutos

### Recursos Avançados

**Menu de Acessibilidade:**
- Aumentar/diminuir fonte
- Alto contraste
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
│     Cidadão     │  Acesso via PWA (Mobile/Desktop)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Next.js (App)  │  Fronteira com o usuário (Offline-First)
└────────┬────────┘
         │
         ├───► [IndexedDB] Armazena rascunhos e mídias offline
         │
         ▼
┌─────────────────┐
│  Server Actions │  Processamento e Validação (Zod)
└────────┬────────┘
         │
         ├───► [Resend] Envia OTP e Protocolo por Email
         │
         ▼
┌─────────────────┐
│  Banco de Dados │  PostgreSQL (Supabase)
└─────────────────┘
```

## 📊 Estatísticas (SQL)

Exemplos de queries para extração de métricas do banco de dados:

```sql
-- Total de manifestações registradas no período
SELECT COUNT(*) FROM manifestation 
WHERE "createdAt" > NOW() - INTERVAL '30 days';

-- Manifestações por Tipo (Denúncia, Elogio, etc)
SELECT type, COUNT(*) 
FROM manifestation 
GROUP BY type 
ORDER BY count DESC;

-- Status de atendimento
SELECT status, COUNT(*) 
FROM manifestation 
GROUP BY status;

-- Usuários cadastrados (excluindo anônimos)
SELECT COUNT(*) FROM "user";
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
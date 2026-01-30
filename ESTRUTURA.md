# 📂 Estrutura Completa do Projeto Participa-DF

## 📊 Visão Geral

```
participa-df/
├── 📁 drizzle/                   # Migrações do Banco de Dados (SQL)
├── 📁 public/                    # Arquivos Estáticos (Ícones PWA, Imagens)
├── 📁 scripts/                   # Scripts de manutenção e utilitários
├── 📁 src/                       # Código-fonte principal
│   ├── 📁 app/                   # Next.js App Router (Rotas e Páginas)
│   ├── 📁 data/                  # Dados estáticos (JSON)
│   ├── 📁 features/              # Funcionalidades modulares
│   ├── 📁 lib/                   # Configurações de bibliotecas externas
│   ├── 📁 server/                # Lógica server-side (DB, Auth, Actions)
│   └── 📁 shared/                # Código compartilhado (UI, Hooks, Utils)
├── � supabase/                  # Configurações do Supabase
├── �📄 next.config.ts             # Configuração do Next.js
├── 📄 package.json               # Dependências e scripts npm
└── 📄 tsconfig.json              # Configuração TypeScript
```

## 🗂️ Detalhamento Completo

### `/src/app` - App Router (Rotas)

Estrutura de rotas do **Next.js 16** (App Router).

```
src/app/
├── layout.tsx                    # Layout Raiz (Providers Globais)
├── page.tsx                      # Home Page
├── 📁 manifestacao/              # Fluxo Principal (Wizerd)
│   ├── layout.tsx                # Guard de saída (FlowExitGuard)
│   ├── page.tsx                  # Passo 1: Tipo
│   ├── 📁 identidade/            # Passo 2: Identificação (Auth)
│   ├── 📁 assunto/               # Passo 3: Busca de Assuntos
│   ├── 📁 conteudo/              # Passo 4: Multimídia
│   └── 📁 revisar/               # Passo 5: Confirmação
├── 📁 consultar-manifestacoes/   # Área de acompanhamento
├── 📁 canais/                    # Página informativa
└── 📁 transparencia/             # Portal da transparência
```

### `/src/features` - Funcionalidades

Módulos de negócio isolados.

```
src/features/
├── 📁 auth/                      # Autenticação
│   └── 📁 components/            # Formulários de Login/OTP
├── 📁 home/                      # Página Inicial
│   └── 📁 components/            # Cards, Carrossel de Notícias
└── 📁 manifestation/             # Core da Aplicação
    ├── 📁 components/            # Sidebar, Steps, FlowExitGuard
    └── 📁 hooks/                 # Hooks específicos do domínio
```

### `/src/shared` - Compartilhado

Componentes e utilitários reutilizáveis em toda a aplicação.

```
src/shared/
├── 📁 components/                # UI Kit (Design System)
│   ├── AudioRecorder.tsx         # Gravador de áudio nativo
│   ├── FileUploader.tsx          # Upload com preview
│   ├── AccessibilityMenu.tsx     # Menu VLibras/Contraste
│   └── pwa/                      # Componentes de Instalação PWA
├── 📁 hooks/                     # Custom Hooks Globais
│   ├── useFileUpload.ts          # Lógica de anexos
│   ├── useAudioRecorder.ts       # Lógica de gravação
│   ├── useOramaAssuntos.ts       # Busca semântica (Orama)
│   └── usePWAInstall.ts          # Gerenciamento de instalação
└── 📁 utils/                     # Funções auxiliares
    ├── draftManager.ts           # Gerenciador de rascunhos (IndexedDB)
    └── stepProgress.ts           # Lógica de progresso do wizard
```

### `/src/server` - Backend

Lógica que roda exclusivamente no servidor.

```
src/server/
├── actions/                      # Server Actions (Mutations)
│   └── manifestation.ts          # Criação de manifestação/protocolo
├── db/                           # Camada de Dados
│   ├── schema.ts                 # Definição das tabelas (Drizzle)
│   └── index.ts                  # Cliente de conexão (Postgres)
└── auth.ts                       # Configuração do NextAuth.js
```

### `/src/lib` - Configurações

Adaptadores para bibliotecas externas.

```
src/lib/
├── 📁 seo/                       # SEO Centralizado
│   ├── config.ts                 # Constantes de SEO (Site Config)
│   └── schemas.ts                # JSON-LD Generators
└── 📁 api/                       # Clientes HTTP externos
```

### `/drizzle` - Banco de Dados

```
drizzle/
├── meta/                         # Snapshots do schema
└── migrations/                   # Arquivos .sql gerados pelo Drizzle Kit
```

**Tabelas Principais (`src/server/db/schema.ts`):**
1.  `user` - Usuários do sistema
2.  `manifestation` - Manifestações registradas
3.  `otp_codes` - Códigos de autenticação temporários
4.  `session` - Sessões de login
5.  `account` - Contas vinculadas (OAuth)

## 🔄 Fluxo de Dados (Participa-DF)

```
┌──────────────────────────────────────────────────────────────┐
│                    PIPELINE DE REGISTRO                       │
└──────────────────────────────────────────────────────────────┘

1. ENTRADA (Client-Side)
   Usuário (PWA) → AudioRecorder/FileUploader/TextInput
                 ↓
   IndexedDB (Browser) → Persistência Local (Offline Draft)

2. SUBMISSÃO (Server Actions)
   Formulário → src/server/actions/manifestation.ts
              ↓
   Validação Zod → Checagem de tipos e regras de negócio

3. PERSISTÊNCIA (Drizzle ORM)
   Action → Drizzle Client → Supabase (PostgreSQL)
          ↓
   INSERT INTO manifestations (id, protocol, type, content...)

4. NOTIFICAÇÃO (Resend)
   Action → Resend API → Email com Protocolo para o Cidadão

5. CONSULTA (Client-Side)
   Página /consultar → Server Action → SELECT FROM manifestations
```

## 🚀 Comandos Úteis

```bash
# Execução
npm run dev                       # Inicia servidor local (Turbopack)

# Banco de Dados
npm run db:push                   # Atualiza schema no banco remoto
npm run db:studio                 # Interface visual para o banco

# Qualidade
npm run lint                      # Verificação de código
npm run typecheck                 # Verificação de tipagem TS
```

## 🔐 Arquivos Sensíveis (NÃO commitar)

```
.env                              # Production secrets
.env.local                        # Development secrets
node_modules/                     # Dependências
.next/                            # Build output
```

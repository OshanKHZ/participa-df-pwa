'use client'

import { useRouter } from 'next/navigation'
import { RiArrowLeftLine, RiExternalLinkLine } from 'react-icons/ri'

export default function TransparenciaPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground px-4 py-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="size-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Voltar"
          >
            <RiArrowLeftLine className="size-6" />
          </button>
          <h1 className="text-lg font-bold">Transparência</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        <p className="text-sm text-muted-foreground mb-6">
          Acesse dados e informações sobre a gestão pública do Distrito Federal
        </p>

        {/* Links List */}
        <div className="bg-card rounded-lg border border-border divide-y divide-border">
          {/* Painel de Ouvidoria */}
          <a
            href="http://www.painel.ouv.df.gov.br/dashboard"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 p-4 hover:bg-accent transition-colors"
          >
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-0.5">
                Painel de Ouvidoria
              </h3>
              <p className="text-xs text-muted-foreground">
                Dashboard com estatísticas das manifestações
              </p>
            </div>
            <RiExternalLinkLine className="size-5 text-muted-foreground flex-shrink-0" />
          </a>

          {/* Painel de Transparência Passiva */}
          <a
            href="https://app.powerbi.com/view?r=eyJrIjoiZTg3ZGM2NDktNDA3Yy00ZDBiLWE2ZmItNzJmMTRkNjRjZjk0IiwidCI6IjU3NGNhYTRiLTkxODEtNGI5Yy04ZDhhLTBiMGY3NjkwZDdmNiJ9"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 p-4 hover:bg-accent transition-colors"
          >
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-0.5">
                Painel de Transparência Passiva
              </h3>
              <p className="text-xs text-muted-foreground">
                Dados sobre pedidos de acesso à informação
              </p>
            </div>
            <RiExternalLinkLine className="size-5 text-muted-foreground flex-shrink-0" />
          </a>

          {/* Portal da Transparência */}
          <a
            href="http://www.transparencia.df.gov.br/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 p-4 hover:bg-accent transition-colors"
          >
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-0.5">
                Portal da Transparência
              </h3>
              <p className="text-xs text-muted-foreground">
                Receitas, despesas e gestão fiscal
              </p>
            </div>
            <RiExternalLinkLine className="size-5 text-muted-foreground flex-shrink-0" />
          </a>

          {/* Portal de Dados Abertos */}
          <a
            href="http://www.dados.df.gov.br/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 p-4 hover:bg-accent transition-colors"
          >
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-foreground mb-0.5">
                Portal de Dados Abertos
              </h3>
              <p className="text-xs text-muted-foreground">
                Conjuntos de dados públicos para download
              </p>
            </div>
            <RiExternalLinkLine className="size-5 text-muted-foreground flex-shrink-0" />
          </a>
        </div>
      </main>
    </div>
  )
}

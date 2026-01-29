'use client'

import { useState } from 'react'
import { useParams } from 'next/navigation'
import {
  RiCheckboxCircleLine,
  RiFileCopyLine,
  RiHomeLine,
  RiCheckLine,
  RiPrinterLine,
  RiSearchLine,
} from 'react-icons/ri'
import { DURATION } from '@/shared/constants/designTokens'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { HomeMobileHeader } from '@/shared/components/HomeMobileHeader'
import { LinkButton, Button } from '@/shared/components/Button'

export default function ProtocolPage() {
  const params = useParams()
  const protocol = params.id as string
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(protocol)
      setCopied(true)
      setTimeout(() => setCopied(false), DURATION.COPY_FEEDBACK)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <HomeMobileHeader slogan="Manifestação Registrada" />

      {/* Mobile Container */}
      <div className="lg:hidden min-h-screen bg-background">

        {/* Main Content */}
        <main id="main-content" className="px-4 py-8">
          {/* Success Icon */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-20 h-20 bg-[var(--color-progress)] rounded-full flex items-center justify-center mb-4">
              <RiCheckboxCircleLine className="w-12 h-12 text-white" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">Sucesso!</h2>
            <p className="text-sm text-muted-foreground">
              Sua manifestação foi registrada com sucesso
            </p>
          </div>

          {/* Protocol Card */}
          <div className="bg-card rounded-lg p-6 card-border mb-6">
            <div className="text-center mb-4">
              <p className="text-sm text-muted-foreground mb-2">
                Número do protocolo
              </p>
              <div className="text-3xl font-bold text-primary mb-4 font-mono">
                {protocol}
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopy}
                  variant={copied ? 'success' : 'accent'}
                  className="flex-1 rounded-md"
                  aria-label={copied ? 'Protocolo copiado' : 'Copiar protocolo'}
                >
                  {copied ? (
                    <>
                      <RiCheckLine className="size-4" aria-hidden="true" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <RiFileCopyLine className="size-4" aria-hidden="true" />
                      Copiar
                    </>
                  )}
                </Button>

                <Button
                  onClick={handlePrint}
                  variant="accent"
                  className="flex-1 rounded-md"
                  aria-label="Imprimir protocolo"
                >
                  <RiPrinterLine className="size-4" aria-hidden="true" />
                  Imprimir
                </Button>
              </div>

              <LinkButton
                href="/consultar-manifestacoes"
                variant="secondary"
                size="sm"
                className="w-full mt-3"
              >
                <RiSearchLine className="size-4" aria-hidden="true" />
                Acompanhar manifestação
              </LinkButton>
            </div>

            <div className="border-t border-border pt-4">
              <p className="text-xs text-muted-foreground text-center">
                Guarde este número para acompanhar o andamento da sua manifestação
              </p>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="space-y-4 mb-6">
            <div>
              <h3 className="font-semibold text-muted-foreground text-sm mb-2">
                Próximos passos
              </h3>
              <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                <li>Sua manifestação será analisada pela equipe responsável</li>
                <li>O prazo de resposta é de até 30 dias corridos</li>
                <li>Você pode consultar o status usando o protocolo</li>
              </ul>
            </div>

            <div className="bg-muted rounded-lg p-4">
              <h3 className="font-semibold text-foreground text-sm mb-2">
                Dica
              </h3>
              <p className="text-xs text-foreground">
                Anote o número do protocolo ou tire um print desta tela para
                consultar o andamento posteriormente.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <LinkButton
              href="/"
              variant="secondary"
              className="w-full rounded-md"
            >
              <RiHomeLine className="size-5" aria-hidden="true" />
              Voltar ao início
            </LinkButton>
          </div>
        </main>
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <main id="main-content" className="max-w-2xl mx-auto px-8 py-12">
          {/* Success Icon */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="w-24 h-24 bg-[var(--color-progress)] rounded-full flex items-center justify-center mb-6">
              <RiCheckboxCircleLine className="w-16 h-16 text-white" aria-hidden="true" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-3">Manifestação Registrada!</h1>
            <p className="text-base text-muted-foreground">
              Sua manifestação foi registrada com sucesso
            </p>
          </div>

          {/* Protocol Card */}
          <div className="bg-card rounded-xl p-8 card-border mb-8 shadow-lg">
            <div className="text-center mb-6">
              <p className="text-base text-muted-foreground mb-3">
                Número do protocolo
              </p>
              <div className="text-5xl font-bold text-primary mb-6 font-mono tracking-wider">
                {protocol}
              </div>

              <div className="flex justify-center gap-3">
                <Button
                  onClick={handleCopy}
                  variant={copied ? 'success' : 'accent'}
                  aria-label={copied ? 'Protocolo copiado' : 'Copiar protocolo'}
                >
                  {copied ? (
                    <>
                      <RiCheckLine className="size-5" aria-hidden="true" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <RiFileCopyLine className="size-5" aria-hidden="true" />
                      Copiar protocolo
                    </>
                  )}
                </Button>

                <Button
                  onClick={handlePrint}
                  variant="accent"
                  aria-label="Imprimir protocolo"
                >
                  <RiPrinterLine className="size-5" aria-hidden="true" />
                  Imprimir
                </Button>
              </div>

              <LinkButton
                href="/consultar-manifestacoes"
                variant="secondary"
                size="sm"
                className="mt-3"
              >
                <RiSearchLine className="size-4" aria-hidden="true" />
                Acompanhar manifestação
              </LinkButton>
            </div>

            <div className="border-t border-border pt-6">
              <p className="text-sm text-muted-foreground text-center">
                Guarde este número para acompanhar o andamento da sua manifestação
              </p>
            </div>
          </div>

          {/* Info Boxes */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="font-semibold text-muted-foreground text-base mb-3">
                Próximos passos
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 ml-4 list-disc">
                <li>Sua manifestação será analisada pela equipe responsável</li>
                <li>O prazo de resposta é de até 30 dias corridos</li>
                <li>Você pode consultar o status usando o protocolo</li>
              </ul>
            </div>

            <div className="bg-muted rounded-xl p-6">
              <h3 className="font-semibold text-foreground text-base mb-3">
                Dica
              </h3>
              <p className="text-sm text-foreground leading-relaxed">
                Anote o número do protocolo ou tire um print desta tela para
                consultar o andamento posteriormente.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <LinkButton
                href="/"
                variant="secondary"
              >
                <RiHomeLine className="size-5" aria-hidden="true" />
                Voltar ao início
              </LinkButton>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

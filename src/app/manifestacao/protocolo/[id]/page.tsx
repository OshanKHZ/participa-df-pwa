'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import {
  RiCheckboxCircleLine,
  RiFileCopyLine,
  RiHomeLine,
  RiCheckLine,
} from 'react-icons/ri'
import { DURATION } from '@/shared/constants/designTokens'

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

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="flex items-center justify-center py-4">
          <Image
            src="/logo.svg"
            alt="Participa DF"
            width={180}
            height={40}
            priority
          />
        </div>
        <div className="bg-primary-mobile py-2">
          <h1 className="text-center text-sm font-medium text-white">
            Manifestação Registrada
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        {/* Success Icon */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-20 h-20 bg-[var(--color-progress)] rounded-full flex items-center justify-center mb-4">
            <RiCheckboxCircleLine className="w-12 h-12 text-white" />
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
            <button
              onClick={handleCopy}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all ${
                copied
                  ? 'bg-[var(--color-progress)] text-white'
                  : 'bg-accent text-accent-foreground hover:bg-accent/80'
              }`}
            >
              {copied ? (
                <>
                  <RiCheckLine className="size-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <RiFileCopyLine className="size-4" />
                  Copiar protocolo
                </>
              )}
            </button>
          </div>

          <div className="border-t border-border pt-4">
            <p className="text-xs text-muted-foreground text-center">
              Guarde este número para acompanhar o andamento da sua manifestação
            </p>
          </div>
        </div>

        {/* Info Boxes */}
        <div className="space-y-4 mb-6">
          <div className="bg-accent rounded-lg p-4">
            <h3 className="font-semibold text-accent-foreground text-sm mb-2">
              📋 Próximos passos
            </h3>
            <ul className="text-xs text-accent-foreground space-y-1 ml-4 list-disc">
              <li>Sua manifestação será analisada pela equipe responsável</li>
              <li>O prazo de resposta é de até 30 dias corridos</li>
              <li>Você pode consultar o status usando o protocolo</li>
            </ul>
          </div>

          <div className="bg-card rounded-lg p-4 card-border">
            <h3 className="font-semibold text-foreground text-sm mb-2">
              💡 Dica
            </h3>
            <p className="text-xs text-muted-foreground">
              Anote o número do protocolo ou tire um print desta tela para
              consultar o andamento posteriormente.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-secondary hover:bg-secondary-hover text-secondary-foreground font-medium py-3 px-6 rounded-md text-center btn-hover"
          >
            <span className="flex items-center justify-center gap-2">
              <RiHomeLine className="size-5" />
              Voltar ao início
            </span>
          </Link>

          <button className="w-full text-secondary hover:text-secondary-hover font-medium py-3 px-6">
            Consultar protocolo
          </button>
        </div>
      </main>
    </div>
  )
}

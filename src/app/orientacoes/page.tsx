'use client'

import Link from 'next/link'
import {
  RiShieldCheckLine,
  RiArrowRightSLine,
  RiQuestionLine,
  RiAlertLine,
} from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { MobileHeader } from '@/shared/components/MobileHeader'
import { DesktopHeader } from '@/shared/components/DesktopHeader'

const tips = [
  {
    id: 1,
    title: 'O que você precisa?',
    description: 'Descreva sua necessidade ou problema',
    icon: RiQuestionLine,
  },
  {
    id: 2,
    title: 'O que ocorreu?',
    description: 'Relate os fatos detalhadamente',
    icon: RiQuestionLine,
  },
  {
    id: 3,
    title: 'Quem está envolvido?',
    description: 'Nomes, apelidos ou descrições',
    icon: RiQuestionLine,
  },
  {
    id: 4,
    title: 'Quando ocorreu?',
    description: 'Data, horário, frequência',
    icon: RiQuestionLine,
  },
  {
    id: 5,
    title: 'Onde aconteceu?',
    description: 'Local com pontos de referência',
    icon: RiQuestionLine,
  },
  {
    id: 6,
    title: 'Como ocorreu?',
    description: 'Você presenciou ou relato de terceiros',
    icon: RiQuestionLine,
  },
]

const steps = [
  {
    id: 1,
    title: 'Escolha o tipo',
    description:
      'Denúncia, reclamação, sugestão, elogio, solicitação ou informação',
  },
  {
    id: 2,
    title: 'Selecione o assunto',
    description: 'Busque pelo assunto ou deixe a IA sugerir opções',
  },
  {
    id: 3,
    title: 'Escolha o canal',
    description: 'Texto, áudio ou anexos (pode combinar)',
  },
  {
    id: 4,
    title: 'Escreva ou grave',
    description: 'Mínimo 20 e máximo 12.000 caracteres. Áudio: até 5 minutos',
  },
  {
    id: 5,
    title: 'Identificação (opcional)',
    description: 'Se identifique para acompanhar ou fique anônimo',
  },
  {
    id: 6,
    title: 'Revise e confirme',
    description: 'Confira tudo e receba o número do protocolo',
  },
]

export default function OrientacoesPage() {
  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <MobileHeader title="Orientações" />

      {/* Mobile Layout */}
      <div className="lg:hidden min-h-screen bg-background pb-20">
        <main className="px-4 py-6">
          {/* Identificação Section */}
          <section className="mb-6">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Para acompanhar e receber a resposta, você precisa se identificar.
              O acompanhamento será feito pelo seu e-mail cadastrado.
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed mt-2">
              Se preferir, pode registrar reclamação e denúncia sem se
              identificar, mas não poderá acompanhar e nem receber a resposta.
            </p>
          </section>

          {/* Proteção Section */}
          <section className="mb-6 border-[3px] border-secondary bg-muted/50 p-4">
            <div className="flex items-start gap-3">
              <RiShieldCheckLine className="size-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Proteção ao Denunciante
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  Denúncias são tratadas com sigilo absoluto, conforme Decreto
                  nº 36.462/2015:
                </p>
                <ul className="space-y-1 text-xs">
                  <li className="font-medium text-foreground">
                    • Nenhuma informação pessoal pode ser compartilhada
                  </li>
                  <li className="font-medium text-foreground">
                    • Sigilo obrigatório, mesmo dentro dos órgãos públicos
                  </li>
                  <li className="font-medium text-foreground">
                    • Descumprimento gera responsabilização
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Avisos Importantes Section */}
          <section className="mb-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
              <RiAlertLine className="size-4 text-destructive" />
              Avisos importantes
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>
                  <strong className="text-foreground">Dados pessoais:</strong>{' '}
                  Não escreva seus dados (nome, CPF, e-mail) no texto do
                  registro.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>
                  <strong className="text-foreground">
                    Um assunto por registro:
                  </strong>{' '}
                  Para poda de árvore e tapa buraco, faça 2 registros separados.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>
                  <strong className="text-foreground">Governo Federal:</strong>{' '}
                  Para INSS, CONECTA SUS, GOV.BR, acesse o{' '}
                  <a
                    href="https://falabr.cgu.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary underline"
                  >
                    Sistema Fala BR
                  </a>
                  .
                </span>
              </li>
            </ul>
          </section>

          <hr className="border-border mb-6" />

          {/* Dicas Section */}
          <section className="mb-6">
            <h3 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-3">
              Dicas para o registro
            </h3>
            <div className="space-y-2">
              {tips.map(tip => {
                const Icon = tip.icon
                return (
                  <div
                    key={tip.id}
                    className="flex items-start gap-3 p-3 bg-card border border-border rounded-lg"
                  >
                    <Icon className="size-5 text-secondary flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-foreground mb-0.5">
                        {tip.title}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>

          {/* Passo a Passo Section */}
          <section className="mb-6">
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Passo a passo do registro
            </h3>
            <div className="space-y-3">
              {steps.map(step => (
                <div
                  key={step.id}
                  className="p-3.5 bg-card border border-border rounded-lg"
                >
                  <h4 className="text-sm font-medium text-foreground mb-0.5">
                    <span className="text-secondary font-semibold">
                      {step.id}º passo
                    </span>{' '}
                    - {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* CTA Section */}
          <section className="bg-success rounded-lg p-4">
            <Link
              href="/manifestacao"
              className="inline-flex items-center gap-2 text-white font-medium text-sm"
            >
              Fazer registro
              <RiArrowRightSLine className="size-4" />
            </Link>
          </section>
        </main>

        {/* Bottom Navigation */}
        <MobileBottomNav activeTab="home" isAuthenticated={false} />
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block min-h-screen bg-background pb-12">
        <main className="max-w-3xl mx-auto px-8 py-10">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-foreground mb-3">
              Orientações para o registro
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              Para acompanhar e receber a resposta, você precisa se identificar.
              O acompanhamento será feito pelo seu e-mail cadastrado. Se
              preferir, pode registrar reclamação e denúncia sem se identificar,
              mas não poderá acompanhar e nem receber a resposta.
            </p>
          </div>

          {/* Proteção ao Denunciante */}
          <section className="mb-8 border-[3px] border-secondary bg-muted/50 p-5">
            <div className="flex items-start gap-3">
              <RiShieldCheckLine className="size-5 text-secondary flex-shrink-0 mt-0.5" />
              <div>
                <h2 className="font-semibold text-foreground mb-2">
                  Proteção ao Denunciante
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                  Denúncias são tratadas com sigilo absoluto, conforme Decreto
                  nº 36.462/2015:
                </p>
                <ul className="space-y-1.5 text-sm">
                  <li className="font-medium text-foreground">
                    • Nenhuma informação pessoal pode ser compartilhada
                  </li>
                  <li className="font-medium text-foreground">
                    • Sigilo obrigatório, mesmo dentro dos órgãos públicos
                  </li>
                  <li className="font-medium text-foreground">
                    • Descumprimento gera responsabilização
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Avisos importantes */}
          <section className="mb-8">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4 flex items-center gap-2">
              <RiAlertLine className="size-4 text-destructive" />
              Avisos importantes
            </h2>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-destructive">•</span>
                <span>
                  <strong className="text-foreground">Dados pessoais:</strong>{' '}
                  Não escreva seus dados (nome, CPF, e-mail) no texto do
                  registro.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>
                  <strong className="text-foreground">
                    Um assunto por registro:
                  </strong>{' '}
                  Para poda de árvore e tapa buraco, faça 2 registros separados.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-secondary">•</span>
                <span>
                  <strong className="text-foreground">Governo Federal:</strong>{' '}
                  Para INSS, CONECTA SUS, GOV.BR, acesse o{' '}
                  <a
                    href="https://falabr.cgu.gov.br"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary underline"
                  >
                    Sistema Fala BR
                  </a>
                  .
                </span>
              </li>
            </ul>
          </section>

          <hr className="border-border mb-8" />

          {/* Grid: Dicas + Passo a passo */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            {/* Dicas para o registro */}
            <section>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Dicas para o registro
              </h2>
              <div className="space-y-2">
                {tips.map(tip => (
                  <div
                    key={tip.id}
                    className="flex items-start gap-3 p-3 border border-border rounded-lg"
                  >
                    <RiQuestionLine className="size-4 text-secondary flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-medium text-foreground">
                        {tip.title}
                      </span>
                      <p className="text-xs text-muted-foreground">
                        {tip.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Passo a passo */}
            <section>
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide mb-4">
                Passo a passo
              </h2>
              <div className="space-y-2">
                {steps.map(step => (
                  <div
                    key={step.id}
                    className="p-3 border border-border rounded-lg"
                  >
                    <span className="text-sm font-medium text-foreground">
                      <span className="text-secondary">{step.id}.</span>{' '}
                      {step.title}
                    </span>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between p-5 bg-success rounded-lg">
            <div>
              <p className="text-white font-medium">Pronto para começar?</p>
              <p className="text-white/70 text-sm">
                Registre sua manifestação agora
              </p>
            </div>
            <Link
              href="/manifestacao"
              className="inline-flex items-center gap-2 bg-white text-success font-medium px-4 py-2 rounded-lg hover:bg-white/90 transition-colors text-sm"
            >
              Fazer registro
              <RiArrowRightSLine className="size-4" />
            </Link>
          </div>
        </main>
      </div>
    </>
  )
}

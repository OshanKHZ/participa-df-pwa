'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  RiArrowLeftLine,
  RiShieldCheckLine,
  RiArrowRightSLine,
  RiQuestionLine,
} from 'react-icons/ri'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'

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
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Header */}
      <header className="bg-primary text-white sticky top-0 z-header">
        <div className="px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="size-9 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
              aria-label="Voltar"
            >
              <RiArrowLeftLine className="size-6" />
            </button>
            <h1 className="text-lg font-semibold">
              Orientações para o registro
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-6">
        {/* Identificação Section */}
        <section className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Para acompanhar e receber a resposta, você precisa se identificar. O
            acompanhamento será feito pelo seu e-mail cadastrado.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed mt-2">
            Se preferir, pode registrar reclamação e denúncia sem se
            identificar, mas não poderá acompanhar e nem receber a resposta.
          </p>
        </section>

        {/* Proteção Section */}
        <section className="mb-6">
          <div className="bg-muted border border-border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <RiShieldCheckLine className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-2">
                  Proteção ao Denunciante
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed mb-2">
                  Denúncias são tratadas com sigilo absoluto, conforme Decreto
                  nº 36.462/2015:
                </p>
                <ul className="space-y-1 text-xs text-muted-foreground">
                  <li>• Nenhuma informação pessoal pode ser compartilhada</li>
                  <li>
                    • Sigilo obrigatório, mesmo dentro dos órgãos públicos
                  </li>
                  <li>• Descumprimento gera responsabilização</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Dados Pessoais Section */}
        <section className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            <strong className="text-destructive font-semibold">Atenção:</strong>{' '}
            Não escreva seus dados pessoais (nome, CPF, e-mail, endereço, data
            de nascimento etc.) no texto do registro. Essa medida protege o
            sigilo dos seus dados.
          </p>
        </section>

        {/* Governo Federal Section */}
        <section className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Para assuntos como INSS, CONECTA SUS, GOV.BR e outros do Governo
            Federal, acesse o{' '}
            <Link
              href="#"
              className="text-secondary hover:underline font-medium"
            >
              Sistema Fala BR
            </Link>
            .
          </p>
        </section>

        {/* Um Registro Por Assunto Section */}
        <section className="mb-6">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cada registro deve conter apenas{' '}
            <strong className="text-foreground">1 assunto</strong>. Exemplo:
            para solicitar poda de árvore e tapa buraco, faça 2 registros.
          </p>
        </section>

        {/* Dicas Section */}
        <section className="mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-3">
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
        <section className="bg-secondary/10 border border-secondary/20 rounded-lg p-4">
          <Link
            href="/manifestacao"
            className="inline-flex items-center gap-2 text-secondary font-medium text-sm hover:underline"
          >
            Fazer registro
            <RiArrowRightSLine className="size-4" />
          </Link>
        </section>
      </main>

      {/* Bottom Navigation */}
      <MobileBottomNav activeTab="home" isAuthenticated={false} />
    </div>
  )
}

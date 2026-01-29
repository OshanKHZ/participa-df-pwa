'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import {
  RiSearchLine,
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiFileTextLine,
  RiTimeLine,
  RiShieldCheckLine,
  RiPhoneLine,
  RiMailLine,
} from 'react-icons/ri'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { HomeMobileHeader } from '@/shared/components/HomeMobileHeader'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'

interface FAQItem {
  question: string
  answer: string
  category: string
}

const faqData: FAQItem[] = [
  {
    category: 'Sobre a Ouvidoria',
    question: 'O que é a Ouvidoria?',
    answer:
      'A Ouvidoria é um canal de comunicação entre o cidadão e a administração pública. É por meio dela que você pode registrar manifestações como denúncias, reclamações, sugestões, elogios e solicitações de informação.',
  },
  {
    category: 'Sobre a Ouvidoria',
    question: 'Quem pode registrar uma manifestação?',
    answer:
      'Qualquer pessoa pode registrar uma manifestação, seja de forma identificada ou anônima. No entanto, para acompanhar o andamento da sua manifestação, é recomendado identificar-se.',
  },
  {
    category: 'Sobre a Ouvidoria',
    question: 'Quais tipos de manifestação posso fazer?',
    answer:
      'Você pode registrar: Denúncias (irregularidades), Reclamações (insatisfação com serviços), Sugestões (propostas de melhoria), Elogios (reconhecimento de bom atendimento) e Solicitações (pedidos de informação).',
  },
  {
    category: 'Acompanhamento',
    question: 'Como acompanho minha manifestação?',
    answer:
      'Ao registrar sua manifestação, você receberá um número de protocolo. Com esse número, você pode consultar o andamento da sua solicitação a qualquer momento através do botão "Consultar Protocolo".',
  },
  {
    category: 'Acompanhamento',
    question: 'Qual o prazo para resposta?',
    answer:
      'O prazo máximo para resposta é de 30 dias corridos, conforme estabelecido pela Lei de Acesso à Informação. Em casos complexos, esse prazo pode ser prorrogado por mais 10 dias.',
  },
  {
    category: 'Acompanhamento',
    question: 'Perdi meu número de protocolo, o que fazer?',
    answer:
      'Se você fez a manifestação identificada, entre em contato com a Ouvidoria informando seus dados pessoais e a data aproximada do registro. A equipe poderá localizar seu protocolo.',
  },
  {
    category: 'Privacidade',
    question: 'Posso fazer manifestação anônima?',
    answer:
      'Sim, você pode registrar sua manifestação de forma anônima. Porém, nesse caso, não será possível acompanhar o andamento ou receber resposta sobre o protocolo registrado.',
  },
  {
    category: 'Privacidade',
    question: 'Minha manifestação será pública?',
    answer:
      'Não. Todas as manifestações são tratadas com confidencialidade. Apenas os órgãos responsáveis terão acesso às informações para análise e resposta.',
  },
  {
    category: 'Como Usar',
    question: 'Como funciona o registro por diferentes canais?',
    answer:
      'Você pode registrar sua manifestação de várias formas: por texto escrito, gravação de áudio, upload de imagem ou vídeo. Escolha o canal que for mais conveniente para você.',
  },
  {
    category: 'Como Usar',
    question: 'O que fazer se não concordar com a resposta?',
    answer:
      'Caso não concorde com a resposta recebida, você pode apresentar recurso à Ouvidoria-Geral, explicando os motivos da discordância.',
  },
]

const categoryIcons: Record<string, React.ElementType> = {
  'Sobre a Ouvidoria': RiFileTextLine,
  Acompanhamento: RiTimeLine,
  Privacidade: RiShieldCheckLine,
  'Como Usar': RiSearchLine,
}

export default function AjudaPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const categories = useMemo(() => {
    return Array.from(new Set(faqData.map(faq => faq.category)))
  }, [])

  const filteredFAQs = useMemo(() => {
    let filtered = faqData

    if (selectedCategory) {
      filtered = filtered.filter(faq => faq.category === selectedCategory)
    }

    if (searchQuery) {
      filtered = filtered.filter(
        faq =>
          faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
          faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <HomeMobileHeader />

      <div className="min-h-screen bg-background pb-24 lg:pb-8 lg:max-w-6xl lg:mx-auto">
        {/* Main Content */}
        <main className="px-4 py-4 lg:px-8 lg:py-8">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            {/* Left Column - Logo and Contact Card (Desktop) */}
            <div className="hidden lg:block">
              <div className="sticky top-32">
                {/* Logo */}
                <div className="mb-6">
                  <Image
                    src="/Logo-OUV.svg"
                    alt="Ouvidoria Governo do Distrito Federal"
                    width={280}
                    height={162}
                    className="flex-shrink-0"
                  />
                </div>

                {/* Contact */}
                <div className="border-t border-border pt-6">
                  <h3 className="font-semibold text-foreground mb-4">
                    Ainda precisa de ajuda?
                  </h3>
                  <div className="space-y-2.5">
                    <a
                      href="tel:162"
                      className="flex items-center gap-2.5 p-3 bg-primary-light hover:bg-primary-light/90 rounded-lg transition-colors"
                    >
                      <div className="size-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <RiPhoneLine className="size-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-white/70">Telefone</p>
                        <p className="font-semibold text-sm text-white">162</p>
                      </div>
                    </a>
                    <a
                      href="mailto:ouvidoria@df.gov.br"
                      className="flex items-center gap-2.5 p-3 bg-primary-light hover:bg-primary-light/90 rounded-lg transition-colors"
                    >
                      <div className="size-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <RiMailLine className="size-4 text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-white/70">Email</p>
                        <p className="font-semibold text-sm text-white truncate">
                          ouvidoria@df.gov.br
                        </p>
                      </div>
                    </a>
                  </div>
                  <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border">
                    Atendimento: Segunda a sexta, 8h às 18h
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column - Title, Search and FAQ */}
            <div>
              {/* Desktop Title */}
              <div className="hidden lg:block mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Central de Ajuda
                </h1>
                <p className="text-muted-foreground">
                  Encontre respostas para as perguntas mais frequentes sobre a
                  Ouvidoria
                </p>
              </div>

              {/* Search Bar */}
              <div className="mb-4">
                <div className="relative">
                  <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Buscar perguntas..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-card border-2 border-border rounded-lg text-sm btn-focus focus:border-secondary"
                  />
                </div>
              </div>

              {/* Category Filters */}
              <div className="mb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedCategory === null
                        ? 'bg-secondary text-secondary-foreground'
                        : 'bg-card text-foreground border border-border'
                    }`}
                  >
                    Todas
                  </button>
                  {categories.map(category => {
                    const Icon = categoryIcons[category] || RiFileTextLine
                    return (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                          selectedCategory === category
                            ? 'bg-secondary text-secondary-foreground'
                            : 'bg-card text-foreground border border-border'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        {category}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Results Count */}
              {(searchQuery || selectedCategory) && (
                <div className="mb-3">
                  <p className="text-xs text-muted-foreground">
                    {filteredFAQs.length}{' '}
                    {filteredFAQs.length === 1 ? 'resultado' : 'resultados'}{' '}
                    encontrado{filteredFAQs.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}

              {/* FAQ List */}
              <div className="space-y-2 mb-6">
                {filteredFAQs.length > 0 ? (
                  filteredFAQs.map((faq, index) => (
                    <div
                      key={index}
                      className="bg-card rounded-lg border border-border overflow-hidden"
                    >
                      <button
                        onClick={() => toggleFAQ(index)}
                        className="w-full px-3 py-3 flex items-start justify-between text-left gap-3"
                        aria-expanded={openIndex === index}
                      >
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-secondary font-medium mb-0.5 block">
                            {faq.category}
                          </span>
                          <h3 className="font-semibold text-foreground text-sm leading-snug">
                            {faq.question}
                          </h3>
                        </div>
                        {openIndex === index ? (
                          <RiArrowUpSLine className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        ) : (
                          <RiArrowDownSLine className="size-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                        )}
                      </button>

                      {openIndex === index && (
                        <div className="px-3 pb-3 pt-1">
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <RiSearchLine className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                    <p className="text-foreground font-medium mb-1 text-sm">
                      Nenhum resultado encontrado
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tente buscar com outras palavras-chave
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Contact Section (Mobile only) */}
          <div className="lg:hidden bg-muted rounded-lg p-4">
            <h3 className="font-semibold text-sm text-foreground mb-3">
              Ainda precisa de ajuda?
            </h3>
            <div className="space-y-2.5">
              <a
                href="tel:162"
                className="flex items-center gap-2.5 p-3 bg-primary-light hover:bg-primary-light/90 rounded-lg transition-colors"
              >
                <div className="size-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <RiPhoneLine className="size-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/70">Telefone</p>
                  <p className="font-semibold text-sm text-white">162</p>
                </div>
              </a>
              <a
                href="mailto:ouvidoria@df.gov.br"
                className="flex items-center gap-2.5 p-3 bg-primary-light hover:bg-primary-light/90 rounded-lg transition-colors"
              >
                <div className="size-8 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <RiMailLine className="size-4 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-white/70">Email</p>
                  <p className="font-semibold text-sm text-white truncate">
                    ouvidoria@df.gov.br
                  </p>
                </div>
              </a>
            </div>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-border">
              Atendimento: Segunda a sexta, 8h às 18h
            </p>
          </div>
        </main>

        {/* Mobile Bottom Nav */}
        <div className="lg:hidden">
          <MobileBottomNav activeTab="help" isAuthenticated={false} />
        </div>
      </div>
    </>
  )
}

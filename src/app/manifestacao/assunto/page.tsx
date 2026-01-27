'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { RiSearchLine, RiCloseLine, RiVolumeUpLine, RiArrowRightLine } from 'react-icons/ri'
import { create, insertMultiple, search, type AnyOrama } from '@orama/orama'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { Button } from '@/shared/components/Button'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { useTextToSpeech } from '@/shared/hooks/useTextToSpeech'
import {
  COMPLETED_STEPS,
  DURATION,
  STEPS,
} from '@/shared/constants/designTokens'
import assuntosData from '@/data/assuntos-completo.json'

interface Assunto {
  id: number
  name: string
}

// Semantic keyword expansion for better search results
const SEMANTIC_EXPANSIONS: Record<string, string[]> = {
  // Educação e crianças
  crianca: [
    'escola',
    'creche',
    'uniforme',
    'merenda',
    'ensino',
    'infantil',
    'educacao',
    'aluno',
    'matricula',
    'bercario',
  ],
  filho: [
    'escola',
    'creche',
    'uniforme',
    'merenda',
    'ensino',
    'infantil',
    'educacao',
    'aluno',
    'matricula',
  ],
  estudante: [
    'escola',
    'uniforme',
    'merenda',
    'ensino',
    'educacao',
    'aluno',
    'professor',
    'aula',
  ],
  escola: [
    'ensino',
    'educacao',
    'professor',
    'aluno',
    'sala',
    'uniforme',
    'merenda',
    'matricula',
  ],
  professor: ['escola', 'ensino', 'educacao', 'docente', 'aula'],

  // Saúde
  saude: [
    'medico',
    'hospital',
    'ubs',
    'posto',
    'vacina',
    'consulta',
    'exame',
    'atendimento',
    'tratamento',
    'remedio',
    'medicamento',
  ],
  doente: [
    'medico',
    'hospital',
    'ubs',
    'posto',
    'consulta',
    'atendimento',
    'saude',
    'tratamento',
  ],
  medico: [
    'hospital',
    'ubs',
    'posto',
    'consulta',
    'atendimento',
    'saude',
    'especialista',
  ],
  hospital: [
    'medico',
    'atendimento',
    'consulta',
    'emergencia',
    'internacao',
    'saude',
  ],
  vacina: ['vacinacao', 'imunizacao', 'saude', 'posto', 'ubs'],
  remedio: ['medicamento', 'farmacia', 'receita', 'saude'],

  // Transporte
  transporte: [
    'onibus',
    'metro',
    'brt',
    'linha',
    'passe',
    'tarifa',
    'bilhete',
    'cartao',
  ],
  onibus: [
    'transporte',
    'linha',
    'horario',
    'ponto',
    'parada',
    'itinerario',
    'passagem',
  ],
  metro: ['transporte', 'estacao', 'linha', 'trem', 'bilhete'],

  // Saneamento e infraestrutura
  agua: [
    'caesb',
    'encanamento',
    'esgoto',
    'vazamento',
    'abastecimento',
    'fornecimento',
    'falta',
  ],
  esgoto: ['caesb', 'saneamento', 'vazamento', 'entupimento', 'fossa'],
  vazamento: ['agua', 'encanamento', 'cano', 'tubulacao'],

  // Limpeza urbana
  lixo: ['coleta', 'entulho', 'limpeza', 'gari', 'caminhao', 'caçamba'],
  entulho: ['lixo', 'coleta', 'remocao', 'caçamba'],

  // Vias e ruas
  rua: [
    'via',
    'logradouro',
    'pavimentacao',
    'asfalto',
    'buraco',
    'tapa-buraco',
  ],
  buraco: ['pavimentacao', 'asfalto', 'via', 'rua', 'tapa-buraco'],
  asfalto: ['pavimentacao', 'via', 'rua', 'recapeamento'],

  // Iluminação
  luz: ['iluminacao', 'poste', 'lampada', 'energia', 'ceb'],
  poste: ['iluminacao', 'luz', 'lampada', 'energia'],

  // Segurança
  policia: ['seguranca', 'viatura', 'patrulhamento', 'delegacia', 'pm'],
  violencia: ['seguranca', 'policia', 'crime', 'agressao'],
  roubo: ['seguranca', 'policia', 'crime', 'furto'],

  // Documentos e serviços
  documento: ['identidade', 'rg', 'cpf', 'certidao', 'carteira'],
  carteira: ['cnh', 'motorista', 'habilitacao', 'detran'],

  // Veículos e trânsito
  carro: [
    'veiculo',
    'automovel',
    'cnh',
    'detran',
    'ipva',
    'licenciamento',
    'multa',
  ],
  veiculo: ['carro', 'automovel', 'moto', 'detran', 'ipva', 'licenciamento'],
  moto: ['veiculo', 'motocicleta', 'cnh', 'detran', 'ipva'],
  multa: ['infracao', 'detran', 'transito', 'veiculo'],
  detran: ['cnh', 'habilitacao', 'veiculo', 'licenciamento', 'ipva'],

  // Assistência social
  assistencia: ['social', 'ajuda', 'beneficio', 'auxilio', 'programa'],
  bolsa: ['familia', 'beneficio', 'auxilio', 'assistencia'],

  // Animais
  animal: ['cachorro', 'gato', 'pet', 'veterinario', 'zoonose'],
  cachorro: ['animal', 'pet', 'castracao', 'vacina', 'zoonose'],

  // Meio ambiente
  ambiente: ['meio', 'arvore', 'poda', 'parque', 'verde'],
  arvore: ['poda', 'corte', 'ambiente', 'meio'],

  // Comércio e fiscalização
  comercio: ['loja', 'estabelecimento', 'fiscalizacao', 'licenca', 'alvara'],
  bar: ['comercio', 'estabelecimento', 'fiscalizacao', 'barulho', 'som'],
  barulho: ['som', 'ruido', 'poluicao', 'sonora'],
}

export default function AssuntoPage() {
  const router = useRouter()
  const { navigateToStep } = useStepNavigation()
  const { speak } = useTextToSpeech()
  const [searchTerm, setSearchTerm] = useState('')
  const [desktopSearchTerm, setDesktopSearchTerm] = useState('')
  const [selectedAssunto, setSelectedAssunto] = useState<Assunto | null>(null)
  const [oramaDB, setOramaDB] = useState<AnyOrama | null>(null)
  const [filteredAssuntos, setFilteredAssuntos] = useState<Assunto[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const assuntos = assuntosData.assunto as Assunto[]

  // Initialize Orama database
  useEffect(() => {
    async function initOrama() {
      try {
        const db = await create({
          schema: {
            id: 'string',
            name: 'string',
          },
        })

        // Convert id to string for Orama
        const assuntosWithStringId = assuntos.map(a => ({
          ...a,
          id: String(a.id),
        }))

        await insertMultiple(db, assuntosWithStringId)
        setOramaDB(db)
        setFilteredAssuntos(assuntos) // Show all initially
      } catch (error) {
        console.error('Failed to initialize Orama:', error)
        // Fallback to showing all assuntos
        setFilteredAssuntos(assuntos)
      }
    }

    initOrama()
  }, [assuntos])

  // Expand search term with semantic keywords
  const expandSearchTerm = (term: string): string[] => {
    const normalized = term
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
    const terms = [normalized]

    // Add semantic expansions
    Object.entries(SEMANTIC_EXPANSIONS).forEach(([key, expansions]) => {
      if (normalized.includes(key)) {
        terms.push(...expansions)
      }
    })

    return [...new Set(terms)]
  }

  // Perform semantic search with Orama
  useEffect(() => {
    async function performSearch() {
      const currentSearchTerm = desktopSearchTerm || searchTerm
      if (!currentSearchTerm.trim()) {
        setFilteredAssuntos(assuntos)
        setIsSearching(false)
        return
      }

      setIsSearching(true)

      try {
        const expandedTerms = expandSearchTerm(currentSearchTerm)
        const resultsMap = new Map<number, Assunto>()

        if (!oramaDB) {
          // Fallback to simple filter if Orama not ready
          expandedTerms.forEach(term => {
            assuntos.forEach(assunto => {
              const normalizedName = assunto.name
                .toLowerCase()
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
              if (normalizedName.includes(term)) {
                resultsMap.set(assunto.id, assunto)
              }
            })
          })
        } else {
          // Search for each expanded term
          for (const term of expandedTerms) {
            const searchResults = await search(oramaDB, {
              term: term,
              properties: ['name'],
              tolerance: 2,
              boost: { name: 1.5 },
              limit: 50,
            })

            searchResults.hits.forEach(hit => {
              const stringId = hit.document.id as string
              const assunto = assuntos.find(a => String(a.id) === stringId)
              if (assunto) {
                resultsMap.set(assunto.id, assunto)
              }
            })
          }
        }

        setFilteredAssuntos(Array.from(resultsMap.values()))
      } catch (error) {
        console.error('Search error:', error)
        // Fallback to simple search on error
        const normalizedSearch = searchTerm
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')

        const filtered = assuntos.filter(assunto => {
          const normalizedName = assunto.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
          return normalizedName.includes(normalizedSearch)
        })
        setFilteredAssuntos(filtered)
      } finally {
        setIsSearching(false)
      }
    }

    const timeoutId = setTimeout(performSearch, DURATION.SEARCH_DEBOUNCE)
    return () => clearTimeout(timeoutId)
  }, [searchTerm, desktopSearchTerm, oramaDB, assuntos])

  // Load saved selection on mount
  useEffect(() => {
    const savedAssuntoId = localStorage.getItem('manifestation_subject_id')
    if (savedAssuntoId) {
      const saved = assuntos.find(a => a.id === parseInt(savedAssuntoId))
      if (saved) {
        setSelectedAssunto(saved)
      }
    }
  }, [assuntos])

  const handleSelectAssunto = (assunto: Assunto) => {
    setSelectedAssunto(assunto)
    localStorage.setItem('manifestation_subject_id', assunto.id.toString())
    localStorage.setItem('manifestation_subject_name', assunto.name)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleBack = () => {
    router.push('/manifestacao')
  }

  const handleNext = () => {
    if (selectedAssunto) {
      router.push('/manifestacao/conteudo')
    }
  }

  return (
    <>
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Container */}
      <div className="lg:hidden min-h-screen bg-background pb-40">
        {/* Header */}
        <AccessibleHeader
          currentStep={STEPS.SUBJECT}
          totalSteps={STEPS.TOTAL}
          completedSteps={COMPLETED_STEPS.AT_SUBJECT}
        />

        {/* Main Content */}
        <main className="px-4 py-6">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-foreground mb-2">
              Qual o assunto da sua manifestação?{' '}
              <button
                onClick={() =>
                  speak(
                    'Qual o assunto da sua manifestação? Selecione o assunto que mais se aproxima da sua manifestação'
                  )
                }
                className="inline-flex size-5 rounded-full bg-secondary hover:bg-secondary-hover items-center justify-center transition-colors align-middle"
                aria-label="Ouvir instruções"
              >
                <RiVolumeUpLine className="size-3 text-white" />
              </button>
            </h2>
            <p className="text-sm text-muted-foreground">
              Selecione o assunto que mais se aproxima da sua manifestação
            </p>
          </div>

          {/* Search Input */}
          <div className="mb-4">
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Busca inteligente de assuntos..."
                className="w-full pl-10 pr-10 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                aria-label="Buscar assunto"
              />
              {isSearching ? (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="size-5 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-3 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
                    aria-label="Limpar busca"
                  >
                    <RiCloseLine className="size-5 text-muted-foreground" />
                  </button>
                )
              )}
            </div>
          </div>

          {/* Selected Subject Display */}
          {selectedAssunto && (
            <div className="mb-4 p-4 bg-success/10 border-2 border-success rounded-lg">
              <p className="text-xs font-semibold text-success mb-1">
                Assunto selecionado:
              </p>
              <p className="text-sm text-foreground font-medium">
                {selectedAssunto.name}
              </p>
            </div>
          )}

          {/* Subjects List - Only show when searching */}
          {searchTerm && (
            <div className="space-y-2">
              {filteredAssuntos.length > 0 ? (
                filteredAssuntos.map((assunto: Assunto) => {
                  const isSelected = selectedAssunto?.id === assunto.id

                  return (
                    <button
                      key={assunto.id}
                      onClick={() => handleSelectAssunto(assunto)}
                      className={`w-full px-3 py-2 rounded-lg border-2 text-left transition-all ${
                        isSelected
                          ? 'border-success bg-success/10'
                          : 'border-border bg-card hover:bg-accent'
                      }`}
                    >
                      <p
                        className={`text-sm font-medium ${isSelected ? 'text-success' : 'text-foreground'}`}
                      >
                        {assunto.name}
                      </p>
                    </button>
                  )
                })
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">
                    Nenhum assunto encontrado para "{searchTerm}"
                  </p>
                  <button
                    onClick={handleClearSearch}
                    className="mt-4 text-secondary hover:text-secondary-hover font-medium"
                  >
                    Limpar busca
                  </button>
                </div>
              )}
            </div>
          )}
        </main>

        {/* Footer */}
        <NavigationFooter
          currentStep={STEPS.SUBJECT}
          totalSteps={STEPS.TOTAL}
          onBack={handleBack}
          onNext={handleNext}
          onNavigateToStep={navigateToStep}
          nextDisabled={!selectedAssunto}
          showAnonymousInfo={false}
          steps={getStepProgress(STEPS.SUBJECT)}
        />
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <main className="lg:max-w-2xl lg:mx-auto lg:px-8 lg:py-12">
          {/* Progress Steps */}
          <div className="mb-10">
            <div className="flex items-center justify-between">
              {[
                { num: 1, label: 'Tipo', current: false, completed: true },
                { num: 2, label: 'Assunto', current: true, completed: false },
                { num: 3, label: 'Conteúdo', current: false, completed: false },
                { num: 4, label: 'Confirmação', current: false, completed: false },
              ].map((step, index) => (
                <div key={step.num} className="flex flex-col items-center flex-1">
                  <span className={`text-xs font-medium mb-2 ${
                    step.current ? 'text-foreground' : 'text-muted-foreground'
                  }`}>
                    {step.label}
                  </span>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 ${
                    step.current
                      ? 'bg-secondary border-secondary text-white'
                      : step.completed
                        ? 'bg-success border-success text-white'
                        : 'bg-card border-border text-muted-foreground'
                  }`}>
                    {step.completed && !step.current ? '✓' : step.num}
                  </div>
                  {index < 3 && (
                    <div className="flex-1 h-0.5 bg-border -mt-5 mx-2 self-start translate-x-1/2" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-foreground mb-2">
              Nova Manifestação
            </h1>
            <p className="text-muted-foreground">
              Selecione o assunto da sua manifestação.
            </p>
          </div>

          {/* Subject Select */}
          <div className="mb-8 relative">
            <label htmlFor="desktop-subject-search" className="block text-sm font-medium text-foreground mb-2">
              Assunto
            </label>
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none" />
              <input
                id="desktop-subject-search"
                type="text"
                value={desktopSearchTerm}
                onChange={e => {
                  setDesktopSearchTerm(e.target.value)
                  setDropdownOpen(true)
                }}
                onFocus={() => setDropdownOpen(true)}
                placeholder="Digite para buscar assuntos..."
                className="w-full pl-10 pr-10 py-3 border-2 border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary focus:border-secondary"
                aria-label="Buscar assunto"
              />
              {desktopSearchTerm && (
                <button
                  onClick={() => {
                    setDesktopSearchTerm('')
                    setDropdownOpen(false)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 size-6 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
                  aria-label="Limpar busca"
                >
                  <RiCloseLine className="size-5 text-muted-foreground" />
                </button>
              )}
            </div>

            {/* Dropdown */}
            {dropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDropdownOpen(false)}
                />
                <div className="absolute z-50 w-full mt-1 bg-card border-2 border-border rounded-lg shadow-lg max-h-[60vh] overflow-y-auto">
                  {filteredAssuntos.length > 0 ? (
                    filteredAssuntos.slice(0, 50).map((assunto: Assunto) => {
                      const isSelected = selectedAssunto?.id === assunto.id
                      return (
                        <button
                          key={assunto.id}
                          onClick={() => {
                            handleSelectAssunto(assunto)
                            setDesktopSearchTerm(assunto.name)
                            setDropdownOpen(false)
                          }}
                          className={`w-full px-4 py-3 text-left border-b border-border last:border-b-0 transition-colors ${
                            isSelected
                              ? 'bg-success/10 text-success'
                              : 'hover:bg-accent text-foreground'
                          }`}
                        >
                          <p className="text-sm font-medium">{assunto.name}</p>
                        </button>
                      )
                    })
                  ) : (
                    <div className="px-4 py-8 text-center">
                      <p className="text-sm text-muted-foreground">
                        Nenhum assunto encontrado
                      </p>
                    </div>
                  )}
                </div>
              </>
            )}
            <p className="text-xs text-muted-foreground mt-2">
              {selectedAssunto ? `Selecionado: ${selectedAssunto.name}` : 'Digite para buscar e selecione um assunto'}
            </p>
          </div>

          {/* Desktop Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button variant="link" onClick={handleBack}>
              Voltar
            </Button>
            <Button onClick={handleNext} disabled={!selectedAssunto}>
              Avançar
              <RiArrowRightLine className="size-5" />
            </Button>
          </div>
        </main>
      </div>
    </>
  )
}

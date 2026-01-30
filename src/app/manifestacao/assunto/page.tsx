'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiSearchLine,
  RiCloseLine,
  RiVolumeUpLine,
  RiArrowRightLine,
} from 'react-icons/ri'
import { AccessibleHeader } from '@/features/manifestation/components/AccessibleHeader'
import { NavigationFooter } from '@/features/manifestation/components/NavigationFooter'
import { FormSidebar } from '@/features/manifestation/components/FormSidebar'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { Button } from '@/shared/components/Button'
import { ManifestationHeader } from '@/shared/components/Stepper'
import { getStepProgress } from '@/shared/utils/stepProgress'
import { useStepNavigation } from '@/shared/hooks/useStepNavigation'
import { useTextToSpeech } from '@/shared/hooks/useTextToSpeech'
import { useOramaAssuntos } from '@/shared/hooks/useOramaAssuntos'
import {
  COMPLETED_STEPS,
  DURATION,
  STEPS,
} from '@/shared/constants/designTokens'

interface Assunto {
  id: number
  name: string
}

export default function AssuntoPage() {
  const router = useRouter()
  const { navigateToStep } = useStepNavigation()
  const { speak } = useTextToSpeech()
  const { searchAssuntos, allAssuntos } = useOramaAssuntos()

  const [searchTerm, setSearchTerm] = useState('')
  const [desktopSearchTerm, setDesktopSearchTerm] = useState('')
  const [selectedAssunto, setSelectedAssunto] = useState<Assunto | null>(null)

  // Initialize filtered list when allAssuntos is available
  const [filteredAssuntos, setFilteredAssuntos] = useState<Assunto[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  // Initialize filtered list when allAssuntos is available
  useEffect(() => {
    if (allAssuntos.length > 0 && !searchTerm && !desktopSearchTerm) {
      setFilteredAssuntos(allAssuntos)
    }
  }, [allAssuntos, searchTerm, desktopSearchTerm])

  // Optimized search effect
  useEffect(() => {
    const currentSearchTerm = desktopSearchTerm || searchTerm

    const performSearch = async () => {
      if (!currentSearchTerm.trim()) {
        setFilteredAssuntos(allAssuntos)
        setIsSearching(false)
        return
      }

      setIsSearching(true)
      try {
        const results = await searchAssuntos(currentSearchTerm)
        setFilteredAssuntos(results)
      } catch (error) {
        console.error('Search error:', error)
        // Fallback to simple filtering
        const normalizedSearch = currentSearchTerm
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')

        const filtered = allAssuntos.filter(assunto => {
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
  }, [searchTerm, desktopSearchTerm, searchAssuntos, allAssuntos])

  // Load saved selection on mount
  useEffect(() => {
    const savedAssuntoId = localStorage.getItem('manifestation_subject_id')
    if (savedAssuntoId && allAssuntos.length > 0) {
      const saved = allAssuntos.find(a => a.id === parseInt(savedAssuntoId))
      if (saved) {
        setSelectedAssunto(saved)
      }
    }
  }, [allAssuntos])

  const handleSelectAssunto = (assunto: Assunto) => {
    setSelectedAssunto(assunto)
    localStorage.setItem('manifestation_subject_id', assunto.id.toString())
    localStorage.setItem('manifestation_subject_name', assunto.name)
  }

  const handleClearSearch = () => {
    setSearchTerm('')
  }

  const handleBack = () => {
    router.push('/manifestacao/identidade')
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
            <h1 className="text-xl font-bold text-foreground mb-2">
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
            </h1>
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
                className="w-full pl-10 pr-10 py-3 border-2 border-border rounded-lg btn-focus focus:border-secondary"
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
          steps={getStepProgress(STEPS.SUBJECT)}
        />
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <div className="grid grid-cols-[1fr_600px_1fr] gap-12 py-12 px-8">
          {/* Coluna Esquerda - Sidebar */}
          <div className="flex justify-end">
            <FormSidebar helpText="Busque e selecione o assunto que melhor descreve sua manifestação. Isso ajuda a categorizar e direcionar corretamente sua solicitação." />
          </div>

          {/* Coluna Central - Main Content (sempre centralizado) */}
          <main className="w-full">
            <ManifestationHeader
              currentStep={STEPS.SUBJECT}
              totalSteps={STEPS.TOTAL}
              description="Selecione o assunto da sua manifestação."
              onStepClick={navigateToStep}
            />

            {/* Subject Select */}
            <div className="mb-8 relative">
              <label
                htmlFor="desktop-subject-search"
                className="block text-sm font-medium text-foreground mb-2"
              >
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
                  className="w-full pl-10 pr-10 py-3 border-2 border-border rounded-lg btn-focus focus:border-secondary"
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
                            <p className="text-sm font-medium">
                              {assunto.name}
                            </p>
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
                {selectedAssunto
                  ? `Selecionado: ${selectedAssunto.name}`
                  : 'Digite para buscar e selecione um assunto'}
              </p>
            </div>

            {/* Desktop Navigation */}
            <div className="flex items-center justify-between pt-6 border-t border-border">
              <Button variant="link" onClick={handleBack}>
                Voltar
              </Button>
              <Button
                variant="success"
                onClick={handleNext}
                disabled={!selectedAssunto}
              >
                Avançar
                <RiArrowRightLine className="size-5" />
              </Button>
            </div>
          </main>

          {/* Coluna Direita - Vazia (para manter centralização) */}
          <div />
        </div>
      </div>
    </>
  )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiDraftLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
} from 'react-icons/ri'
import { Button } from '@/shared/components/Button'
import { getDrafts, deleteDraft, loadDraft } from '@/shared/utils/draftManager'
import {
  getUserManifestations,
  getManifestationByProtocol,
} from '@/server/actions/manifestation'
import { RiSearchLine } from 'react-icons/ri'
import { toast } from 'sonner'
import type { ManifestationDraft } from '@/shared/types/manifestation'
import { MobileHeader } from '@/shared/components/MobileHeader'

export default function HistoryPage() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<ManifestationDraft[]>([])
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [submitted, setSubmitted] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState<'submitted' | 'drafts'>(
    'submitted'
  )
  const [isLoading, setIsLoading] = useState(true)
  const [protocolSearch, setProtocolSearch] = useState('')
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setIsLoading(true)
    try {
      // Parallel fetch: Drafts (Local) + Submitted (Server)
      const [draftsData, submittedData] = await Promise.all([
        getDrafts(),
        getUserManifestations(),
      ])

      setDrafts(draftsData)
      setSubmitted(submittedData)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchProtocol = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!protocolSearch.trim()) {
      // If empty, reload original history (if logged in)
      loadHistory()
      return
    }

    setIsSearching(true)
    try {
      // First, try to filter locally if we have data (logged in user case)
      if (submitted.length > 0) {
        const foundLocal = submitted.filter(item =>
          item.protocol.toLowerCase().includes(protocolSearch.toLowerCase())
        )
        if (foundLocal.length > 0) {
          setSubmitted(foundLocal)
          setIsSearching(false)
          return
        }
      }

      // If not found locally or empty list (anonymous), fetch from server
      const found = await getManifestationByProtocol(protocolSearch)
      if (found) {
        setSubmitted([found])
      } else {
        setSubmitted([])
      }
    } catch (error) {
      console.error('Error searching protocol:', error)
      setSubmitted([]) // Not found or error
    } finally {
      setIsSearching(false)
    }
  }

  const handleDeleteDraft = async (id: string) => {
    // Optimistic update
    setDrafts(drafts.filter(d => d.id !== id))

    // Perform deletion
    await deleteDraft(id)

    toast.success('Rascunho excluído', {
      description: 'O rascunho foi removido dos seus registros.',
      duration: 3000,
    })

    // Sync to be sure
    const newDrafts = await getDrafts()
    setDrafts(newDrafts)
  }

  const handleContinueDraft = (draft: ManifestationDraft) => {
    loadDraft(draft)
    // Navigate to appropriate step based on what's filled
    if (draft.content?.text || draft.channels) {
      router.push('/manifestacao/conteudo')
    } else if (draft.channels) {
      router.push('/manifestacao/canal')
    } else if (draft.subject) {
      router.push('/manifestacao/assunto')
    } else {
      router.push('/manifestacao')
    }
  }

  const formatDate = (date: Date | string) => {
    if (!date) return '-'
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      denuncia: 'Denúncia',
      reclamacao: 'Reclamação',
      sugestao: 'Sugestão',
      elogio: 'Elogio',
      solicitacao: 'Solicitação',
      informacao: 'Informação',
    }
    return types[type] || type
  }

  return (
    <>
      <MobileHeader title="Minhas Manifestações" />

      <div className="min-h-screen bg-background pb-20">
        {/* Tabs */}
        <div className="bg-white border-b border-border sticky sticky-top-tabs z-tabs">
          <div className="flex">
            <button
              onClick={() => setActiveTab('submitted')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'submitted'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <RiCheckLine className="size-5" />
                Enviadas
              </div>
            </button>
            <button
              onClick={() => setActiveTab('drafts')}
              className={`flex-1 py-3 px-4 font-medium transition-colors ${
                activeTab === 'drafts'
                  ? 'text-secondary border-b-2 border-secondary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <RiDraftLine className="size-5" />
                Rascunhos ({drafts.length})
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="px-4 py-6">
          {activeTab === 'submitted' ? (
            <div className="space-y-4">
              {/* Search Box */}
              <form onSubmit={handleSearchProtocol} className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Buscar por protocolo..."
                    className="w-full pl-4 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                    value={protocolSearch}
                    onChange={e => setProtocolSearch(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSearching}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 flex items-center justify-center"
                >
                  {isSearching ? '...' : <RiSearchLine className="size-5" />}
                </button>
              </form>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              ) : submitted.length === 0 ? (
                <div className="text-center py-12">
                  <RiCheckLine className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma manifestação encontrada.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Faça login para ver seu histórico ou busque por um
                    protocolo.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {submitted.map(item => (
                    <div
                      key={item.id}
                      className="bg-card border card-border rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-6 rounded-full flex items-center justify-center ${item.status === 'done' ? 'bg-success' : 'bg-secondary'}`}
                              >
                                <RiCheckLine className="size-4 text-white" />
                              </div>
                              <span
                                className={`text-sm font-semibold ${item.status === 'done' ? 'text-success' : 'text-secondary'}`}
                              >
                                {item.status === 'received'
                                  ? 'Recebida'
                                  : item.status === 'analyzing'
                                    ? 'Em Análise'
                                    : item.status === 'done'
                                      ? 'Concluída'
                                      : 'Enviada'}
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                              {formatDate(item.createdAt)}
                            </span>
                          </div>

                          <h3 className="font-semibold text-foreground mb-1">
                            {getTypeLabel(item.type)}
                          </h3>
                          {item.subject && (
                            <p className="text-sm text-muted-foreground mb-1">
                              {item.subject}
                            </p>
                          )}
                          <p className="text-sm font-mono text-secondary mb-1">
                            Protocolo: {item.protocol}
                          </p>
                          {item.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                              {item.description}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              ) : drafts.length === 0 ? (
                <div className="text-center py-12">
                  <RiDraftLine className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Nenhum rascunho salvo</p>
                </div>
              ) : (
                drafts.map(draft => (
                  <div
                    key={draft.id}
                    className="bg-card border card-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground mb-1">
                          {getTypeLabel(draft.type)}
                        </h3>
                        {draft.subject && (
                          <p className="text-sm text-secondary font-medium mb-1">
                            {draft.subject.name}
                          </p>
                        )}
                        {draft.content?.text && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {draft.content.text}
                          </p>
                        )}

                        {/* Attachments & Badges */}
                        <div className="flex flex-wrap gap-2 mb-2">
                          {draft.content?.audio && (
                            <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                              🎙️ Áudio gravado
                            </span>
                          )}
                          {draft.content?.files &&
                            draft.content.files.length > 0 && (
                              <span className="inline-flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded text-muted-foreground">
                                📎 {draft.content.files.length} anexo(s)
                              </span>
                            )}
                        </div>

                        <p className="text-xs text-muted-foreground mt-1">
                          Atualizado em {formatDate(draft.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleContinueDraft(draft)}
                        variant="secondary"
                        size="sm"
                        className="flex-1"
                      >
                        <RiEditLine className="size-4" />
                        Continuar
                      </Button>
                      <button
                        onClick={() => handleDeleteDraft(draft.id)}
                        className="py-2 px-3 border-2 border-border text-destructive rounded-lg hover:bg-destructive/10 transition-colors flex items-center justify-center"
                        aria-label="Excluir rascunho"
                      >
                        <RiDeleteBinLine className="size-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

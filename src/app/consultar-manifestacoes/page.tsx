'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiDraftLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
  RiSearchLine,
  RiFileCopyLine,
  RiLoginBoxLine,
} from 'react-icons/ri'
import { Button, LinkButton } from '@/shared/components/Button'
import { getDrafts, deleteDraft, loadDraft } from '@/shared/utils/draftManager'
import {
  getUserManifestations,
  getManifestationByProtocol,
} from '@/server/actions/manifestation'
import { toast } from 'sonner'
import type { ManifestationDraft } from '@/shared/types/manifestation'
import { MobileHeader } from '@/shared/components/MobileHeader'
import type { manifestations } from '@/server/db/schema'

type Manifestation = typeof manifestations.$inferSelect

export default function HistoryPage() {
  const router = useRouter() // Used for continuing drafts
  const [drafts, setDrafts] = useState<ManifestationDraft[]>([])
  const [submitted, setSubmitted] = useState<Manifestation[]>([])
  const [submittedOriginal, setSubmittedOriginal] = useState<Manifestation[]>([])
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
      setSubmittedOriginal(submittedData)
    } catch (error) {
      console.error('Error loading history:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearchProtocol = async (e: React.FormEvent) => {
    e.preventDefault()
    const searchValue = protocolSearch.trim()

    if (!searchValue) {
      // If empty, reload original history (if logged in)
      loadHistory()
      return
    }

    setIsSearching(true)
    try {
      // First, try to filter locally if we have data (logged in user case)
      if (submittedOriginal.length > 0) {
        const foundLocal = submittedOriginal.filter(item =>
          item.protocol.toLowerCase().includes(searchValue.toLowerCase())
        )
        if (foundLocal.length > 0) {
          setSubmitted(foundLocal)
          setIsSearching(false)
          return
        }
      }

      // If not found locally or empty list (anonymous), fetch from server
      const found = await getManifestationByProtocol(searchValue)
      if (found) {
        setSubmitted([found])
      } else {
        setSubmitted([])
        toast.error('Protocolo não encontrado', {
          description: 'Verifique o código e tente novamente.',
          duration: 3000,
        })
      }
    } catch (error) {
      console.error('Error searching protocol:', error)
      setSubmitted([])
      toast.error('Erro ao buscar protocolo', {
        duration: 3000,
      })
    } finally {
      setIsSearching(false)
    }
  }

  const handleCopyProtocol = async (protocol: string) => {
    try {
      await navigator.clipboard.writeText(protocol)
      toast.success('Protocolo copiado!', {
        description: protocol,
        duration: 2000,
      })
    } catch {
      toast.error('Não foi possível copiar', {
        duration: 2000,
      })
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
        <div className="bg-white border-b border-border sticky top-0 z-tabs">
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
                <input
                  type="text"
                  placeholder="Buscar por protocolo..."
                  className="flex-1 px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring text-base"
                  value={protocolSearch}
                  onChange={e => setProtocolSearch(e.target.value)}
                />
                <Button
                  type="submit"
                  disabled={isSearching}
                  variant="secondary"
                  size="lg"
                  className="flex-shrink-0"
                  aria-label="Buscar protocolo"
                >
                  {isSearching ? (
                    <div className="animate-spin">
                      <RiSearchLine className="size-5" />
                    </div>
                  ) : (
                    <RiSearchLine className="size-5" />
                  )}
                </Button>
              </form>

              {isLoading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Carregando...</p>
                </div>
              ) : submitted.length === 0 ? (
                <div className="text-center py-12">
                  <RiCheckLine className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium text-muted-foreground mb-2">
                    Nenhuma manifestação encontrada
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Faça login para ver seu histórico ou busque por um protocolo acima.
                  </p>
                  <LinkButton
                    href="/entrar"
                    variant="secondary"
                  >
                    <RiLoginBoxLine className="size-5" />
                    Acessar
                  </LinkButton>
                </div>
              ) : (
                <div className="space-y-3">
                  {submitted.map(item => (
                    <div
                      key={item.id}
                      className="bg-card border card-border rounded-lg p-4 space-y-3"
                    >
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div
                            className={`size-6 rounded-full flex items-center justify-center flex-shrink-0 ${item.status === 'done' ? 'bg-success' : item.status === 'analyzing' ? 'bg-yellow-500' : 'bg-secondary'}`}
                          >
                            <RiCheckLine className="size-4 text-white" />
                          </div>
                          <div>
                            <p
                              className={`text-sm font-semibold ${item.status === 'done' ? 'text-success' : item.status === 'analyzing' ? 'text-yellow-600' : 'text-secondary'}`}
                            >
                              {item.status === 'received'
                                ? 'Recebida'
                                : item.status === 'analyzing'
                                  ? 'Em Análise'
                                  : item.status === 'done'
                                    ? 'Concluída'
                                    : 'Enviada'}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {formatDate(item.createdAt)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="space-y-2">
                        <h3 className="font-semibold text-foreground">
                          {getTypeLabel(item.type)}
                        </h3>
                        {item.subject && (
                          <p className="text-sm text-secondary font-medium">
                            {item.subject}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Protocol */}
                      <div className="bg-muted rounded p-3 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                            Protocolo
                          </p>
                          <p className="font-mono text-sm font-bold text-foreground break-all">
                            {item.protocol}
                          </p>
                        </div>
                        <button
                          onClick={() => handleCopyProtocol(item.protocol)}
                          className="flex-shrink-0 p-2 hover:bg-background rounded-lg transition-colors"
                          aria-label="Copiar protocolo"
                          title="Copiar protocolo"
                        >
                          <RiFileCopyLine className="size-5 text-secondary" />
                        </button>
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
                  <div className="inline-block">
                    <div className="animate-spin">
                      <div className="w-12 h-12 border-4 border-border border-t-secondary rounded-full" />
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4">Carregando...</p>
                </div>
              ) : drafts.length === 0 ? (
                <div className="text-center py-12">
                  <RiDraftLine className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground font-medium">Nenhum rascunho salvo</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Seus rascunhos aparecerão aqui quando você começar uma nova manifestação.
                  </p>
                </div>
              ) : (
                drafts.map(draft => (
                  <div
                    key={draft.id}
                    className="bg-card border card-border rounded-lg p-4 space-y-3"
                  >
                    {/* Content */}
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">
                        {getTypeLabel(draft.type)}
                      </h3>
                      {draft.subject && (
                        <p className="text-sm text-secondary font-medium">
                          {draft.subject.name}
                        </p>
                      )}
                      {draft.content?.text && (
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {draft.content.text}
                        </p>
                      )}
                    </div>

                    {/* Attachments & Badges */}
                    {(draft.content?.audio || (draft.content?.files && draft.content.files.length > 0)) && (
                      <div className="flex flex-wrap gap-2">
                        {draft.content?.audio && (
                          <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1.5 rounded-full text-muted-foreground">
                            🎙️ Áudio gravado
                          </span>
                        )}
                        {draft.content?.files && draft.content.files.length > 0 && (
                          <span className="inline-flex items-center gap-1 text-xs bg-muted px-2.5 py-1.5 rounded-full text-muted-foreground">
                            📎 {draft.content.files.length} anexo(s)
                          </span>
                        )}
                      </div>
                    )}

                    {/* Metadata */}
                    <p className="text-xs text-muted-foreground">
                      Atualizado em {formatDate(draft.updatedAt)}
                    </p>

                    {/* Actions */}
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

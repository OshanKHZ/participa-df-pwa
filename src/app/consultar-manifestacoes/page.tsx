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
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { MobileBottomNav } from '@/shared/components/MobileBottomNav'
import { Pagination } from '@/shared/components/Pagination'
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
  const [submittedPage, setSubmittedPage] = useState(1)
  const [draftsPage, setDraftsPage] = useState(1)
  const [submittedItemsPerPage, setSubmittedItemsPerPage] = useState(10)
  const [draftsItemsPerPage, setDraftsItemsPerPage] = useState(10)

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

  // Pagination helpers
  const submittedTotalPages = Math.ceil(submitted.length / submittedItemsPerPage)
  const paginatedSubmitted = submitted.slice(
    (submittedPage - 1) * submittedItemsPerPage,
    submittedPage * submittedItemsPerPage
  )

  const draftsTotalPages = Math.ceil(drafts.length / draftsItemsPerPage)
  const paginatedDrafts = drafts.slice(
    (draftsPage - 1) * draftsItemsPerPage,
    draftsPage * draftsItemsPerPage
  )

  // Reset pagination when changing tabs
  const handleTabChange = (tab: 'submitted' | 'drafts') => {
    setActiveTab(tab)
    if (tab === 'submitted') setSubmittedPage(1)
    else setDraftsPage(1)
  }

  // Handle items per page change
  const handleSubmittedItemsPerPageChange = (itemsPerPage: number) => {
    setSubmittedItemsPerPage(itemsPerPage)
    setSubmittedPage(1) // Reset to first page when changing items per page
  }

  const handleDraftsItemsPerPageChange = (itemsPerPage: number) => {
    setDraftsItemsPerPage(itemsPerPage)
    setDraftsPage(1) // Reset to first page when changing items per page
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
      {/* Desktop Header */}
      <DesktopHeader />

      {/* Mobile Header */}
      <MobileHeader title="Minhas Manifestações" />

      {/* Mobile Container */}
      <div className="lg:hidden min-h-screen bg-background pb-20">
        {/* Tabs */}
        <div className="bg-white border-b border-border sticky top-0 z-tabs">
          <div className="flex">
            <button
              onClick={() => handleTabChange('submitted')}
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
              onClick={() => handleTabChange('drafts')}
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
                <div className="space-y-4">
                  <div className="space-y-3">
                    {paginatedSubmitted.map(item => (
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

                  {/* Pagination */}
                  {submittedTotalPages > 1 && (
                    <Pagination
                      currentPage={submittedPage}
                      totalPages={submittedTotalPages}
                      onPageChange={setSubmittedPage}
                      itemsCount={submitted.length}
                      itemsPerPage={submittedItemsPerPage}
                      onItemsPerPageChange={handleSubmittedItemsPerPageChange}
                    />
                  )}
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
                <div className="space-y-4">
                  <div className="space-y-3">
                    {paginatedDrafts.map(draft => (
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
                    ))}
                  </div>

                  {/* Pagination */}
                  {draftsTotalPages > 1 && (
                    <Pagination
                      currentPage={draftsPage}
                      totalPages={draftsTotalPages}
                      onPageChange={setDraftsPage}
                      itemsCount={drafts.length}
                      itemsPerPage={draftsItemsPerPage}
                      onItemsPerPageChange={handleDraftsItemsPerPageChange}
                    />
                  )}
                </div>
              )}
            </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <MobileBottomNav activeTab="home" isAuthenticated={false} />
      </div>

      {/* Desktop Container */}
      <div className="hidden lg:block min-h-screen bg-background">
        <main className="max-w-6xl mx-auto px-8 py-12">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Consultar Manifestações</h1>
            <p className="text-muted-foreground">
              Acompanhe suas manifestações enviadas ou consulte protocolos
            </p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border mb-4">
            <button
              onClick={() => handleTabChange('submitted')}
              className={`cursor-pointer py-3 px-6 font-medium transition-colors border-b-2 ${
                activeTab === 'submitted'
                  ? 'text-secondary border-secondary'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <RiCheckLine className="size-5" />
                Enviadas
              </div>
            </button>
            <button
              onClick={() => handleTabChange('drafts')}
              className={`cursor-pointer py-3 px-6 font-medium transition-colors border-b-2 ${
                activeTab === 'drafts'
                  ? 'text-secondary border-secondary'
                  : 'text-muted-foreground hover:text-foreground border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                <RiDraftLine className="size-5" />
                Rascunhos ({drafts.length})
              </div>
            </button>
          </div>

          {/* Content */}
          {activeTab === 'submitted' ? (
            <div className="space-y-3">
              {/* Search Box */}
              <form onSubmit={handleSearchProtocol} className="flex gap-3 max-w-2xl">
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
                <div className="text-center py-16">
                  <div className="inline-block">
                    <div className="animate-spin">
                      <div className="w-12 h-12 border-4 border-border border-t-secondary rounded-full" />
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4">Carregando...</p>
                </div>
              ) : submitted.length === 0 ? (
                <div className="text-center py-16">
                  <RiCheckLine className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium text-muted-foreground mb-2 text-lg">
                    Nenhuma manifestação encontrada
                  </p>
                  <p className="text-muted-foreground mb-6">
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
                  {/* Pagination */}
                  <Pagination
                    currentPage={submittedPage}
                    totalPages={submittedTotalPages}
                    onPageChange={setSubmittedPage}
                    itemsCount={submitted.length}
                    itemsPerPage={submittedItemsPerPage}
                    onItemsPerPageChange={handleSubmittedItemsPerPageChange}
                  />

                  {/* Table */}
                  <div className="overflow-x-auto border border-border rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted border-b border-border">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Protocolo
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Assunto
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Data
                          </th>
                          <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                            Ação
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedSubmitted.map(item => (
                          <tr
                            key={item.id}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-mono font-bold text-foreground">
                              {item.protocol}
                            </td>
                            <td className="px-6 py-4 text-sm text-foreground">
                              {getTypeLabel(item.type)}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground max-w-xs truncate">
                              {item.subject || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium ${
                                  item.status === 'done'
                                    ? 'bg-success/10 text-success'
                                    : item.status === 'analyzing'
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-secondary/10 text-secondary'
                                }`}
                              >
                                {item.status === 'received'
                                  ? 'Recebida'
                                  : item.status === 'analyzing'
                                    ? 'Em Análise'
                                    : item.status === 'done'
                                      ? 'Concluída'
                                      : 'Enviada'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(item.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleCopyProtocol(item.protocol)}
                                className="cursor-pointer p-2 hover:bg-muted rounded-lg transition-colors inline-flex"
                                aria-label="Copiar protocolo"
                                title="Copiar protocolo"
                              >
                                <RiFileCopyLine className="size-4 text-secondary" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {isLoading ? (
                <div className="text-center py-16">
                  <div className="inline-block">
                    <div className="animate-spin">
                      <div className="w-12 h-12 border-4 border-border border-t-secondary rounded-full" />
                    </div>
                  </div>
                  <p className="text-muted-foreground mt-4">Carregando...</p>
                </div>
              ) : drafts.length === 0 ? (
                <div className="text-center py-16">
                  <RiDraftLine className="w-20 h-20 text-muted-foreground mx-auto mb-4" />
                  <p className="font-medium text-muted-foreground mb-2 text-lg">Nenhum rascunho salvo</p>
                  <p className="text-muted-foreground">
                    Seus rascunhos aparecerão aqui quando você começar uma nova manifestação.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Pagination */}
                  <Pagination
                    currentPage={draftsPage}
                    totalPages={draftsTotalPages}
                    onPageChange={setDraftsPage}
                    itemsCount={drafts.length}
                    itemsPerPage={draftsItemsPerPage}
                    onItemsPerPageChange={handleDraftsItemsPerPageChange}
                  />

                  {/* Table */}
                  <div className="overflow-x-auto border border-border rounded-lg">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-muted border-b border-border">
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Tipo
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Assunto
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Anexos
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Criado em
                          </th>
                          <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">
                            Atualizado em
                          </th>
                          <th className="px-6 py-3 text-center text-sm font-semibold text-foreground">
                            Ações
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedDrafts.map(draft => (
                          <tr
                            key={draft.id}
                            className="border-b border-border hover:bg-muted/50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm font-medium text-foreground">
                              {getTypeLabel(draft.type)}
                            </td>
                            <td className="px-6 py-4 text-sm text-secondary font-medium">
                              {draft.subject?.name || '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {draft.content?.audio && <span className="mr-2">🎙️</span>}
                              {draft.content?.files && draft.content.files.length > 0 && (
                                <span>📎 {draft.content.files.length}</span>
                              )}
                              {!draft.content?.audio && (!draft.content?.files || draft.content.files.length === 0) && '-'}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(draft.createdAt)}
                            </td>
                            <td className="px-6 py-4 text-sm text-muted-foreground">
                              {formatDate(draft.updatedAt)}
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button
                                  onClick={() => handleContinueDraft(draft)}
                                  className="cursor-pointer px-4 py-2 bg-secondary text-white hover:bg-secondary/90 transition-colors text-sm font-medium flex items-center gap-2"
                                  aria-label="Editar rascunho"
                                  title="Editar"
                                >
                                  <RiEditLine className="size-4" />
                                  Editar
                                </button>
                                <button
                                  onClick={() => handleDeleteDraft(draft.id)}
                                  className="cursor-pointer px-4 py-2 bg-red-600 text-white hover:bg-red-700 transition-colors text-sm font-medium flex items-center gap-2"
                                  aria-label="Apagar rascunho"
                                  title="Apagar"
                                >
                                  <RiDeleteBinLine className="size-4" />
                                  Apagar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

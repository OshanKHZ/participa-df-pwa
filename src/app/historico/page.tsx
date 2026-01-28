'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  RiDraftLine,
  RiCheckLine,
  RiDeleteBinLine,
  RiEditLine,
} from 'react-icons/ri'
import {
  getDrafts,
  getSubmitted,
  deleteDraft,
  loadDraft,
} from '@/shared/utils/draftManager'
import type { ManifestationDraft } from '@/shared/types/manifestation'
import { MobileHeader } from '@/shared/components/MobileHeader'

export default function HistoryPage() {
  const router = useRouter()
  const [drafts, setDrafts] = useState<ManifestationDraft[]>([])
  const [submitted, setSubmitted] = useState<ManifestationDraft[]>([])
  const [activeTab, setActiveTab] = useState<'drafts' | 'submitted'>('drafts')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    setIsLoading(true)
    const [draftsData, submittedData] = await Promise.all([
      getDrafts(),
      getSubmitted(),
    ])
    setDrafts(draftsData)
    setSubmitted(submittedData)
    setIsLoading(false)
  }

  const handleDeleteDraft = async (id: string) => {
    if (confirm('Deseja realmente excluir este rascunho?')) {
      await deleteDraft(id)
      loadHistory()
    }
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
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
      <MobileHeader title="Manifestações" />

      <div className="min-h-screen bg-background pb-20">
        {/* Tabs */}
        <div className="bg-white border-b border-border sticky sticky-top-tabs z-tabs">
          <div className="flex">
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
                Enviadas ({submitted.length})
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <main className="px-4 py-6">
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Carregando...</p>
            </div>
          ) : activeTab === 'drafts' ? (
            <div className="space-y-3">
              {drafts.length === 0 ? (
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
                          <p className="text-sm text-muted-foreground mb-1">
                            {draft.subject.name}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Atualizado em {formatDate(draft.updatedAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleContinueDraft(draft)}
                        className="flex-1 py-2 px-3 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary-hover transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                      >
                        <RiEditLine className="size-4" />
                        Continuar
                      </button>
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
          ) : (
            <div className="space-y-3">
              {submitted.length === 0 ? (
                <div className="text-center py-12">
                  <RiCheckLine className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Nenhuma manifestação enviada
                  </p>
                </div>
              ) : (
                submitted.map(item => (
                  <div
                    key={item.id}
                    className="bg-card border card-border rounded-lg p-4"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="size-6 bg-success rounded-full flex items-center justify-center">
                            <RiCheckLine className="size-4 text-white" />
                          </div>
                          <span className="text-sm font-semibold text-success">
                            Enviada
                          </span>
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">
                          {getTypeLabel(item.type)}
                        </h3>
                        {item.subject && (
                          <p className="text-sm text-muted-foreground mb-1">
                            {item.subject.name}
                          </p>
                        )}
                        {item.protocol && (
                          <p className="text-sm font-mono text-secondary mb-1">
                            Protocolo: {item.protocol}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Enviada em {formatDate(item.updatedAt)}
                        </p>
                      </div>
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

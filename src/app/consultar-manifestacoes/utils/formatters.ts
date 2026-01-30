/**
 * Formatadores para a página de consultar manifestações
 */

export const formatDate = (date: Date | string | null | undefined): string => {
  if (!date) return '-'

  try {
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return '-'
  }
}

export const formatDateOnly = (date: Date | string | null | undefined): string => {
  if (!date) return '-'

  try {
    const d = new Date(date)
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  } catch {
    return '-'
  }
}

/**
 * Mapear tipo de manifestação para label em português
 */
export const getTypeLabel = (type: string): string => {
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

/**
 * Mapear status para label e cor
 */
export const getStatusLabel = (
  status: string
): { label: string; color: 'success' | 'secondary' | 'warning' } => {
  const statuses: Record<string, { label: string; color: 'success' | 'secondary' | 'warning' }> =
    {
      received: { label: 'Recebida', color: 'secondary' },
      analyzing: { label: 'Em Análise', color: 'warning' },
      done: { label: 'Concluída', color: 'success' },
    }
  return statuses[status] || { label: 'Enviada', color: 'secondary' }
}

/**
 * Truncar texto com elipsis
 */
export const truncateText = (text: string | null | undefined, maxLength: number = 100): string => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * Contar minutos/horas desde uma data
 */
export const getTimeAgo = (date: Date | string | null | undefined): string => {
  if (!date) return '-'

  try {
    const d = new Date(date)
    const now = new Date()
    const diffMs = now.getTime() - d.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'agora mesmo'
    if (diffMins < 60) return `há ${diffMins}min`
    if (diffHours < 24) return `há ${diffHours}h`
    if (diffDays < 7) return `há ${diffDays}d`

    return formatDate(date)
  } catch {
    return '-'
  }
}

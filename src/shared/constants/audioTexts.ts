/**
 * Centralized audio texts for Text-to-Speech
 * All texts that will be read aloud by the speech synthesis
 */

export const AUDIO_TEXTS = {
  // Manifestation types
  manifestationType: {
    denuncia: {
      label: 'Denúncia',
      description:
        'Comunique um ato ilícito praticado contra a administração pública',
    },
    reclamacao: {
      label: 'Reclamação',
      description: 'Manifeste sua insatisfação com um serviço público',
    },
    sugestao: {
      label: 'Sugestão',
      description:
        'Envie sugestões de melhorias e simplificação de um serviço público',
    },
    elogio: {
      label: 'Elogio',
      description:
        'Expresse se você está satisfeito com um atendimento público',
    },
    solicitacao: {
      label: 'Solicitação',
      description: 'Peça um atendimento ou uma solicitação de serviço',
    },
    informacao: {
      label: 'Acesso à Informação',
      description: 'Solicite acesso a informações públicas',
    },
  },

  // Channels
  channel: {
    texto: {
      label: 'Texto',
      description: 'Escreva sua manifestação',
    },
    audio: {
      label: 'Áudio',
      description: 'Grave um áudio de até 5 minutos',
    },
    arquivos: {
      label: 'Imagens e Vídeos',
      description: 'Envie fotos e vídeos, até 5 arquivos',
    },
  },

  // Form validations
  validation: {
    textMinChars: 'Mínimo de 10 caracteres',
    textMaxChars: 'Máximo de 5000 caracteres',
    audioMaxDuration: 'Máximo de 5 minutos',
    filesMaxCount: 'Até 5 arquivos',
    fileMaxSize:
      'Tamanho máximo de 5 megabytes por imagem, 50 megabytes por vídeo',
  },

  // Instructions
  instructions: {
    typeSelection: 'Selecione a opção que melhor descreve sua manifestação',
    channelSelection: 'Selecione um ou mais formatos',
    contentText: 'Descreva sua manifestação com o máximo de detalhes possível',
    personalData: 'Você pode se identificar ou manter o anonimato',
    review: 'Confira se todas as informações estão corretas',
  },

  // Tips
  tips: {
    beObjective: 'Seja claro e objetivo',
    provideContext: 'Informe quando e onde aconteceu',
    avoidJudgments: 'Descreva os fatos sem julgamentos pessoais',
    includeDetails: 'Inclua nomes, datas e locais quando relevante',
  },

  // Buttons
  buttons: {
    back: 'Voltar',
    next: 'Próxima',
    continue: 'Continuar',
    submit: 'Confirmar e Enviar',
    exit: 'Sair',
    help: 'Ajuda',
  },

  // Anonymous info
  anonymous: {
    title: 'Avaliação 100% Anônima',
    description:
      'Suas respostas são confidenciais e nenhuma informação pessoal é coletada',
  },
} as const

/**
 * Helper function to combine label and description for audio reading
 */
export function getAudioText(item: {
  label: string
  description: string
}): string {
  return `${item.label}. ${item.description}`
}

/**
 * Helper to format validation messages with context
 */
export function getValidationAudio(
  key: keyof typeof AUDIO_TEXTS.validation,
  context?: string
): string {
  const message = AUDIO_TEXTS.validation[key]
  return context ? `${context}. ${message}` : message
}

import type { ComponentType } from 'react'
import {
  RiPhoneLine,
  RiMailLine,
  RiGlobalLine,
  RiMapPinLine,
  RiWhatsappLine,
} from 'react-icons/ri'

export interface ChannelItem {
  label: string
  value: string
  link?: string
  multiline?: boolean
}

export interface Channel {
  id: string
  title: string
  icon: ComponentType<{ className?: string }>
  items: ChannelItem[]
}

export const channels: Channel[] = [
  {
    id: 'online',
    title: 'Portal Participa DF',
    icon: RiGlobalLine,
    items: [
      {
        label: 'Site oficial',
        value: 'www.participa.df.gov.br',
        link: 'https://www.participa.df.gov.br',
      },
      {
        label: 'Disponível',
        value: '24 horas por dia, 7 dias por semana',
      },
    ],
  },
  {
    id: 'phone',
    title: 'Telefone',
    icon: RiPhoneLine,
    items: [
      {
        label: 'Central de Atendimento',
        value: '162',
        link: 'tel:162',
      },
      {
        label: 'Horário',
        value: 'Segunda a sexta, 8h às 18h',
      },
    ],
  },
  {
    id: 'whatsapp',
    title: 'WhatsApp',
    icon: RiWhatsappLine,
    items: [
      {
        label: 'Atendimento via WhatsApp',
        value: '(61) 99999-9999',
        link: 'https://wa.me/5561999999999',
      },
      {
        label: 'Horário',
        value: 'Segunda a sexta, 8h às 18h',
      },
    ],
  },
  {
    id: 'email',
    title: 'E-mail',
    icon: RiMailLine,
    items: [
      {
        label: 'Ouvidoria Geral',
        value: 'ouvidoria@cg.df.gov.br',
        link: 'mailto:ouvidoria@cg.df.gov.br',
      },
      {
        label: 'Resposta',
        value: 'Até 30 dias úteis',
      },
    ],
  },
  {
    id: 'presencial',
    title: 'Atendimento Presencial',
    icon: RiMapPinLine,
    items: [
      {
        label: 'Endereço',
        value: 'SCS Quadra 08, Bloco B-50',
        multiline: true,
      },
      {
        label: 'Complemento',
        value: 'Edifício Venâncio 2000, Subsolo',
      },
      {
        label: 'CEP',
        value: '70333-900 - Brasília/DF',
      },
      {
        label: 'Horário',
        value: 'Segunda a sexta, 8h às 18h',
      },
    ],
  },
]

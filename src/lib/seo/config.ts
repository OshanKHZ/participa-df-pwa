/**
 * SEO Configuration
 * Centralized SEO constants for easy maintenance and deployment flexibility.
 * Update SITE_URL when deploying to production domain.
 */

/**
 * Base site URL - Update this when deploying to production
 * For development: 'http://localhost:3000'
 * For production: 'https://participa-df.gdf.df.gov.br' (or actual domain)
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://participa-df.gdf.df.gov.br'

/**
 * Site metadata constants
 */
export const SITE_CONFIG = {
  name: 'Participa-DF',
  fullName: 'Participa-DF | Ouvidoria do Distrito Federal',
  description:
    'Portal de Ouvidoria do Distrito Federal. Registre reclamações, sugestões, elogios e denúncias de forma simples e rápida.',
  shortDescription: 'Registre suas manifestações e ajude a melhorar o Distrito Federal.',

  // Organization info
  organization: {
    name: 'Ouvidoria do Distrito Federal - Participa-DF',
    publisher: 'Ouvidoria Geral do DF',
    creator: 'GDF',
    phone: '162',
    addressLocality: 'Brasília',
    addressRegion: 'DF',
    addressCountry: 'BR',
  },

  // Theme
  themeColor: '#28477d',

  // Keywords for SEO
  keywords: [
    'Ouvidoria',
    'Brasília',
    'Distrito Federal',
    'GDF',
    'Participação Social',
    'Transparência',
    'Serviços Públicos',
    'Manifestações',
    'Denúncia',
    'Reclamação',
    'Elogio',
    'Sugestão',
    'Informação',
  ],
} as const

/**
 * Route paths and their metadata
 */
export const ROUTES = {
  home: {
    path: '/',
    title: SITE_CONFIG.fullName,
    description: SITE_CONFIG.description,
  },
  manifestacao: {
    path: '/manifestacao',
    title: 'Nova Manifestação',
    description:
      'Registre sua manifestação (reclamação, sugestão, elogio, denúncia ou pedido de informação) na Ouvidoria do DF.',
  },
  ajuda: {
    path: '/ajuda',
    title: 'Ajuda e FAQ',
    description:
      'Encontre respostas para as perguntas mais frequentes sobre a Ouvidoria do Distrito Federal e saiba como registrar sua manifestação.',
  },
  canais: {
    path: '/canais',
    title: 'Canais de Atendimento',
    description:
      'Conheça todos os canais de atendimento da Ouvidoria do DF: telefone 162, presencial e internet.',
  },
  transparencia: {
    path: '/transparencia',
    title: 'Transparência',
    description:
      'Acompanhe os dados e indicadores da Ouvidoria do DF em nosso portal da transparência.',
  },
  consultar: {
    path: '/consultar-manifestacoes',
    title: 'Consultar Manifestação',
    description:
      'Acompanhe o andamento da sua manifestação utilizando o número do protocolo e sua senha.',
  },
  oQueE: {
    path: '/o-que-e-ouvidoria',
    title: 'O que é a Ouvidoria',
    description:
      'Saiba mais sobre o papel da Ouvidoria e como ela atua na defesa dos direitos do cidadão no Distrito Federal.',
  },
  orientacoes: {
    path: '/orientacoes',
    title: 'Orientações para o registro',
    description:
      'Confira as orientações importantes antes de registrar sua manifestação na Ouvidoria do DF.',
  },
} as const

/**
 * Helper function to get full URL for a path
 */
export function getFullUrl(path: string): string {
  return `${SITE_URL}${path}`
}

/**
 * Helper function to get canonical URL for a route
 */
export function getCanonicalUrl(routeKey: keyof typeof ROUTES): string {
  return getFullUrl(ROUTES[routeKey].path)
}

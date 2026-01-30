import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://participa-df.gdf.df.gov.br'

  const routes = [
    '',
    '/ajuda',
    '/canais',
    '/consultar-manifestacoes',
    '/entrar',
    '/o-que-e-ouvidoria',
    '/orientacoes',
    '/servicos',
    '/transparencia',
    '/manifestacao/reclamacao',
    '/manifestacao/sugestao',
    '/manifestacao/elogio',
    '/manifestacao/denuncia',
    '/manifestacao/informacao',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  return routes
}

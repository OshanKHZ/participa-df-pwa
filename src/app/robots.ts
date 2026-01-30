import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/perfil/'],
    },
    sitemap: 'https://participa-df.gdf.df.gov.br/sitemap.xml',
  }
}

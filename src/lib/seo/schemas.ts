/**
 * Schema.org Structured Data Generators
 * Generates JSON-LD schemas for SEO optimization
 */

import { SITE_URL, SITE_CONFIG, getFullUrl } from './config'

/**
 * Organization Schema - For homepage and site-wide use
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentOrganization',
    name: SITE_CONFIG.organization.name,
    url: SITE_URL,
    logo: getFullUrl('/icons/icon-512x512.png'),
    description: SITE_CONFIG.description,
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE_CONFIG.organization.phone,
      contactType: 'customer service',
      areaServed: 'BR-DF',
      availableLanguage: 'pt-BR',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: SITE_CONFIG.organization.addressLocality,
      addressRegion: SITE_CONFIG.organization.addressRegion,
      addressCountry: SITE_CONFIG.organization.addressCountry,
    },
  }
}

/**
 * WebPage Schema - For individual content pages
 */
export function generateWebPageSchema(options: {
  title: string
  description: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: options.title,
    description: options.description,
    url: options.url,
    publisher: {
      '@type': 'GovernmentOrganization',
      name: SITE_CONFIG.organization.publisher,
    },
    inLanguage: 'pt-BR',
  }
}

/**
 * Breadcrumb Schema - For navigation paths
 */
export function generateBreadcrumbSchema(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * FAQ Schema - For help/FAQ pages
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * ContactPage Schema - For contact/canais pages
 */
export function generateContactPageSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Canais de Atendimento - Ouvidoria DF',
    description:
      'Entre em contato com a Ouvidoria do Distrito Federal através dos nossos canais de atendimento.',
    url: getFullUrl('/canais'),
    mainEntity: {
      '@type': 'GovernmentOrganization',
      name: SITE_CONFIG.organization.name,
      contactPoint: [
        {
          '@type': 'ContactPoint',
          telephone: '162',
          contactType: 'customer service',
          areaServed: 'BR-DF',
          availableLanguage: 'pt-BR',
          contactOption: 'TollFree',
        },
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          areaServed: 'BR-DF',
          availableLanguage: 'pt-BR',
          url: SITE_URL,
        },
      ],
    },
  }
}

/**
 * GovernmentService Schema - For manifestation types
 */
export function generateGovernmentServiceSchema(options: {
  name: string
  description: string
  serviceType: string
  url: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'GovernmentService',
    name: options.name,
    description: options.description,
    serviceType: options.serviceType,
    url: options.url,
    provider: {
      '@type': 'GovernmentOrganization',
      name: SITE_CONFIG.organization.name,
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Distrito Federal',
      '@id': 'https://www.wikidata.org/wiki/Q119158',
    },
    availableChannel: {
      '@type': 'ServiceChannel',
      serviceUrl: options.url,
      servicePhone: {
        '@type': 'ContactPoint',
        telephone: SITE_CONFIG.organization.phone,
      },
    },
  }
}

/**
 * Article Schema - For blog posts
 */
export function generateArticleSchema(options: {
  headline: string
  image: string
  datePublished: string
  dateModified?: string
  author?: string
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: options.headline,
    image: options.image,
    datePublished: options.datePublished,
    dateModified: options.dateModified || options.datePublished,
    author: {
      '@type': 'Organization',
      name: options.author || 'Governo do Distrito Federal',
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.organization.publisher,
      logo: {
        '@type': 'ImageObject',
        url: getFullUrl('/icons/icon-512x512.png'),
      },
    },
  }
}

/**
 * ItemList Schema - For lists of items (like blog carousel)
 */
export function generateItemListSchema(
  items: Array<{
    headline: string
    image: string
    datePublished: string
  }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Article',
        headline: item.headline,
        image: item.image,
        datePublished: item.datePublished,
        author: {
          '@type': 'Organization',
          name: 'Governo do Distrito Federal',
        },
      },
    })),
  }
}

/**
 * Script to sync Ouvidoria data from Participa-DF APIs
 * Run daily via cron to keep local data updated
 *
 * Usage:
 * - npm run sync-data (manual)
 * - Cron: 0 2 * * * (daily at 2 AM)
 */

import fs from 'fs/promises'
import path from 'path'

const API_BASE_URL = 'https://www.painel.ouv.df.gov.br/api/v1'
const DATA_DIR = path.join(process.cwd(), 'data')

/**
 * Fetch collections data (classificacoes, assuntos)
 */
async function fetchCollections() {
  try {
    console.log('Fetching collections data...')
    const response = await fetch(`${API_BASE_URL}/collections`, {
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Participa-DF-PWA/1.0.0',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Save classificacoes
    await fs.writeFile(
      path.join(DATA_DIR, 'classificacoes.json'),
      JSON.stringify({ classificacao: data.classificacao }, null, 2),
      'utf-8'
    )
    console.log('✓ Classificacoes saved')

    // Save full assuntos list
    await fs.writeFile(
      path.join(DATA_DIR, 'assuntos-completo.json'),
      JSON.stringify({ assunto: data.assunto }, null, 2),
      'utf-8'
    )
    console.log(`✓ Assuntos saved (${data.assunto.length} items)`)

    return data
  } catch (error) {
    console.error('Error fetching collections:', error)
    throw error
  }
}

/**
 * Fetch orgaos/unidades data
 */
async function fetchOrgaos() {
  try {
    console.log('Fetching orgaos data...')
    const response = await fetch(`${API_BASE_URL}/dados-filtro-unidade`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Participa-DF-PWA/1.0.0',
      },
      body: JSON.stringify({ FiltroUnidade: '' }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    await fs.writeFile(
      path.join(DATA_DIR, 'orgaos.json'),
      JSON.stringify({ orgaos: data }, null, 2),
      'utf-8'
    )
    console.log(`✓ Orgaos saved (${data.length} items)`)

    return data
  } catch (error) {
    console.error('Error fetching orgaos:', error)
    throw error
  }
}

/**
 * Fetch statistics (optional - for analytics)
 */
async function fetchStatistics() {
  try {
    console.log('Fetching statistics...')
    const today = new Date()
    const startOfYear = new Date(today.getFullYear(), 0, 1)

    const response = await fetch(`${API_BASE_URL}/painel-visao-geral`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Participa-DF-PWA/1.0.0',
      },
      body: JSON.stringify({
        Periodo: [
          startOfYear.toISOString().split('T')[0],
          today.toISOString().split('T')[0],
        ],
        FiltroAssunto: [],
        FiltroSituacao: [],
        FiltroClassificacao: [],
        FiltroRA: [],
        FiltroTipoEntrada: [],
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    await fs.writeFile(
      path.join(DATA_DIR, 'statistics.json'),
      JSON.stringify(
        {
          lastUpdated: today.toISOString(),
          data,
        },
        null,
        2
      ),
      'utf-8'
    )
    console.log('✓ Statistics saved')

    return data
  } catch (error) {
    console.error('Error fetching statistics:', error)
    throw error
  }
}

/**
 * Main sync function
 */
async function syncData() {
  console.log('🔄 Starting Ouvidoria data sync...\n')
  const startTime = Date.now()

  try {
    // Ensure data directory exists
    await fs.mkdir(DATA_DIR, { recursive: true })

    // Fetch all data in parallel
    const [collections, orgaos, statistics] = await Promise.all([
      fetchCollections(),
      fetchOrgaos(),
      fetchStatistics(),
    ])

    // Save metadata
    const metadata = {
      lastSync: new Date().toISOString(),
      counts: {
        classificacoes: collections.classificacao.length,
        assuntos: collections.assunto.length,
        orgaos: orgaos.length,
      },
      statistics: {
        totalManifestacoes:
          statistics.situacao?.values?.reduce(
            (a: number, b: number) => a + b,
            0
          ) || 0,
        satisfacao: statistics.satisfacao?.percentual || 0,
      },
    }

    await fs.writeFile(
      path.join(DATA_DIR, 'sync-metadata.json'),
      JSON.stringify(metadata, null, 2),
      'utf-8'
    )

    const duration = ((Date.now() - startTime) / 1000).toFixed(2)
    console.log(`\n✅ Sync completed successfully in ${duration}s`)
    console.log(`\nData summary:`)
    console.log(`- Classificações: ${metadata.counts.classificacoes}`)
    console.log(`- Assuntos: ${metadata.counts.assuntos}`)
    console.log(`- Órgãos: ${metadata.counts.orgaos}`)
    console.log(
      `- Total Manifestações (YTD): ${metadata.statistics.totalManifestacoes}`
    )
    console.log(`- Satisfação: ${metadata.statistics.satisfacao}%`)
  } catch (error) {
    console.error('\n❌ Sync failed:', error)
    process.exit(1)
  }
}

// Run sync
syncData()

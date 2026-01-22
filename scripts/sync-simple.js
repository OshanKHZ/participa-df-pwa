/**
 * Simple sync script to fetch subjects from Participa-DF API
 */

const fs = require('fs')
const path = require('path')
const https = require('https')

const API_BASE_URL = 'https://www.painel.ouv.df.gov.br/api/v1'
const DATA_DIR = path.join(process.cwd(), 'data')

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        {
          headers: {
            Accept: 'application/json',
            'User-Agent': 'Participa-DF-PWA/1.0.0',
          },
        },
        res => {
          let data = ''
          res.on('data', chunk => (data += chunk))
          res.on('end', () => {
            try {
              resolve(JSON.parse(data))
            } catch (e) {
              reject(e)
            }
          })
        }
      )
      .on('error', reject)
  })
}

async function syncCollections() {
  console.log('Fetching collections data...')

  const data = await fetchJSON(`${API_BASE_URL}/collections`)

  // Save assuntos
  const assuntosPath = path.join(DATA_DIR, 'assuntos-completo.json')
  fs.writeFileSync(
    assuntosPath,
    JSON.stringify({ assunto: data.assunto }, null, 2),
    'utf-8'
  )

  console.log(`✓ Assuntos saved (${data.assunto.length} items)`)
  console.log(`✓ File: ${assuntosPath}`)
}

syncCollections().catch(console.error)

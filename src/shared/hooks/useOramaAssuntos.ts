import { useState, useEffect } from 'react'
import { create, insertMultiple, search, type AnyOrama, type Results } from '@orama/orama'
import assuntosData from '@/data/assuntos-completo.json'

// Semantic keyword expansion for better search results
const SEMANTIC_EXPANSIONS: Record<string, string[]> = {
  // Educação e crianças
  crianca: [
    'escola',
    'creche',
    'uniforme',
    'merenda',
    'ensino',
    'infantil',
    'educacao',
    'aluno',
    'matricula',
    'bercario',
  ],
  filho: [
    'escola',
    'creche',
    'uniforme',
    'merenda',
    'ensino',
    'infantil',
    'educacao',
    'aluno',
    'matricula',
  ],
  estudante: [
    'escola',
    'uniforme',
    'merenda',
    'ensino',
    'educacao',
    'aluno',
    'professor',
    'aula',
  ],
  escola: [
    'ensino',
    'educacao',
    'professor',
    'aluno',
    'sala',
    'uniforme',
    'merenda',
    'matricula',
  ],
  professor: ['escola', 'ensino', 'educacao', 'docente', 'aula'],

  // Saúde
  saude: [
    'medico',
    'hospital',
    'ubs',
    'posto',
    'vacina',
    'consulta',
    'exame',
    'atendimento',
    'tratamento',
    'remedio',
    'medicamento',
  ],
  doente: [
    'medico',
    'hospital',
    'ubs',
    'posto',
    'consulta',
    'atendimento',
    'saude',
    'tratamento',
  ],
  medico: [
    'hospital',
    'ubs',
    'posto',
    'consulta',
    'atendimento',
    'saude',
    'especialista',
  ],
  hospital: [
    'medico',
    'atendimento',
    'consulta',
    'emergencia',
    'internacao',
    'saude',
  ],
  vacina: ['vacinacao', 'imunizacao', 'saude', 'posto', 'ubs'],
  remedio: ['medicamento', 'farmacia', 'receita', 'saude'],

  // Transporte
  transporte: [
    'onibus',
    'metro',
    'brt',
    'linha',
    'passe',
    'tarifa',
    'bilhete',
    'cartao',
  ],
  onibus: [
    'transporte',
    'linha',
    'horario',
    'ponto',
    'parada',
    'itinerario',
    'passagem',
  ],
  metro: ['transporte', 'estacao', 'linha', 'trem', 'bilhete'],

  // Saneamento e infraestrutura
  agua: [
    'caesb',
    'encanamento',
    'esgoto',
    'vazamento',
    'abastecimento',
    'fornecimento',
    'falta',
  ],
  esgoto: ['caesb', 'saneamento', 'vazamento', 'entupimento', 'fossa'],
  vazamento: ['agua', 'encanamento', 'cano', 'tubulacao'],

  // Limpeza urbana
  lixo: ['coleta', 'entulho', 'limpeza', 'gari', 'caminhao', 'caçamba'],
  entulho: ['lixo', 'coleta', 'remocao', 'caçamba'],

  // Vias e ruas
  rua: [
    'via',
    'logradouro',
    'pavimentacao',
    'asfalto',
    'buraco',
    'tapa-buraco',
  ],
  buraco: ['pavimentacao', 'asfalto', 'via', 'rua', 'tapa-buraco'],
  asfalto: ['pavimentacao', 'via', 'rua', 'recapeamento'],

  // Iluminação
  luz: ['iluminacao', 'poste', 'lampada', 'energia', 'ceb'],
  poste: ['iluminacao', 'luz', 'lampada', 'energia'],

  // Segurança
  policia: ['seguranca', 'viatura', 'patrulhamento', 'delegacia', 'pm'],
  violencia: ['seguranca', 'policia', 'crime', 'agressao'],
  roubo: ['seguranca', 'policia', 'crime', 'furto'],

  // Documentos e serviços
  documento: ['identidade', 'rg', 'cpf', 'certidao', 'carteira'],
  carteira: ['cnh', 'motorista', 'habilitacao', 'detran'],

  // Veículos e trânsito
  carro: [
    'veiculo',
    'automovel',
    'cnh',
    'detran',
    'ipva',
    'licenciamento',
    'multa',
  ],
  veiculo: ['carro', 'automovel', 'moto', 'detran', 'ipva', 'licenciamento'],
  moto: ['veiculo', 'motocicleta', 'cnh', 'detran', 'ipva'],
  multa: ['infracao', 'detran', 'transito', 'veiculo'],
  detran: ['cnh', 'habilitacao', 'veiculo', 'licenciamento', 'ipva'],

  // Assistência social
  assistencia: ['social', 'ajuda', 'beneficio', 'auxilio', 'programa'],
  bolsa: ['familia', 'beneficio', 'auxilio', 'assistencia'],

  // Animais
  animal: ['cachorro', 'gato', 'pet', 'veterinario', 'zoonose'],
  cachorro: ['animal', 'pet', 'castracao', 'vacina', 'zoonose'],

  // Meio ambiente
  ambiente: ['meio', 'arvore', 'poda', 'parque', 'verde'],
  arvore: ['poda', 'corte', 'ambiente', 'meio'],

  // Comércio e fiscalização
  comercio: ['loja', 'estabelecimento', 'fiscalizacao', 'licenca', 'alvara'],
  bar: ['comercio', 'estabelecimento', 'fiscalizacao', 'barulho', 'som'],
  barulho: ['som', 'ruido', 'poluicao', 'sonora'],
}

interface Assunto {
  id: number
  name: string
}

// Global instances for singleton pattern
let globalOrama: AnyOrama | null = null
let initializationPromise: Promise<AnyOrama> | null = null

export function useOramaAssuntos() {
  const [isReady, setIsReady] = useState(!!globalOrama)

  useEffect(() => {
    if (globalOrama) {
      setIsReady(true)
      return
    }

    if (!initializationPromise) {
      initializationPromise = (async () => {
        const db = await create({
          schema: {
            id: 'string',
            name: 'string',
            keywords: 'string[]', // New field for semantic keywords
          },
          language: 'portuguese', // Enable built-in Portuguese stemming
        })

        const assuntos = assuntosData.assunto as Assunto[]

        // Pre-process data to include keywords
        const documents = assuntos.map(assunto => {
          const keywords = new Set<string>()
          const normalizedName = assunto.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')

          // Add semantic keywords based on expansions
          Object.entries(SEMANTIC_EXPANSIONS).forEach(([concept, relatedWords]) => {
            // If the name matches any of the related words OR the concept itself
            // e.g. Name has "escola" -> adds concept "crianca" (because crianca -> [escola, ...])
            // e.g. Name has "crianca" -> adds concept "crianca"
            
            const shouldAdd = 
              normalizedName.includes(concept) || 
              relatedWords.some(word => normalizedName.includes(word))

            if (shouldAdd) {
              keywords.add(concept)
            }
          })

          return {
            id: String(assunto.id),
            name: assunto.name,
            keywords: Array.from(keywords),
          }
        })

        await insertMultiple(db, documents)
        return db
      })()
    }

    initializationPromise
      .then(db => {
        globalOrama = db
        setIsReady(true)
      })
      .catch(console.error)
  }, [])

  const searchAssuntos = async (term: string, limit = 50) => {
    if (!globalOrama || !term.trim()) return []

    try {
      const results: Results<any> = await search(globalOrama, {
        term: term,
        properties: ['name', 'keywords'],
        tolerance: 1, // Reset to valid integer
        boost: { 
          name: 1.5,
          keywords: 1.0 
        },
        limit,
      })

      // Map back to original Assunto objects
      return results.hits.map(hit => ({
        id: parseInt(hit.document.id as string),
        name: hit.document.name as string,
      }))
    } catch (error) {
      console.error('Orama search error:', error)
      throw error // Re-throw to allow fallback in UI
    }
  }

  return {
    searchAssuntos,
    isReady,
    allAssuntos: assuntosData.assunto as Assunto[]
  }
}

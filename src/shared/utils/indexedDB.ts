/**
 * IndexedDB Base Repository
 *
 * Generic repository pattern for IndexedDB operations.
 * Follows SOLID principles:
 * - Single Responsibility: Handles only DB operations
 * - Open/Closed: Extensible through inheritance
 * - Dependency Inversion: Depends on abstractions (Store interface)
 */

const DB_NAME = 'participa-df-db'
const DB_VERSION = 1

export type StoreName = 'drafts' | 'submitted'

interface StoreConfig {
  name: StoreName
  keyPath: string
  indexes?: { name: string; keyPath: string; unique?: boolean }[]
}

// Default stores configuration
const DEFAULT_STORES: StoreConfig[] = [
  {
    name: 'drafts',
    keyPath: 'id',
    indexes: [
      { name: 'by-date', keyPath: 'updatedAt', unique: false },
      { name: 'by-status', keyPath: 'status', unique: false },
    ],
  },
  {
    name: 'submitted',
    keyPath: 'id',
    indexes: [
      { name: 'by-protocol', keyPath: 'protocol', unique: true },
      { name: 'by-date', keyPath: 'updatedAt', unique: false },
    ],
  },
]

// Check if IndexedDB is available (browser-only)
const isIndexedDBAvailable = (): boolean => {
  return typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined'
}

class IndexedDBHelper {
  private db: IDBDatabase | null = null
  private initPromise: Promise<IDBDatabase> | null = null
  private isAvailable: boolean

  constructor() {
    this.isAvailable = isIndexedDBAvailable()
  }

  async init(stores: StoreConfig[] = DEFAULT_STORES): Promise<IDBDatabase> {
    if (!this.isAvailable) {
      throw new Error('IndexedDB is not available in this environment')
    }

    if (this.db) return this.db
    if (this.initPromise) return this.initPromise

    this.initPromise = new Promise((resolve, reject) => {
      const request = (window.indexedDB as IDBFactory).open(DB_NAME, DB_VERSION)

      request.onerror = () => reject(new Error('Failed to open IndexedDB'))
      request.onsuccess = () => {
        this.db = request.result
        resolve(this.db!)
      }

      request.onupgradeneeded = (event: Event) => {
        const db = (event.target as IDBOpenDBRequest).result

        stores.forEach(store => {
          if (!db.objectStoreNames.contains(store.name)) {
            const objectStore = db.createObjectStore(store.name, {
              keyPath: store.keyPath,
            })

            store.indexes?.forEach(index => {
              objectStore.createIndex(index.name, index.keyPath, {
                unique: index.unique,
              })
            })
          }
        })
      }
    })

    return this.initPromise
  }

  async getAll<T>(storeName: StoreName): Promise<T[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.getAll()

      request.onsuccess = () => resolve(request.result as T[])
      request.onerror = () => reject(request.error)
    })
  }

  async get<T>(storeName: StoreName, key: string): Promise<T | undefined> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const request = store.get(key)

      request.onsuccess = () => resolve(request.result as T)
      request.onerror = () => reject(request.error)
    })
  }

  async put<T>(storeName: StoreName, value: T): Promise<string> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.put(value)

      request.onsuccess = () => resolve((value as any).id)
      request.onerror = () => reject(request.error)
    })
  }

  async delete(storeName: StoreName, key: string): Promise<void> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.delete(key)

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  async clear(storeName: StoreName): Promise<void> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readwrite')
      const store = transaction.objectStore(storeName)
      const request = store.clear()

      request.onsuccess = () => resolve()
      request.onerror = () => reject(request.error)
    })
  }

  // Get by index
  async getByIndex<T>(
    storeName: StoreName,
    indexName: string,
    value: unknown
  ): Promise<T[]> {
    const db = await this.init()
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(storeName, 'readonly')
      const store = transaction.objectStore(storeName)
      const index = store.index(indexName)
      const request = index.getAll(value as IDBValidKey)

      request.onsuccess = () => resolve(request.result as T[])
      request.onerror = () => reject(request.error)
    })
  }
}

// Singleton instance
export const indexedDB = new IndexedDBHelper()

import { DocumentData } from './types'

export interface HistoryItem {
  id: string
  timestamp: number
  date: string
  data: DocumentData
  summary: {
    vendedorNombre?: string
    vendedorNif?: string
    compradorNombre?: string
    compradorNif?: string
    vehiculoMarca?: string
    vehiculoModelo?: string
    vehiculoMatricula?: string
  }
}

const HISTORY_KEY = 'vehicle-documents-history'

export function saveToHistory(data: DocumentData): HistoryItem {
  const timestamp = Date.now()
  const id = `${timestamp}-${Math.random().toString(36).substr(2, 9)}`
  
  const historyItem: HistoryItem = {
    id,
    timestamp,
    date: new Date(timestamp).toLocaleString('es-ES'),
    data,
    summary: {
      vendedorNombre: data.vendedor?.nombre,
      vendedorNif: data.vendedor?.dni,
      compradorNombre: data.comprador?.nombre,
      compradorNif: data.comprador?.dni,
      vehiculoMarca: data.vehiculo?.marca,
      vehiculoModelo: data.vehiculo?.modelo,
      vehiculoMatricula: data.vehiculo?.matricula
    }
  }

  const history = getHistory()
  history.unshift(historyItem) // Add to beginning
  
  // Keep only last 50 items
  const limitedHistory = history.slice(0, 50)
  
  localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory))
  return historyItem
}

export function getHistory(): HistoryItem[] {
  try {
    const history = localStorage.getItem(HISTORY_KEY)
    return history ? JSON.parse(history) : []
  } catch (error) {
    console.error('Error loading history:', error)
    return []
  }
}

export function deleteFromHistory(id: string): void {
  const history = getHistory()
  const filteredHistory = history.filter(item => item.id !== id)
  localStorage.setItem(HISTORY_KEY, JSON.stringify(filteredHistory))
}

export function clearHistory(): void {
  localStorage.removeItem(HISTORY_KEY)
}

export function getHistoryItem(id: string): HistoryItem | null {
  const history = getHistory()
  return history.find(item => item.id === id) || null
}
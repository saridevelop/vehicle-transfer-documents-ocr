'use client'

import { useState, useEffect } from 'react'
import { X, Trash2, Upload, Calendar, User, Car } from 'lucide-react'
import { getHistory, deleteFromHistory, clearHistory, HistoryItem } from '@/lib/history'

interface HistoryModalProps {
  isOpen: boolean
  onClose: () => void
  onLoadItem: (item: HistoryItem) => void
}

export default function HistoryModal({ isOpen, onClose, onLoadItem }: HistoryModalProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])

  useEffect(() => {
    if (isOpen) {
      setHistory(getHistory())
    }
  }, [isOpen])

  const handleDeleteItem = (id: string) => {
    if (confirm('¿Estás seguro de que quieres eliminar este elemento del histórico?')) {
      deleteFromHistory(id)
      setHistory(getHistory())
    }
  }

  const handleClearAll = () => {
    if (confirm('¿Estás seguro de que quieres eliminar todo el histórico? Esta acción no se puede deshacer.')) {
      clearHistory()
      setHistory([])
    }
  }

  const formatSummary = (item: HistoryItem) => {
    const parts = []
    
    if (item.summary.vendedorNombre) {
      parts.push(`Vendedor: ${item.summary.vendedorNombre}`)
    }
    if (item.summary.compradorNombre) {
      parts.push(`Comprador: ${item.summary.compradorNombre}`)
    }
    if (item.summary.vehiculoMarca || item.summary.vehiculoModelo) {
      const vehiculo = [item.summary.vehiculoMarca, item.summary.vehiculoModelo].filter(Boolean).join(' ')
      parts.push(`Vehículo: ${vehiculo}`)
    }
    if (item.summary.vehiculoMatricula) {
      parts.push(`Matrícula: ${item.summary.vehiculoMatricula}`)
    }
    
    return parts.join(' • ')
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Histórico de Procesos</h2>
            <p className="text-muted-foreground mt-1">
              {history.length} {history.length === 1 ? 'proceso guardado' : 'procesos guardados'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={handleClearAll}
                className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar Todo
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-full transition-colors"
            >
              <X className="h-6 w-6 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)]">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">No hay procesos guardados</h3>
              <p className="text-muted-foreground">
                Los procesos que guardes aparecerán aquí para poder cargarlos más tarde.
              </p>
            </div>
          ) : (
            <div className="p-6 space-y-4">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="border rounded-lg p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{item.date}</span>
                      </div>
                      
                      <div className="space-y-2">
                        {item.summary.vendedorNombre && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
                            <span className="text-muted-foreground">Vendedor:</span>
                            <span className="font-medium">{item.summary.vendedorNombre}</span>
                            {item.summary.vendedorNif && (
                              <span className="text-muted-foreground">({item.summary.vendedorNif})</span>
                            )}
                          </div>
                        )}
                        
                        {item.summary.compradorNombre && (
                          <div className="flex items-center gap-2 text-sm">
                            <User className="h-4 w-4 text-green-600 flex-shrink-0" />
                            <span className="text-muted-foreground">Comprador:</span>
                            <span className="font-medium">{item.summary.compradorNombre}</span>
                            {item.summary.compradorNif && (
                              <span className="text-muted-foreground">({item.summary.compradorNif})</span>
                            )}
                          </div>
                        )}
                        
                        {(item.summary.vehiculoMarca || item.summary.vehiculoModelo || item.summary.vehiculoMatricula) && (
                          <div className="flex items-center gap-2 text-sm">
                            <Car className="h-4 w-4 text-orange-600 flex-shrink-0" />
                            <span className="text-muted-foreground">Vehículo:</span>
                            <span className="font-medium">
                              {[item.summary.vehiculoMarca, item.summary.vehiculoModelo].filter(Boolean).join(' ')}
                              {item.summary.vehiculoMatricula && ` • ${item.summary.vehiculoMatricula}`}
                            </span>
                          </div>
                        )}
                        
                        {!item.summary.vendedorNombre && !item.summary.compradorNombre && !item.summary.vehiculoMarca && (
                          <p className="text-sm text-muted-foreground italic">Proceso sin datos completos</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => onLoadItem(item)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                      >
                        <Upload className="h-4 w-4" />
                        Cargar
                      </button>
                      <button
                        onClick={() => handleDeleteItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
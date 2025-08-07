'use client'

import { useState, useEffect } from 'react'
import UploadBox from '@/components/UploadBox'
import EditableForm from '@/components/EditableForm'
import ProcessingStep from '@/components/ProcessingStep'
import { DocumentData } from '@/lib/types'

export default function Home() {
  const [step, setStep] = useState(1)
  const [documentData, setDocumentData] = useState<DocumentData>({
    vendedor: {},
    comprador: {},
    vehiculo: {}
  })
  const [isProcessing, setIsProcessing] = useState(false)

  // Check for data in URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const encodedData = urlParams.get('data')
    
    if (encodedData) {
      try {
        const decodedData = JSON.parse(atob(encodedData))
        setDocumentData(decodedData)
        setStep(3) // Skip to edit form
        
        // Show notification
        setTimeout(() => {
          alert('✅ Datos cargados desde el enlace compartido')
        }, 500)
      } catch (error) {
        console.error('Error decoding URL data:', error)
        alert('❌ Error al cargar los datos del enlace. Empezando desde cero.')
      }
    }
  }, [])

  const handleFilesUploaded = async (files: {
    vendedor?: File,
    comprador?: File,
    ficha?: File
  }) => {
    setIsProcessing(true)
    setStep(2)

    try {
      const formData = new FormData()
      if (files.vendedor) formData.append('vendedor', files.vendedor)
      if (files.comprador) formData.append('comprador', files.comprador)
      if (files.ficha) formData.append('ficha', files.ficha)

      const response = await fetch('/api/process', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error('Error al procesar los documentos')
      }

      const data = await response.json()
      setDocumentData(data)
      setStep(3)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar los documentos. Por favor, inténtelo de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDataUpdate = (newData: DocumentData) => {
    setDocumentData(newData)
  }

  const handleReset = () => {
    setDocumentData({
      vendedor: {},
      comprador: {},
      vehiculo: {}
    })
    setStep(1)
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname)
  }

  const handleGeneratePDFs = async (type: 'contract' | 'mod02') => {
    setIsProcessing(true)

    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: documentData, type })
      })

      if (!response.ok) {
        throw new Error('Error al generar el PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      
      // Set filename based on document type
      const filename = type === 'contract' 
        ? 'contrato-compraventa.pdf' 
        : 'mod-02-es.pdf'
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error:', error)
      alert('Error al generar el documento. Por favor, inténtelo de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚗 Transferencia de Vehículos OCR
        </h1>
        <p className="text-xl text-gray-600">
          Automatiza el llenado de documentos de transferencia usando OCR
        </p>
        {step > 1 && (
          <button
            onClick={handleReset}
            className="mt-4 text-sm text-blue-600 hover:text-blue-800 underline"
          >
            🔄 Empezar de nuevo
          </button>
        )}
      </header>

      <ProcessingStep currentStep={step} />

      {/* Debug info - show current data */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mt-4 mb-8 p-4 bg-gray-100 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Debug - Datos actuales:</h3>
          <pre className="text-xs text-gray-600 overflow-auto">
            {JSON.stringify(documentData, null, 2)}
          </pre>
        </div>
      )}

      <div className="mt-8">
        {step === 1 && (
          <UploadBox onFilesUploaded={handleFilesUploaded} />
        )}

        {step === 2 && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">Procesando documentos con OCR...</p>
          </div>
        )}

        {step === 3 && (
          <EditableForm
            data={documentData}
            onDataUpdate={handleDataUpdate}
            onGeneratePDFs={handleGeneratePDFs}
            isProcessing={isProcessing}
          />
        )}
      </div>
    </div>
  )
}

'use client'

import { useState, useEffect } from 'react'
import UploadBox from '@/components/UploadBox'
import EditableForm from '@/components/EditableForm'
import ProcessingStep from '@/components/ProcessingStep'
import { DocumentData } from '@/lib/types'
import { FileText, RefreshCw, Share2 } from 'lucide-react'

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

  const handleShare = () => {
    const encodedData = btoa(JSON.stringify(documentData))
    const url = `${window.location.origin}?data=${encodedData}`
    navigator.clipboard.writeText(url)
    alert('✅ Enlace para compartir copiado al portapapeles')
  }

  return (
    <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="text-center mb-12">
          <div className="inline-block bg-primary text-primary-foreground p-3 rounded-lg mb-4">
            <FileText size={40} />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Generador de Documentos de Vehículos
          </h1>
          <p className="mt-3 text-lg text-muted-foreground sm:mt-4">
            Automatiza el llenado de documentos de transferencia usando la magia del OCR.
          </p>
          <div className="mt-6 flex gap-2 justify-center">
            {step > 1 && (
              <button
                onClick={handleReset}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-secondary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              >
                <RefreshCw className="mr-2 h-4 w-4" /> Empezar de nuevo
              </button>
            )}
            {step === 3 && (
               <button
                onClick={handleShare}
                className="inline-flex items-center px-4 py-2 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-sm font-medium rounded-md"
              >
                <Share2 className="mr-2 h-4 w-4" /> Compartir
              </button>
            )}
          </div>
        </header>

        <main>
          <ProcessingStep currentStep={step} />

          <div className="mt-10">
            {step === 1 && (
              <UploadBox onFilesUploaded={handleFilesUploaded} />
            )}

            {step === 2 && (
              <div className="text-center py-12">
                <div className="animate-spin-slow rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-6"></div>
                <p className="text-xl font-medium text-foreground">Procesando documentos...</p>
                <p className="text-muted-foreground mt-2">Esto puede tardar unos segundos. Estamos extrayendo la información.</p>
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
        </main>
        
        {/* Debug info - show current data */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-12 p-4 bg-muted/50 rounded-lg">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Debug - Datos actuales:</h3>
            <pre className="text-xs text-muted-foreground/80 overflow-auto max-h-60">
              {JSON.stringify(documentData, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}

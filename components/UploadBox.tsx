'use client'

import { useState, useRef } from 'react'
import { Upload, User, Car, AlertTriangle, CheckCircle2, Camera, Edit, ImageIcon, FileImage, X } from 'lucide-react'

interface UploadBoxProps {
  onFileSelected: (file: File, type: 'vendedor' | 'comprador' | 'ficha') => void
  onManualFill: () => void
  processingStatus?: {
    vendedor: 'idle' | 'processing' | 'success' | 'error'
    comprador: 'idle' | 'processing' | 'success' | 'error'
    ficha: 'idle' | 'processing' | 'success' | 'error'
  }
  onRetry?: (type: 'vendedor' | 'comprador' | 'ficha') => void
  files: {
    vendedor?: File,
    comprador?: File,
    ficha?: File
  }
  onContinue?: () => void
  showContinueButton?: boolean
}

export default function UploadBox({ onFileSelected, onManualFill, processingStatus, onRetry, files, onContinue, showContinueButton }: UploadBoxProps) {
  const [showSelector, setShowSelector] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (type: 'vendedor' | 'comprador' | 'ficha', file: File | null) => {
    if (file) {
      onFileSelected(file, type) // Procesar automáticamente
    }
    setShowSelector(null) // Cerrar el selector después de seleccionar
  }

  const openImageSelector = (type: 'vendedor' | 'comprador' | 'ficha') => {
    setShowSelector(type)
  }

  const handleCameraCapture = (type: 'vendedor' | 'comprador' | 'ficha') => {
    if (cameraInputRef.current) {
      cameraInputRef.current.setAttribute('data-type', type)
      cameraInputRef.current.click()
    }
  }

  const handleGallerySelect = (type: 'vendedor' | 'comprador' | 'ficha') => {
    if (galleryInputRef.current) {
      galleryInputRef.current.setAttribute('data-type', type)
      galleryInputRef.current.click()
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    const type = e.target.getAttribute('data-type') as 'vendedor' | 'comprador' | 'ficha'
    if (file && type) {
      handleFileChange(type, file)
    }
    // Reset input value para permitir seleccionar el mismo archivo otra vez
    e.target.value = ''
  }

  // Verificar si todas las 3 imágenes están procesadas exitosamente
  const allThreeFilesProcessed = () => {
    return files.vendedor && files.comprador && files.ficha &&
           processingStatus?.vendedor === 'success' &&
           processingStatus?.comprador === 'success' &&
           processingStatus?.ficha === 'success'
  }

  // Verificar si hay al menos una imagen procesada (exitosa o con error)
  const hasProcessedFiles = () => {
    return Object.keys(files).some(key => {
      const type = key as keyof typeof files
      const status = processingStatus?.[type]
      return files[type] && (status === 'success' || status === 'error')
    })
  }

  const hasFiles = () => {
    return Object.keys(files).some(key => files[key as keyof typeof files])
  }

  // Componente modal para selector de fuente de imagen
  const ImageSourceSelector = ({ type, onClose }: { type: string, onClose: () => void }) => (
    <div 
      className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-background rounded-t-2xl sm:rounded-2xl shadow-xl max-w-sm w-full mx-4 overflow-hidden transform transition-all duration-300 ease-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Seleccionar imagen</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-accent rounded-full transition-colors touch-manipulation"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
        
        <div className="p-6 space-y-3">
          <button
            onClick={() => handleCameraCapture(type as 'vendedor' | 'comprador' | 'ficha')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent active:bg-accent/80 transition-colors text-left touch-manipulation min-h-[72px]"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Camera className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">Tomar foto</div>
              <div className="text-sm text-muted-foreground">Usar la cámara del dispositivo</div>
            </div>
          </button>
          
          <button
            onClick={() => handleGallerySelect(type as 'vendedor' | 'comprador' | 'ficha')}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border hover:bg-accent active:bg-accent/80 transition-colors text-left touch-manipulation min-h-[72px]"
          >
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="font-medium text-foreground">Elegir de galería</div>
              <div className="text-sm text-muted-foreground">Seleccionar foto existente</div>
            </div>
          </button>
        </div>
        
        {/* Espaciado inferior para móviles */}
        <div className="h-4 sm:hidden"></div>
      </div>
    </div>
  )

  const FileUploadBox = ({ 
    type,
    title, 
    description, 
    icon: Icon, 
    file 
  }: { 
    type: 'vendedor' | 'comprador' | 'ficha',
    title: string, 
    description: string, 
    icon: React.ComponentType<any>, 
    file?: File 
  }) => {
    const status = processingStatus?.[type] || 'idle'
    const isProcessing = status === 'processing'
    const hasError = status === 'error'
    const isSuccess = status === 'success'
    
    return (
    <div className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 min-h-[200px] touch-manipulation
      ${isProcessing ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20' : 
        hasError ? 'border-red-500 bg-red-50 dark:bg-red-950/20' :
        isSuccess ? 'border-green-500 bg-green-50 dark:bg-green-950/20' :
        file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent active:bg-accent/80'}`}>
      
      {/* Processing Overlay */}
      {isProcessing && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
          <div className="text-center space-y-3">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent mx-auto"></div>
            <p className="text-sm font-medium text-primary">
              {type === 'vendedor' ? 'Procesando DNI del vendedor...' :
               type === 'comprador' ? 'Procesando DNI del comprador...' :
               'Procesando ficha técnica...'}
            </p>
          </div>
        </div>
      )}
      
      <button
        onClick={() => !isProcessing && openImageSelector(type)}
        disabled={isProcessing}
        className={`block h-full w-full flex flex-col justify-center min-h-[148px] text-center ${
          isProcessing ? 'cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        <Icon className={`mx-auto h-12 w-12 mb-4 transition-colors ${
          isProcessing ? 'text-blue-500' :
          hasError ? 'text-red-500' :
          isSuccess ? 'text-green-600' :
          file ? 'text-primary' : 'text-muted-foreground'
        }`} />
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        
        {isProcessing ? (
          <div className="inline-flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/50 px-3 py-1 text-sm font-medium text-blue-700 dark:text-blue-300 mx-auto">
            <div className="animate-spin rounded-full h-3 w-3 border border-blue-600 border-t-transparent mr-2"></div>
            <span>Procesando imagen...</span>
          </div>
        ) : hasError ? (
          <div className="space-y-2">
            <div className="inline-flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/50 px-3 py-1 text-sm font-medium text-red-700 dark:text-red-300 mx-auto">
              <AlertTriangle className="mr-2 h-4 w-4 flex-shrink-0" />
              <span>Error al procesar</span>
            </div>
            {onRetry && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  onRetry(type)
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                <Upload className="h-3 w-3" />
                Reintentar
              </button>
            )}
          </div>
        ) : isSuccess ? (
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300 mx-auto max-w-full">
            <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0" />
            <span>Procesado correctamente</span>
          </div>
        ) : file ? (
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300 mx-auto max-w-full">
            <CheckCircle2 className="mr-2 h-4 w-4 flex-shrink-0" />
            <span className="truncate">{file.name}</span>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
              <Camera className="h-4 w-4" />
              <span>Toca para elegir</span>
            </div>
            <p className="text-xs text-muted-foreground/80">
              Cámara o galería
            </p>
          </div>
        )}
      </button>
    </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Inputs ocultos para cámara y galería */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileInputChange}
        className="hidden"
      />
      <input
        ref={galleryInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />

      {/* Modal selector de fuente de imagen */}
      {showSelector && (
        <ImageSourceSelector 
          type={showSelector} 
          onClose={() => setShowSelector(null)} 
        />
      )}

      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Sube los Documentos
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Necesitamos imágenes claras del DNI/NIE y la Ficha Técnica.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <FileUploadBox
          type="vendedor"
          title="DNI/NIE Vendedor"
          description="Documento de identidad del vendedor"
          icon={User}
          file={files.vendedor}
        />
        
        <FileUploadBox
          type="comprador"
          title="DNI/NIE Comprador"
          description="Documento de identidad del comprador"
          icon={User}
          file={files.comprador}
        />
        
        <FileUploadBox
          type="ficha"
          title="Ficha Técnica"
          description="Ficha técnica del vehículo (verde o blanca)"
          icon={Car}
          file={files.ficha}
        />
      </div>

      <div className="text-center space-y-4">
        {hasProcessedFiles() && showContinueButton && !allThreeFilesProcessed() && (
          <button
            onClick={onContinue}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 min-h-[44px] touch-manipulation"
          >
            <Upload className="mr-2 h-5 w-5" />
            Continuar con los datos actuales
          </button>
        )}
        
        {hasFiles() && (
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">o</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>
        )}
        
        <button
          onClick={onManualFill}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-11 px-8 min-h-[44px] touch-manipulation"
        >
          <Edit className="mr-2 h-5 w-5" />
          Rellenar Manualmente
        </button>
      </div>

      <div className="mt-10 bg-accent/50 border-l-4 border-accent-foreground rounded-r-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-accent-foreground" aria-hidden="true" />
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-accent-foreground mb-2">Consejos para mejores resultados</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Usa la cámara para obtener mejores resultados en tiempo real.</li>
              <li>Asegúrate de que las imágenes estén bien iluminadas y enfocadas.</li>
              <li>Evita sombras o reflejos en los documentos.</li>
              <li>Coloca los documentos sobre una superficie plana y oscura.</li>
              <li>Mantén el dispositivo estable al tomar la foto.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

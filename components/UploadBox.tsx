'use client'

import { useState, useRef } from 'react'
import { Upload, User, Car, AlertTriangle, CheckCircle2, Camera, Edit, ImageIcon, FileImage, X } from 'lucide-react'

interface UploadBoxProps {
  onFilesUploaded: (files: {
    vendedor?: File,
    comprador?: File,
    ficha?: File
  }) => void
  onManualFill: () => void
}

export default function UploadBox({ onFilesUploaded, onManualFill }: UploadBoxProps) {
  const [files, setFiles] = useState<{
    vendedor?: File,
    comprador?: File,
    ficha?: File
  }>({})
  
  const [showSelector, setShowSelector] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (type: 'vendedor' | 'comprador' | 'ficha', file: File | null) => {
    if (file) {
      setFiles(prev => ({
        ...prev,
        [type]: file
      }))
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

  const handleSubmit = () => {
    if (Object.keys(files).length === 0) {
      alert('Por favor, sube al menos un documento')
      return
    }
    onFilesUploaded(files)
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
  }) => (
    <div className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300 min-h-[200px] touch-manipulation
      ${file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent active:bg-accent/80'}`}>
      
      <button
        onClick={() => openImageSelector(type)}
        className="cursor-pointer block h-full w-full flex flex-col justify-center min-h-[148px] text-center"
      >
        <Icon className={`mx-auto h-12 w-12 mb-4 transition-colors ${
          file ? 'text-primary' : 'text-muted-foreground'
        }`} />
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        {file ? (
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
        <button
          onClick={handleSubmit}
          disabled={Object.keys(files).length === 0}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 min-h-[44px] touch-manipulation"
        >
          <Upload className="mr-2 h-5 w-5" />
          Procesar Documentos
        </button>
        
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-sm text-muted-foreground">o</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>
        
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

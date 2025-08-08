'use client'

import { useState } from 'react'
import { Upload, User, Car, AlertTriangle, CheckCircle2, Camera } from 'lucide-react'

interface UploadBoxProps {
  onFilesUploaded: (files: {
    vendedor?: File,
    comprador?: File,
    ficha?: File
  }) => void
}

export default function UploadBox({ onFilesUploaded }: UploadBoxProps) {
  const [files, setFiles] = useState<{
    vendedor?: File,
    comprador?: File,
    ficha?: File
  }>({})

  const handleFileChange = (type: 'vendedor' | 'comprador' | 'ficha', file: File | null) => {
    if (file) {
      setFiles(prev => ({
        ...prev,
        [type]: file
      }))
    }
  }

  const handleSubmit = () => {
    if (Object.keys(files).length === 0) {
      alert('Por favor, sube al menos un documento')
      return
    }
    onFilesUploaded(files)
  }

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
    <div className={`relative rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300
      ${file ? 'border-primary/50 bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-accent'}`}>
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0] || null
          handleFileChange(type, selectedFile)
        }}
        className="hidden"
        id={`file-${type}`}
      />
      <label htmlFor={`file-${type}`} className="cursor-pointer block">
        <Icon className={`mx-auto h-12 w-12 mb-4 transition-colors ${
          file ? 'text-primary' : 'text-muted-foreground'
        }`} />
        <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground mb-3">{description}</p>
        {file ? (
          <div className="inline-flex items-center justify-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/50 dark:text-green-300">
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {file.name}
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Camera className="h-4 w-4" />
              <span>Haz clic para subir archivo</span>
            </div>
            <p className="text-xs text-muted-foreground/80">
              Soporta cámara y galería
            </p>
          </div>
        )}
      </label>
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
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

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={Object.keys(files).length === 0}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8"
        >
          <Upload className="mr-2 h-5 w-5" />
          Procesar Documentos
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
              <li>Asegúrate de que las imágenes estén bien iluminadas y enfocadas.</li>
              <li>Evita sombras o reflejos en los documentos.</li>
              <li>Coloca los documentos sobre una superficie plana y oscura.</li>
              <li>La resolución debe ser suficiente para leer el texto claramente.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

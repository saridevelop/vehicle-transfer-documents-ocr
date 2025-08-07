'use client'

import { useState } from 'react'
import { Upload, User, Car } from 'lucide-react'

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
    <div className="border-2 border-dashed rounded-lg p-6 text-center transition-colors hover:border-gray-400">
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const selectedFile = e.target.files?.[0] || null
          handleFileChange(type, selectedFile)
        }}
        className="hidden"
        id={`file-${type}`}
      />
      <label htmlFor={`file-${type}`} className="cursor-pointer block">
        <Icon className={`mx-auto h-12 w-12 mb-4 ${
          file ? 'text-green-500' : 'text-gray-400'
        }`} />
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-2">{description}</p>
        {file ? (
          <p className="text-sm text-green-600 font-medium">
            ✓ {file.name}
          </p>
        ) : (
          <p className="text-sm text-gray-500">
            Haz clic para seleccionar una imagen
          </p>
        )}
      </label>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Sube los documentos necesarios
        </h2>
        <p className="text-gray-600">
          Sube las imágenes de los documentos para extraer automáticamente la información
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
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          <Upload className="inline h-5 w-5 mr-2" />
          Procesar Documentos
        </button>
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-medium text-yellow-800 mb-2">💡 Consejos para mejores resultados:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Asegúrate de que las imágenes estén bien iluminadas</li>
          <li>• Evita sombras o reflejos en los documentos</li>
          <li>• Mantén los documentos planos y sin arrugas</li>
          <li>• La resolución debe ser suficiente para leer el texto claramente</li>
        </ul>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { DocumentData } from '@/lib/types'
import { Download, Share2, Edit } from 'lucide-react'

interface EditableFormProps {
  data: DocumentData
  onDataUpdate: (data: DocumentData) => void
  onGeneratePDFs: (type: 'contract' | 'mod02') => void
  isProcessing: boolean
}

export default function EditableForm({ 
  data, 
  onDataUpdate, 
  onGeneratePDFs, 
  isProcessing 
}: EditableFormProps) {
  const [editingData, setEditingData] = useState(data)

  const handleInputChange = (
    section: 'vendedor' | 'comprador' | 'vehiculo',
    field: string,
    value: string
  ) => {
    const newData = {
      ...editingData,
      [section]: {
        ...editingData[section],
        [field]: value
      }
    }
    setEditingData(newData)
    onDataUpdate(newData)
  }

  const handleShare = async () => {
    // Encode data to base64
    const encodedData = btoa(JSON.stringify(editingData))
    const shareUrl = `${window.location.origin}?data=${encodedData}`
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Documentos de Transferencia de Vehículo',
          text: 'Documentos generados automáticamente para la transferencia del vehículo',
          url: shareUrl
        })
      } catch (error) {
        console.log('Error sharing:', error)
        // Fallback to copy to clipboard
        copyToClipboard(shareUrl)
      }
    } else {
      // Fallback options
      copyToClipboard(shareUrl)
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      alert('¡Enlace copiado al portapapeles!')
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('¡Enlace copiado al portapapeles!')
    }
  }

  const FormSection = ({ title, icon: Icon, children }: { 
    title: string, 
    icon: any, 
    children: React.ReactNode 
  }) => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex items-center mb-4">
        <Icon className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  )

  const InputField = ({ 
    label, 
    value, 
    onChange, 
    placeholder = '' 
  }: { 
    label: string, 
    value: string, 
    onChange: (value: string) => void,
    placeholder?: string 
  }) => (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-gray-900"
      />
      {/* Debug info - remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs text-gray-400 mt-1">
          Valor actual: "{value || 'vacío'}"
        </div>
      )}
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Revisa y edita la información extraída
        </h2>
        <p className="text-gray-600">
          Verifica que todos los datos sean correctos antes de generar los documentos
        </p>
      </div>

      <FormSection title="Datos del Vendedor" icon={Edit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nombre completo"
            value={editingData.vendedor.nombre || ''}
            onChange={(value) => handleInputChange('vendedor', 'nombre', value)}
            placeholder="Nombre y apellidos del vendedor"
          />
          <InputField
            label="DNI/NIE"
            value={editingData.vendedor.dni || ''}
            onChange={(value) => handleInputChange('vendedor', 'dni', value)}
            placeholder="12345678A"
          />
          <InputField
            label="Fecha de nacimiento"
            value={editingData.vendedor.fechaNacimiento || ''}
            onChange={(value) => handleInputChange('vendedor', 'fechaNacimiento', value)}
            placeholder="DD/MM/AAAA"
          />
          <InputField
            label="Dirección"
            value={editingData.vendedor.direccion || ''}
            onChange={(value) => handleInputChange('vendedor', 'direccion', value)}
            placeholder="Dirección completa"
          />
        </div>
      </FormSection>

      <FormSection title="Datos del Comprador" icon={Edit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Nombre completo"
            value={editingData.comprador.nombre || ''}
            onChange={(value) => handleInputChange('comprador', 'nombre', value)}
            placeholder="Nombre y apellidos del comprador"
          />
          <InputField
            label="DNI/NIE"
            value={editingData.comprador.dni || ''}
            onChange={(value) => handleInputChange('comprador', 'dni', value)}
            placeholder="12345678A"
          />
          <InputField
            label="Fecha de nacimiento"
            value={editingData.comprador.fechaNacimiento || ''}
            onChange={(value) => handleInputChange('comprador', 'fechaNacimiento', value)}
            placeholder="DD/MM/AAAA"
          />
          <InputField
            label="Dirección"
            value={editingData.comprador.direccion || ''}
            onChange={(value) => handleInputChange('comprador', 'direccion', value)}
            placeholder="Dirección completa"
          />
        </div>
      </FormSection>

      <FormSection title="Datos del Vehículo" icon={Edit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField
            label="Marca"
            value={editingData.vehiculo.marca || ''}
            onChange={(value) => handleInputChange('vehiculo', 'marca', value)}
            placeholder="Toyota, Volkswagen, etc."
          />
          <InputField
            label="Modelo"
            value={editingData.vehiculo.modelo || ''}
            onChange={(value) => handleInputChange('vehiculo', 'modelo', value)}
            placeholder="Corolla, Golf, etc."
          />
          <InputField
            label="Matrícula"
            value={editingData.vehiculo.matricula || ''}
            onChange={(value) => handleInputChange('vehiculo', 'matricula', value)}
            placeholder="1234ABC"
          />
          <InputField
            label="Número de bastidor (VIN)"
            value={editingData.vehiculo.bastidor || ''}
            onChange={(value) => handleInputChange('vehiculo', 'bastidor', value)}
            placeholder="VIN del vehículo"
          />
          <InputField
            label="Fecha de matriculación"
            value={editingData.vehiculo.fechaMatriculacion || ''}
            onChange={(value) => handleInputChange('vehiculo', 'fechaMatriculacion', value)}
            placeholder="DD/MM/AAAA"
          />
          <InputField
            label="Tipo de vehículo"
            value={editingData.vehiculo.tipoVehiculo || ''}
            onChange={(value) => handleInputChange('vehiculo', 'tipoVehiculo', value)}
            placeholder="Turismo, Furgón, etc."
          />
          <InputField
            label="Potencia"
            value={editingData.vehiculo.potencia || ''}
            onChange={(value) => handleInputChange('vehiculo', 'potencia', value)}
            placeholder="CV o kW"
          />
          <InputField
            label="Cilindrada"
            value={editingData.vehiculo.cilindrada || ''}
            onChange={(value) => handleInputChange('vehiculo', 'cilindrada', value)}
            placeholder="cm³"
          />
        </div>
      </FormSection>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">📄 Documentos disponibles para descarga</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2">📋 Contrato de Compraventa</h4>
            <p className="text-sm text-gray-600 mb-2">
              Documento legal para la venta entre particulares. Incluye datos del vendedor, comprador y vehículo.
            </p>
            <div className="text-xs text-blue-600 mb-3 flex items-center">
              <span className="mr-1">ℹ️</span>
              <span>Generado automáticamente con tus datos</span>
            </div>
            <button
              onClick={() => onGeneratePDFs('contract')}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Generando...' : 'Descargar Contrato'}
            </button>
          </div>
          
          <div className="bg-white p-4 rounded-lg border">
            <h4 className="font-medium text-gray-900 mb-2">🚗 Mod.02-ES (DGT)</h4>
            <p className="text-sm text-gray-600 mb-2">
              Formulario oficial de la DGT para el cambio de titularidad del vehículo.
            </p>
            <div className="text-xs text-green-600 mb-3 flex items-center">
              <span className="mr-1">✅</span>
              <span>Formulario oficial rellenado automáticamente</span>
            </div>
            <button
              onClick={() => onGeneratePDFs('mod02')}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Generando...' : 'Descargar Mod.02-ES'}
            </button>
          </div>
        </div>
        
        <div className="text-center">
          <button
            onClick={handleShare}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors flex items-center justify-center mx-auto"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Compartir aplicación
          </button>
        </div>
      </div>
    </div>
  )
}

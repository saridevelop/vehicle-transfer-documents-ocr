'use client'

import { useState } from 'react'
import { DocumentData } from '@/lib/types'
import { Download, UserCircle, Car, FileSignature } from 'lucide-react'

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

  const FormSection = ({ title, icon: Icon, children }: { 
    title: string, 
    icon: React.ElementType, 
    children: React.ReactNode 
  }) => (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
      <div className="flex items-center mb-6">
        <Icon className="h-7 w-7 text-primary mr-3" />
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
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
    <div>
      <label className="block text-sm font-medium text-muted-foreground mb-1.5">
        {label}
      </label>
      <input
        type="text"
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  )

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Revisa y Edita la Información
        </h2>
        <p className="mt-2 text-lg text-muted-foreground">
          Asegúrate de que los datos extraídos son correctos.
        </p>
      </div>

      <FormSection title="Datos del Vendedor" icon={UserCircle}>
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
      </FormSection>

      <FormSection title="Datos del Comprador" icon={UserCircle}>
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
      </FormSection>

      <FormSection title="Datos del Vehículo" icon={Car}>
        <InputField
          label="Marca"
          value={editingData.vehiculo.marca || ''}
          onChange={(value) => handleInputChange('vehiculo', 'marca', value)}
          placeholder="Ej: Toyota, Volkswagen"
        />
        <InputField
          label="Modelo"
          value={editingData.vehiculo.modelo || ''}
          onChange={(value) => handleInputChange('vehiculo', 'modelo', value)}
          placeholder="Ej: Corolla, Golf"
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
          placeholder="Ej: Turismo, Furgón"
        />
        <InputField
          label="Potencia (CV)"
          value={editingData.vehiculo.potencia || ''}
          onChange={(value) => handleInputChange('vehiculo', 'potencia', value)}
          placeholder="Ej: 110"
        />
        <InputField
          label="Cilindrada (cm³)"
          value={editingData.vehiculo.cilindrada || ''}
          onChange={(value) => handleInputChange('vehiculo', 'cilindrada', value)}
          placeholder="Ej: 1598"
        />
      </FormSection>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6 text-center">📄 Documentos para Descargar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-background/50 p-6 rounded-lg border border-input flex flex-col">
            <FileSignature className="h-8 w-8 text-primary mb-3"/>
            <h4 className="font-semibold text-foreground mb-2">Contrato de Compraventa</h4>
            <p className="text-sm text-muted-foreground mb-4 flex-grow">
              Documento legal para la venta entre particulares.
            </p>
            <button
              onClick={() => onGeneratePDFs('contract')}
              disabled={isProcessing}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Generando...' : 'Descargar Contrato'}
            </button>
          </div>
          
          <div className="bg-background/50 p-6 rounded-lg border border-input flex flex-col">
            <Car className="h-8 w-8 text-primary mb-3"/>
            <h4 className="font-semibold text-foreground mb-2">Mod.02-ES (DGT)</h4>
            <p className="text-sm text-muted-foreground mb-4 flex-grow">
              Formulario oficial de la DGT para el cambio de titularidad.
            </p>
            <button
              onClick={() => onGeneratePDFs('mod02')}
              disabled={isProcessing}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full"
            >
              <Download className="h-4 w-4 mr-2" />
              {isProcessing ? 'Generando...' : 'Descargar Mod.02-ES'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

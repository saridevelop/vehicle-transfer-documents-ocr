'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useDebounce } from 'use-debounce'
import { DocumentData } from '@/lib/types'
import { useMobileInput } from '@/lib/hooks/useMobileInput'
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
  const [formData, setFormData] = useState(data)
  const isUserEditingRef = useRef(false)
  const prevDataRef = useRef(data)

  // Usar hook personalizado para mejor experiencia móvil
  const { handleInputFocus, handleInputBlur } = useMobileInput()

  // Usar use-debounce para manejo profesional del debounce
  const [debouncedFormData] = useDebounce(formData, 500)

  // Solo actualizar formData si los datos vienen de fuera (OCR) y el usuario no está editando
  useEffect(() => {
    // Si el usuario está escribiendo, no actualizar
    if (isUserEditingRef.current) {
      return
    }

    // Solo actualizar si realmente cambiaron los datos
    if (JSON.stringify(data) !== JSON.stringify(prevDataRef.current)) {
      setFormData(data)
      prevDataRef.current = data
    }
  }, [data])

  // Efecto para enviar los datos al padre cuando se terminan de editar
  useEffect(() => {
    // Solo enviar si el usuario ha editado algo
    if (isUserEditingRef.current && debouncedFormData) {
      onDataUpdate(debouncedFormData)
      isUserEditingRef.current = false
    }
  }, [debouncedFormData, onDataUpdate])

  // Handler optimizado que previene re-renders innecesarios
  const handleFieldChange = useCallback((
    section: keyof DocumentData,
    field: string,
    value: string
  ) => {
    isUserEditingRef.current = true
    
    setFormData(prevData => ({
      ...prevData,
      [section]: {
        ...prevData[section],
        [field]: value
      }
    }))
  }, [])

  // Componente FormSection memoizado para evitar re-renders
  const FormSection = useCallback(({ title, icon: Icon, children }: { 
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
  ), [])

  // Componente Input profesional con estabilidad garantizada
  const InputField = useCallback(({ 
    label, 
    value, 
    onChange, 
    placeholder = '',
    type = 'text',
    id
  }: { 
    label: string
    value: string
    onChange: (value: string) => void
    placeholder?: string
    type?: string
    id: string
  }) => {
    const inputRef = useRef<HTMLInputElement>(null)
    
    // Memoizar handlers para evitar re-renders
    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      onChange(e.target.value)
    }, [onChange])

    return (
      <div className="space-y-2">
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
        <input
          ref={inputRef}
          id={id}
          type={type}
          value={value || ''}
          onChange={handleChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    )
  }, [handleInputFocus, handleInputBlur])

  // Componente DateField profesional con estabilidad garantizada
  const DateField = useCallback(({ 
    label, 
    value, 
    onChange,
    id
  }: { 
    label: string
    value: string
    onChange: (value: string) => void
    id: string
  }) => {
    const dateRef = useRef<HTMLInputElement>(null)

    // Memoizar conversores para evitar recálculos
    const toInputFormat = useCallback((dateStr: string): string => {
      if (!dateStr || dateStr.length < 10) return ''
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        const [day, month, year] = parts
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
      return ''
    }, [])

    const toDisplayFormat = useCallback((dateStr: string): string => {
      if (!dateStr) return ''
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    }, [])

    const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault()
      const inputValue = e.target.value
      const displayValue = inputValue ? toDisplayFormat(inputValue) : ''
      onChange(displayValue)
    }, [onChange, toDisplayFormat])

    return (
      <div className="space-y-2">
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
        <input
          ref={dateRef}
          id={id}
          type="date"
          value={toInputFormat(value)}
          onChange={handleDateChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        />
      </div>
    )
  }, [handleInputFocus, handleInputBlur])

  // Memoizar handlers específicos para evitar re-renders
  const vendedorHandlers = useMemo(() => ({
    nombre: (value: string) => handleFieldChange('vendedor', 'nombre', value),
    dni: (value: string) => handleFieldChange('vendedor', 'dni', value),
    fechaNacimiento: (value: string) => handleFieldChange('vendedor', 'fechaNacimiento', value),
    direccion: (value: string) => handleFieldChange('vendedor', 'direccion', value),
  }), [handleFieldChange])

  const compradorHandlers = useMemo(() => ({
    nombre: (value: string) => handleFieldChange('comprador', 'nombre', value),
    dni: (value: string) => handleFieldChange('comprador', 'dni', value),
    fechaNacimiento: (value: string) => handleFieldChange('comprador', 'fechaNacimiento', value),
    direccion: (value: string) => handleFieldChange('comprador', 'direccion', value),
  }), [handleFieldChange])

  const vehiculoHandlers = useMemo(() => ({
    marca: (value: string) => handleFieldChange('vehiculo', 'marca', value),
    modelo: (value: string) => handleFieldChange('vehiculo', 'modelo', value),
    matricula: (value: string) => handleFieldChange('vehiculo', 'matricula', value),
    bastidor: (value: string) => handleFieldChange('vehiculo', 'bastidor', value),
    fechaMatriculacion: (value: string) => handleFieldChange('vehiculo', 'fechaMatriculacion', value),
    tipoVehiculo: (value: string) => handleFieldChange('vehiculo', 'tipoVehiculo', value),
    potencia: (value: string) => handleFieldChange('vehiculo', 'potencia', value),
    cilindrada: (value: string) => handleFieldChange('vehiculo', 'cilindrada', value),
  }), [handleFieldChange])

  return (
    <div className="w-full max-w-4xl mx-auto mobile-form-container">
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
          id="vendedor-nombre"
          label="Nombre completo"
          value={formData.vendedor.nombre || ''}
          onChange={vendedorHandlers.nombre}
          placeholder="Nombre y apellidos del vendedor"
        />
        <InputField
          id="vendedor-dni"
          label="DNI/NIE"
          value={formData.vendedor.dni || ''}
          onChange={vendedorHandlers.dni}
          placeholder="12345678A"
        />
        <DateField
          id="vendedor-fechaNacimiento"
          label="Fecha de nacimiento"
          value={formData.vendedor.fechaNacimiento || ''}
          onChange={vendedorHandlers.fechaNacimiento}
        />
        <InputField
          id="vendedor-direccion"
          label="Dirección"
          value={formData.vendedor.direccion || ''}
          onChange={vendedorHandlers.direccion}
          placeholder="Dirección completa"
        />
      </FormSection>

      <FormSection title="Datos del Comprador" icon={UserCircle}>
        <InputField
          id="comprador-nombre"
          label="Nombre completo"
          value={formData.comprador.nombre || ''}
          onChange={compradorHandlers.nombre}
          placeholder="Nombre y apellidos del comprador"
        />
        <InputField
          id="comprador-dni"
          label="DNI/NIE"
          value={formData.comprador.dni || ''}
          onChange={compradorHandlers.dni}
          placeholder="12345678A"
        />
        <DateField
          id="comprador-fechaNacimiento"
          label="Fecha de nacimiento"
          value={formData.comprador.fechaNacimiento || ''}
          onChange={compradorHandlers.fechaNacimiento}
        />
        <InputField
          id="comprador-direccion"
          label="Dirección"
          value={formData.comprador.direccion || ''}
          onChange={compradorHandlers.direccion}
          placeholder="Dirección completa"
        />
      </FormSection>

      <FormSection title="Datos del Vehículo" icon={Car}>
        <InputField
          id="vehiculo-marca"
          label="Marca"
          value={formData.vehiculo.marca || ''}
          onChange={vehiculoHandlers.marca}
          placeholder="Ej: Toyota, Volkswagen"
        />
        <InputField
          id="vehiculo-modelo"
          label="Modelo"
          value={formData.vehiculo.modelo || ''}
          onChange={vehiculoHandlers.modelo}
          placeholder="Ej: Corolla, Golf"
        />
        <InputField
          id="vehiculo-matricula"
          label="Matrícula"
          value={formData.vehiculo.matricula || ''}
          onChange={vehiculoHandlers.matricula}
          placeholder="1234ABC"
        />
        <InputField
          id="vehiculo-bastidor"
          label="Número de bastidor (VIN)"
          value={formData.vehiculo.bastidor || ''}
          onChange={vehiculoHandlers.bastidor}
          placeholder="VIN del vehículo"
        />
        <DateField
          id="vehiculo-fechaMatriculacion"
          label="Fecha de matriculación"
          value={formData.vehiculo.fechaMatriculacion || ''}
          onChange={vehiculoHandlers.fechaMatriculacion}
        />
        <InputField
          id="vehiculo-tipoVehiculo"
          label="Tipo de vehículo"
          value={formData.vehiculo.tipoVehiculo || ''}
          onChange={vehiculoHandlers.tipoVehiculo}
          placeholder="Ej: Turismo, Furgón"
        />
        <InputField
          id="vehiculo-potencia"
          label="Potencia (CV)"
          value={formData.vehiculo.potencia || ''}
          onChange={vehiculoHandlers.potencia}
          placeholder="Ej: 110"
        />
        <InputField
          id="vehiculo-cilindrada"
          label="Cilindrada (cm³)"
          value={formData.vehiculo.cilindrada || ''}
          onChange={vehiculoHandlers.cilindrada}
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
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full min-h-[44px] touch-manipulation"
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
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full min-h-[44px] touch-manipulation"
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

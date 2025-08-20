'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Upload } from 'lucide-react'
import { useDebounce } from 'use-debounce'
import { DocumentData } from '@/lib/types'
import { useMobileInput } from '@/lib/hooks/useMobileInput'
import { Download, UserCircle, Car, FileSignature, Eye, FileX } from 'lucide-react'

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
  const [uploadingSection, setUploadingSection] = useState<null | 'vendedor' | 'comprador' | 'vehiculo'>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [previewPdf, setPreviewPdf] = useState<string | null>(null)
  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false)
  // Maneja la subida de una nueva foto para una sección específica
  const handleSectionPhotoUpload = async (section: 'vendedor' | 'comprador' | 'vehiculo', file: File) => {
    setIsUploading(true)
    setUploadingSection(section)
    try {
      // El API espera 'ficha' para el vehículo, no 'vehiculo'
      const fieldName = section === 'vehiculo' ? 'ficha' : section
      
      console.log(`Uploading ${section} with field name: ${fieldName}`)
      
      const imageFormData = new FormData()
      imageFormData.append('image', file)
      imageFormData.append('type', fieldName)

      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: imageFormData
      })
      if (!response.ok) throw new Error('Error al procesar la imagen')
      const result = await response.json()
      
      console.log('OCR Response:', result)
      
      // Solo actualiza la sección correspondiente
      setFormData(prev => ({
        ...prev,
        [section]: result.data || {}
      }))
      if (onDataUpdate) {
        // Usar el nuevo estado actualizado
        setFormData(prev => {
          const updated = {
            ...prev,
            [section]: result.data || {}
          }
          onDataUpdate(updated)
          return updated
        })
      }
      
      toast.success(`${section === 'vehiculo' ? 'Ficha técnica' : 'DNI'} procesado correctamente`)
    } catch (e) {
      console.error('Error uploading section photo:', e)
      toast.error('Error al procesar la imagen. Intenta de nuevo.')
    } finally {
      setIsUploading(false)
      setUploadingSection(null)
    }
  }
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

  // Handlers para los campos de vendedor, comprador y vehiculo
  const vendedorHandlers = useMemo(() => ({
    nombre: (value: string) => handleFieldChange('vendedor', 'nombre', value),
    dni: (value: string) => handleFieldChange('vendedor', 'dni', value),
    fechaNacimiento: (value: string) => handleFieldChange('vendedor', 'fechaNacimiento', value),
    direccion: (value: string) => handleFieldChange('vendedor', 'direccion', value),
    poblacion: (value: string) => handleFieldChange('vendedor', 'poblacion', value),
  }), [handleFieldChange])

  const compradorHandlers = useMemo(() => ({
    nombre: (value: string) => handleFieldChange('comprador', 'nombre', value),
    dni: (value: string) => handleFieldChange('comprador', 'dni', value),
    fechaNacimiento: (value: string) => handleFieldChange('comprador', 'fechaNacimiento', value),
    direccion: (value: string) => handleFieldChange('comprador', 'direccion', value),
    poblacion: (value: string) => handleFieldChange('comprador', 'poblacion', value),
  }), [handleFieldChange])


  // Componente FormSection profesional con botón flotante opcional
  const FormSection = useCallback(({
    title,
    icon: Icon,
    children,
    uploadButton
  }: {
    title: string,
    icon: React.ElementType,
    children: React.ReactNode,
    uploadButton?: React.ReactNode
  }) => (
    <div className="bg-card rounded-xl shadow-sm border border-border p-6 mb-8">
      <div className="flex items-center mb-6 relative">
        <Icon className="h-7 w-7 text-primary mr-3" />
        <h3 className="text-xl font-semibold text-foreground flex-1">{title}</h3>
        {uploadButton && (
          <div className="absolute right-0 top-1">{uploadButton}</div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        {children}
      </div>
    </div>
  ), [])

  // Componente Input profesional con estabilidad garantizada
  const InputField = ({ 
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
    return (
      <div className="space-y-2">
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
          autoComplete="off"
          spellCheck="false"
        />
      </div>
    )
  }

  // Componente DateField profesional con estabilidad garantizada
  const DateField = ({ 
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
    const toInputFormat = (dateStr: string): string => {
      if (!dateStr || dateStr.length < 10) return ''
      const parts = dateStr.split('/')
      if (parts.length === 3) {
        const [day, month, year] = parts
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`
      }
      return ''
    }
    const toDisplayFormat = (dateStr: string): string => {
      if (!dateStr) return ''
      const [year, month, day] = dateStr.split('-')
      return `${day}/${month}/${year}`
    }
    const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value
      const displayValue = inputValue ? toDisplayFormat(inputValue) : ''
      onChange(displayValue)
    }
    return (
      <div className="space-y-2">
        <label 
          htmlFor={id}
          className="block text-sm font-medium text-muted-foreground"
        >
          {label}
        </label>
        <input
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
  }

  const vehiculoHandlers = useMemo(() => ({
    marca: (value: string) => handleFieldChange('vehiculo', 'marca', value),
    modelo: (value: string) => handleFieldChange('vehiculo', 'modelo', value),
    denominacionComercial: (value: string) => handleFieldChange('vehiculo', 'denominacionComercial', value),
    matricula: (value: string) => handleFieldChange('vehiculo', 'matricula', value),
    bastidor: (value: string) => handleFieldChange('vehiculo', 'bastidor', value),
    fechaMatriculacion: (value: string) => handleFieldChange('vehiculo', 'fechaMatriculacion', value),
    categoria: (value: string) => handleFieldChange('vehiculo', 'categoria', value),
    carroceria: (value: string) => handleFieldChange('vehiculo', 'carroceria', value),
    potencia: (value: string) => handleFieldChange('vehiculo', 'potencia', value),
    cilindrada: (value: string) => handleFieldChange('vehiculo', 'cilindrada', value),
    combustible: (value: string) => handleFieldChange('vehiculo', 'combustible', value),
    plazasAsiento: (value: string) => handleFieldChange('vehiculo', 'plazasAsiento', value),
    color: (value: string) => handleFieldChange('vehiculo', 'color', value),
    // Mantener compatibilidad
    tipoVehiculo: (value: string) => handleFieldChange('vehiculo', 'tipoVehiculo', value),
  }), [handleFieldChange])

  const handlePreviewPdf = async (type: 'contract' | 'mod02') => {
    setIsGeneratingPreview(true)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formData,
          type: type,
          preview: true
        }),
      })
      if (!response.ok) throw new Error('Error generando preview')
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      setPreviewPdf(url)
    } catch (error) {
      toast.error('Error al generar la previsualización')
    } finally {
      setIsGeneratingPreview(false)
    }
  }

  const handleDownloadXML = async () => {
    try {
      const response = await fetch('/api/generate-xml', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          data: formData
        }),
      })
      if (!response.ok) throw new Error('Error generando XML')
      
      // Crear descarga del archivo
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CTIT_${new Date().toISOString().replace(/[-:]/g, '').replace('T', '').split('.')[0]}.xml`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      toast.error('Error al generar el archivo XML')
    }
  }

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

      <FormSection
        title="Datos del Vendedor"
        icon={UserCircle}
        uploadButton={
          <label className={`inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md border transition-colors ${
            uploadingSection === 'vendedor' && isUploading
              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-700 dark:text-blue-300'
              : 'text-primary hover:bg-accent hover:text-accent-foreground bg-background border-border'
          } ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {uploadingSection === 'vendedor' && isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">Procesando DNI...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span className="text-sm">Subir foto de DNI</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  handleSectionPhotoUpload('vendedor', file)
                }
                e.target.value = ''
              }}
            />
          </label>
        }
      >
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
          placeholder="Calle, número, piso, puerta"
        />
        <InputField
          id="vendedor-poblacion"
          label="Población"
          value={formData.vendedor.poblacion || ''}
          onChange={vendedorHandlers.poblacion}
          placeholder="Ciudad y código postal"
        />
      </FormSection>

      <FormSection
        title="Datos del Comprador"
        icon={UserCircle}
        uploadButton={
          <label className={`inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md border transition-colors ${
            uploadingSection === 'comprador' && isUploading
              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-700 dark:text-blue-300'
              : 'text-primary hover:bg-accent hover:text-accent-foreground bg-background border-border'
          } ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {uploadingSection === 'comprador' && isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">Procesando DNI...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span className="text-sm">Subir foto de DNI</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  handleSectionPhotoUpload('comprador', file)
                }
                e.target.value = ''
              }}
            />
          </label>
        }
      >
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
          placeholder="Calle, número, piso, puerta"
        />
        <InputField
          id="comprador-poblacion"
          label="Población"
          value={formData.comprador.poblacion || ''}
          onChange={compradorHandlers.poblacion}
          placeholder="Ciudad y código postal"
        />
      </FormSection>

      <FormSection
        title="Datos del Vehículo"
        icon={Car}
        uploadButton={
          <label className={`inline-flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md border transition-colors ${
            uploadingSection === 'vehiculo' && isUploading
              ? 'bg-blue-50 dark:bg-blue-950/20 border-blue-500 text-blue-700 dark:text-blue-300'
              : 'text-primary hover:bg-accent hover:text-accent-foreground bg-background border-border'
          } ${isUploading ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {uploadingSection === 'vehiculo' && isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                <span className="text-sm">Procesando ficha técnica...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span className="text-sm">Subir foto de ficha</span>
              </>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isUploading}
              onChange={e => {
                const file = e.target.files?.[0]
                if (file) {
                  handleSectionPhotoUpload('vehiculo', file)
                }
                e.target.value = ''
              }}
            />
          </label>
        }
      >
        <InputField
          id="vehiculo-marca"
          label="Marca (D.1)"
          value={formData.vehiculo.marca || ''}
          onChange={vehiculoHandlers.marca}
          placeholder="Ej: Toyota, Volkswagen"
        />
        <InputField
          id="vehiculo-modelo"
          label="Modelo (D.2)"
          value={formData.vehiculo.modelo || ''}
          onChange={vehiculoHandlers.modelo}
          placeholder="Ej: Corolla, Golf"
        />
        <InputField
          id="vehiculo-denominacionComercial"
          label="Denominación comercial (D.3)"
          value={formData.vehiculo.denominacionComercial || ''}
          onChange={vehiculoHandlers.denominacionComercial}
          placeholder="Nombre comercial del modelo"
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
          label="Número de bastidor (E)"
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
          id="vehiculo-categoria"
          label="Categoría (J)"
          value={formData.vehiculo.categoria || ''}
          onChange={vehiculoHandlers.categoria}
          placeholder="Ej: M1, N1, L3e"
        />
        <InputField
          id="vehiculo-carroceria"
          label="Carrocería (J.1)"
          value={formData.vehiculo.carroceria || ''}
          onChange={vehiculoHandlers.carroceria}
          placeholder="Ej: Berlina, Familiar"
        />
        <InputField
          id="vehiculo-potencia"
          label="Potencia (P.2)"
          value={formData.vehiculo.potencia || ''}
          onChange={vehiculoHandlers.potencia}
          placeholder="Ej: 110 CV o 81 kW"
        />
        <InputField
          id="vehiculo-cilindrada"
          label="Cilindrada (P.1)"
          value={formData.vehiculo.cilindrada || ''}
          onChange={vehiculoHandlers.cilindrada}
          placeholder="Ej: 1598 cm³"
        />
        <InputField
          id="vehiculo-combustible"
          label="Combustible (P.3)"
          value={formData.vehiculo.combustible || ''}
          onChange={vehiculoHandlers.combustible}
          placeholder="Ej: Gasolina, Diesel, Eléctrico"
        />
        <InputField
          id="vehiculo-plazasAsiento"
          label="Plazas asiento (S.1)"
          value={formData.vehiculo.plazasAsiento || ''}
          onChange={vehiculoHandlers.plazasAsiento}
          placeholder="Ej: 5"
        />
        <InputField
          id="vehiculo-color"
          label="Color (R)"
          value={formData.vehiculo.color || ''}
          onChange={vehiculoHandlers.color}
          placeholder="Ej: Blanco, Azul"
        />
      </FormSection>

      <div className="bg-card rounded-xl shadow-sm border border-border p-6">
        <h3 className="text-xl font-semibold text-foreground mb-6 text-center">📄 Documentos para Descargar</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-background/50 p-6 rounded-lg border border-input flex flex-col">
            <FileSignature className="h-8 w-8 text-primary mb-3"/>
            <h4 className="font-semibold text-foreground mb-2">Contrato de Compraventa</h4>
            <p className="text-sm text-muted-foreground mb-4 flex-grow">
              Documento legal para la venta entre particulares.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handlePreviewPdf('contract')}
                disabled={isGeneratingPreview}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full min-h-[44px] touch-manipulation"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isGeneratingPreview ? 'Cargando...' : 'Previsualizar'}
              </button>
              <button
                onClick={() => onGeneratePDFs('contract')}
                disabled={isProcessing}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full min-h-[44px] touch-manipulation"
              >
                <Download className="h-4 w-4 mr-2" />
                {isProcessing ? 'Generando...' : 'Descargar Contrato'}
              </button>
            </div>
          </div>
          
          <div className="bg-background/50 p-6 rounded-lg border border-input flex flex-col">
            <Car className="h-8 w-8 text-primary mb-3"/>
            <h4 className="font-semibold text-foreground mb-2">Mod.02-ES (DGT)</h4>
            <p className="text-sm text-muted-foreground mb-4 flex-grow">
              Formulario oficial de la DGT para el cambio de titularidad.
            </p>
            <div className="space-y-2">
              <button
                onClick={() => handlePreviewPdf('mod02')}
                disabled={isGeneratingPreview}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-secondary text-secondary-foreground hover:bg-secondary/80 h-10 px-4 py-2 w-full min-h-[44px] touch-manipulation"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isGeneratingPreview ? 'Cargando...' : 'Previsualizar'}
              </button>
              <button
                onClick={() => onGeneratePDFs('mod02')}
                disabled={isProcessing}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full min-h-[44px] touch-manipulation"
              >
                <Download className="h-4 w-4 mr-2" />
                {isProcessing ? 'Generando...' : 'Descargar Mod.02-ES'}
              </button>
            </div>
          </div>

          <div className="bg-background/50 p-6 rounded-lg border border-input flex flex-col">
            <FileX className="h-8 w-8 text-primary mb-3"/>
            <h4 className="font-semibold text-foreground mb-2">XML DGT (CTIT)</h4>
            <p className="text-sm text-muted-foreground mb-4 flex-grow">
              Archivo XML para tramitación electrónica ante la DGT.
            </p>
            <button
              onClick={handleDownloadXML}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-green-600 text-white hover:bg-green-700 h-10 px-4 py-2 w-full min-h-[44px] touch-manipulation"
            >
              <Download className="h-4 w-4 mr-2" />
              Descargar XML
            </button>
          </div>
        </div>
      </div>

      {previewPdf && (
        <div className="mt-8 bg-card rounded-xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-foreground">📄 Previsualización del Documento</h3>
            <button
              onClick={() => setPreviewPdf(null)}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              ✕
            </button>
          </div>
          <div className="w-full h-96 border border-border rounded-lg overflow-hidden">
            <iframe
              src={previewPdf}
              className="w-full h-full"
              title="Previsualización del PDF"
            />
          </div>
        </div>
      )}
    </div>
  )
}

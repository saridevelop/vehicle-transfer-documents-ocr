import { DocumentData } from './types'

interface XMLGenerationOptions {
  agentNif?: string
  agencyNif?: string
  dgtLocalDivisionKey?: string
  customDossierNumber?: string
}

export function generateDGTXML(data: DocumentData, options: XMLGenerationOptions = {}): string {
  const currentDate = new Date().toISOString().split('T')[0]
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').split('.')[0]
  
  // Valores por defecto o configurables
  const agentNif = options.agentNif || '00000000T'
  const agencyNif = options.agencyNif || '00000000T'
  const dgtLocalDivisionKey = options.dgtLocalDivisionKey || 'B '
  const customDossierNumber = options.customDossierNumber || `2025-1/${timestamp}`

  // Función para limpiar y formatear campos
  const clean = (value: string | undefined): string => (value || '').trim()
  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return currentDate
    // Convertir DD/MM/AAAA a AAAA-MM-DD
    const parts = dateStr.split('/')
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`
    }
    return currentDate
  }

  // Función para extraer nombre y apellidos
  const parseFullName = (fullName: string) => {
    const parts = fullName.trim().split(' ')
    if (parts.length === 1) {
      return { name: parts[0], surname: '', surname2: '' }
    } else if (parts.length === 2) {
      return { name: parts[0], surname: parts[1], surname2: '' }
    } else if (parts.length >= 3) {
      return { 
        name: parts[0], 
        surname: parts[1], 
        surname2: parts.slice(2).join(' ') 
      }
    }
    return { name: fullName, surname: '', surname2: '' }
  }

  // Función para extraer dirección
  const parseAddress = (direccion: string, poblacion: string) => {
    const dirLimpia = clean(direccion)
    const pobLimpia = clean(poblacion)
    
    // Intentar extraer tipo de calle, nombre y número
    const streetMatch = dirLimpia.match(/^(CALLE|C\/|AVDA|AVENIDA|PLAZA|PL|PASEO|PSO)\s+(.+?)(?:\s+(\d+))?(?:\s*,?\s*(\d+)º?\s*([A-Z]?))?$/i)
    
    if (streetMatch) {
      return {
        streetType: streetMatch[1].replace('C/', 'CALLE').toUpperCase(),
        streetName: streetMatch[2].toUpperCase(),
        streetNumber: streetMatch[3] || '0',
        buildFloor: streetMatch[4] || '',
        buildDoor: streetMatch[5] || ''
      }
    }
    
    // Fallback simple
    const numberMatch = dirLimpia.match(/(.+?)\s+(\d+)/)
    return {
      streetType: 'CALLE',
      streetName: numberMatch ? numberMatch[1].toUpperCase() : dirLimpia.toUpperCase(),
      streetNumber: numberMatch ? numberMatch[2] : '0',
      buildFloor: '',
      buildDoor: ''
    }
  }

  // Función para extraer código postal
  const extractZipCode = (poblacion: string): string => {
    const match = poblacion.match(/(\d{5})/)
    return match ? match[1] : '00000'
  }

  // Parsear datos del vendedor
  const vendedorName = parseFullName(clean(data.vendedor.nombre))
  const vendedorAddress = parseAddress(clean(data.vendedor.direccion), clean(data.vendedor.poblacion))
  const vendedorZip = extractZipCode(clean(data.vendedor.poblacion))

  // Parsear datos del comprador  
  const compradorName = parseFullName(clean(data.comprador.nombre))
  const compradorAddress = parseAddress(clean(data.comprador.direccion), clean(data.comprador.poblacion))
  const compradorZip = extractZipCode(clean(data.comprador.poblacion))

  // Determinar tipo de combustible
  const getFuelCode = (combustible: string): string => {
    const comb = combustible.toLowerCase()
    if (comb.includes('gasolina')) return 'GA'
    if (comb.includes('diesel') || comb.includes('gasoil')) return 'GO'
    if (comb.includes('eléctrico')) return 'EL'
    if (comb.includes('híbrido')) return 'HI'
    return 'GA' // Por defecto gasolina
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<a9 xmlns="http://a9.gescogroup.com/xmlbeans/matriculation">
  <CTIT>
    <CTITType>CTI</CTITType>
    <CTITAction>ENDCTI</CTITAction>
    <CTITPurpose>TRANSMISSION</CTITPurpose>
    <AssignServiceDGTTax>false</AssignServiceDGTTax>
    <AssignAVPODGTTax>false</AssignAVPODGTTax>
    <AssignDGTTax>true</AssignDGTTax>
    <CTITFileState>NEW</CTITFileState>
    <HasUsualDriver>false</HasUsualDriver>
    <DoubleFirst>false</DoubleFirst>
    <DossierNumber></DossierNumber>
    <CustomDossierNumber>${customDossierNumber}</CustomDossierNumber>
    <TaxExempt>false</TaxExempt>
    <AgentNif>${agentNif}</AgentNif>
    <AgencyNif>${agencyNif}</AgencyNif>
    <DGTLocalDivisionKey>${dgtLocalDivisionKey}</DGTLocalDivisionKey>
    <MatriculationDate>${formatDate(data.vehiculo.fechaMatriculacion)}</MatriculationDate>
    
    <CTITVehicleData>
      <PlateNumber>${clean(data.vehiculo.matricula)}</PlateNumber>
      <SerialNumber>${clean(data.vehiculo.bastidor)}</SerialNumber>
      <VehicleKind>${clean(data.vehiculo.categoria) || '40'}</VehicleKind>
      <RealPower>${(parseFloat(clean(data.vehiculo.potencia)) || 0).toFixed(2).padStart(6, '0')}</RealPower>
      <CubicCapacity>${(parseFloat(clean(data.vehiculo.cilindrada)) || 0).toFixed(2).padStart(8, '0')}</CubicCapacity>
      <Cilinder>00</Cilinder>
      <ExpirationDateITV>${currentDate}</ExpirationDateITV>
      <VehiclePurpose>B00</VehiclePurpose>
      <VehiclePurposeChange>false</VehiclePurposeChange>
      <FirstMatriculationDate>${formatDate(data.vehiculo.fechaMatriculacion)}</FirstMatriculationDate>
      <MotiveITV>PERIODICAL</MotiveITV>
      <HasITV>false</HasITV>
      <Historical>false</Historical>
      <MMA>${(parseFloat(clean(data.vehiculo.masaMaxima)) || 1500).toString().padStart(6, '0')}</MMA>
      <SeatPlaces>${(parseInt(clean(data.vehiculo.plazasAsiento)) || 5).toString().padStart(3, '0')}</SeatPlaces>
      <Tara>${(parseFloat(clean(data.vehiculo.masaOrdenMarcha)) || 1200).toString().padStart(6, '0')}</Tara>
      <VehicleFuel>${getFuelCode(clean(data.vehiculo.combustible))}</VehicleFuel>
      <IsResidence>false</IsResidence>
    </CTITVehicleData>
    
    <CTITTaxData>
      <TaxType>ITP</TaxType>
      <ITPKey>SU</ITPKey>
      <FiscalModel>FORM620</FiscalModel>
      <TrasmissionMotive>CONTRACT</TrasmissionMotive>
      <IsDUA>false</IsDUA>
      <IsIVTM>false</IsIVTM>
      <IsAgriVehicle>false</IsAgriVehicle>
    </CTITTaxData>
    
    <VehicleOwnerSeller>
      <MainOwner>true</MainOwner>
      <OwnerType>PERSON</OwnerType>
      <FiscalId>${clean(data.vendedor.dni)}</FiscalId>
      <Gender>V</Gender>
      <Name>${vendedorName.name.toUpperCase()}</Name>
      <Surname>${vendedorName.surname.toUpperCase()}</Surname>
      <Surname2>${vendedorName.surname2.toUpperCase()}</Surname2>
      <BirthDate>${formatDate(data.vendedor.fechaNacimiento)}</BirthDate>
      <StreetName>${vendedorAddress.streetName}</StreetName>
      <StreetNumber>${vendedorAddress.streetNumber}</StreetNumber>
      <StreetType>${vendedorAddress.streetType}</StreetType>
      <BuildFloor>${vendedorAddress.buildFloor}</BuildFloor>
      <BuildDoor>${vendedorAddress.buildDoor}</BuildDoor>
      <Province>${vendedorZip.substring(0, 2)}</Province>
      <Municipality>${vendedorZip}00</Municipality>
      <ZipCode>${vendedorZip}</ZipCode>
      <Town></Town>
      <Freelance>false</Freelance>
    </VehicleOwnerSeller>
    
    <VehicleOwnerBuyer>
      <OwnerType>PERSON</OwnerType>
      <FiscalId>${clean(data.comprador.dni)}</FiscalId>
      <Gender>V</Gender>
      <Name>${compradorName.name.toUpperCase()}</Name>
      <Surname>${compradorName.surname.toUpperCase()}</Surname>
      <Surname2>${compradorName.surname2.toUpperCase()}</Surname2>
      <BirthDate>${formatDate(data.comprador.fechaNacimiento)}</BirthDate>
      <StreetName>${compradorAddress.streetName}</StreetName>
      <StreetNumber>${compradorAddress.streetNumber}</StreetNumber>
      <StreetType>${compradorAddress.streetType}</StreetType>
      <BuildFloor>${compradorAddress.buildFloor}</BuildFloor>
      <BuildDoor>${compradorAddress.buildDoor}</BuildDoor>
      <Province>${compradorZip.substring(0, 2)}</Province>
      <Municipality>${compradorZip}00</Municipality>
      <ZipCode>${compradorZip}</ZipCode>
      <Town></Town>
      <UpdateResidence>false</UpdateResidence>
    </VehicleOwnerBuyer>
  </CTIT>
</a9>`

  return xml
}
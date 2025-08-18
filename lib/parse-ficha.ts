import { VehicleData } from './types'

export function parseFichaData(ocrResult: any): VehicleData {
  return {
    // Datos básicos identificación
    marca: ocrResult.marca || '',
    modelo: ocrResult.modelo || '',
    denominacionComercial: ocrResult.denominacionComercial || '',
    matricula: ocrResult.matricula || '',
    bastidor: ocrResult.bastidor || '',
    fechaMatriculacion: ocrResult.fechaMatriculacion || '',
    procedencia: ocrResult.procedencia || '',
    
    // Categorización
    categoria: ocrResult.categoria || '',
    carroceria: ocrResult.carroceria || '',
    clase: ocrResult.clase || '',
    
    // Motor y prestaciones
    cilindrada: ocrResult.cilindrada || '',
    potencia: ocrResult.potencia || '',
    potenciaFiscal: ocrResult.potenciaFiscal || '',
    combustible: ocrResult.combustible || '',
    codigoMotor: ocrResult.codigoMotor || '',
    fabricanteMotor: ocrResult.fabricanteMotor || '',
    velocidadMaxima: ocrResult.velocidadMaxima || '',
    
    // Capacidades y plazas
    plazasAsiento: ocrResult.plazasAsiento || '',
    plazasPie: ocrResult.plazasPie || '',
    
    // Masas
    masaOrdenMarcha: ocrResult.masaOrdenMarcha || '',
    masaMaxima: ocrResult.masaMaxima || '',
    masaMaximaTecnica: ocrResult.masaMaximaTecnica || '',
    masaRemolcable: ocrResult.masaRemolcable || '',
    
    // Dimensiones
    longitud: ocrResult.longitud || '',
    anchura: ocrResult.anchura || '',
    altura: ocrResult.altura || '',
    
    // Ejes y neumáticos
    numeroEjes: ocrResult.numeroEjes || '',
    ejesMotrices: ocrResult.ejesMotrices || '',
    dimensionesNeumaticos: ocrResult.dimensionesNeumaticos || '',
    distanciaEjes: ocrResult.distanciaEjes || '',
    
    // Otros datos
    color: ocrResult.color || '',
    emisiones: ocrResult.emisiones || '',
    nivelEmisiones: ocrResult.nivelEmisiones || '',
    homologacion: ocrResult.homologacion || '',
    
    // Campos legacy para compatibilidad
    tipoVehiculo: ocrResult.tipoVehiculo || ocrResult.categoria || '',
    plazas: ocrResult.plazas || ocrResult.plazasAsiento || '',
    neumaticos: ocrResult.neumaticos || ocrResult.dimensionesNeumaticos || ''
  }
}

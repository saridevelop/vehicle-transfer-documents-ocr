import { VehicleData } from './types'

export function parseFichaData(ocrResult: any): VehicleData {
  return {
    marca: ocrResult.marca || '',
    modelo: ocrResult.modelo || '',
    matricula: ocrResult.matricula || '',
    bastidor: ocrResult.bastidor || '',
    fechaMatriculacion: ocrResult.fechaMatriculacion || '',
    tipoVehiculo: ocrResult.tipoVehiculo || '',
    potencia: ocrResult.potencia || '',
    cilindrada: ocrResult.cilindrada || '',
    plazas: ocrResult.plazas || '',
    neumaticos: ocrResult.neumaticos || '',
    categoria: ocrResult.categoria || '',
    masaMaxima: ocrResult.masaMaxima || ''
  }
}

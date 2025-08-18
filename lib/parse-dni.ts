import { PersonData } from './types'

export function parseDNIData(ocrResult: any): PersonData {
  return {
    nombre: ocrResult.nombre || '',
    dni: ocrResult.dni || '',
    fechaNacimiento: ocrResult.fechaNacimiento || '',
    direccion: ocrResult.direccion || '',
    poblacion: ocrResult.poblacion || '',
    fechaCaducidad: ocrResult.fechaCaducidad || ''
  }
}

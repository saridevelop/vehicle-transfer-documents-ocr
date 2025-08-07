export interface PersonData {
  nombre?: string
  dni?: string
  fechaNacimiento?: string
  direccion?: string
  fechaCaducidad?: string
}

export interface VehicleData {
  marca?: string
  modelo?: string
  matricula?: string
  bastidor?: string
  fechaMatriculacion?: string
  tipoVehiculo?: string
  potencia?: string
  cilindrada?: string
  plazas?: string
  neumaticos?: string
  categoria?: string
  masaMaxima?: string
}

export interface DocumentData {
  vendedor: PersonData
  comprador: PersonData
  vehiculo: VehicleData
}

export interface OCRResult {
  success: boolean
  data?: DocumentData
  error?: string
}

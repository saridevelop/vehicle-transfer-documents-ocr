export interface PersonData {
  nombre?: string
  dni?: string
  fechaNacimiento?: string
  direccion?: string
  poblacion?: string
  fechaCaducidad?: string
}

export interface VehicleData {
  // Datos básicos identificación
  marca?: string                    // D.1
  modelo?: string                   // D.2  
  denominacionComercial?: string    // D.3
  matricula?: string
  bastidor?: string                 // E
  fechaMatriculacion?: string
  procedencia?: string              // D.6
  
  // Categorización
  categoria?: string                // J
  carroceria?: string              // J.1
  clase?: string                   // J.2
  
  // Motor y prestaciones
  cilindrada?: string              // P.1
  potencia?: string                // P.2
  potenciaFiscal?: string          // P.2.1
  combustible?: string             // P.3
  codigoMotor?: string             // P.5
  fabricanteMotor?: string         // P.5.1
  velocidadMaxima?: string         // T
  
  // Capacidades y plazas
  plazasAsiento?: string           // S.1
  plazasPie?: string               // S.2
  
  // Masas
  masaOrdenMarcha?: string         // G
  masaMaxima?: string              // F.2
  masaMaximaTecnica?: string       // F.1
  masaRemolcable?: string          // O.1
  
  // Dimensiones
  longitud?: string                // F.6
  anchura?: string                 // F.5
  altura?: string                  // F.4
  
  // Ejes y neumáticos
  numeroEjes?: string              // L
  ejesMotrices?: string            // L.1
  dimensionesNeumaticos?: string   // L.2
  distanciaEjes?: string           // M.1
  
  // Otros datos
  color?: string                   // R
  emisiones?: string               // V.7
  nivelEmisiones?: string          // V.9
  homologacion?: string            // K
  
  // Campos legacy para compatibilidad
  tipoVehiculo?: string
  plazas?: string
  neumaticos?: string
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

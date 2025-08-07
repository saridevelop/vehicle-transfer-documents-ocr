import { PDFDocument, PDFForm } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import { DocumentData } from './types'

export async function fillMod02PDF(data: DocumentData): Promise<Uint8Array> {
  try {
    // Read the Mod.02-ES template
    const mod02Path = path.join(process.cwd(), 'public', 'contracts', 'Mod.02-ES.pdf')
    const existingPdfBytes = fs.readFileSync(mod02Path)
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const form = pdfDoc.getForm()
    
    // Fill the form fields with actual field names from the PDF
    try {
      // Matrícula del vehículo
      if (data.vehiculo.matricula) {
        const matriculaField = form.getTextField('Matrícula')
        matriculaField.setText(data.vehiculo.matricula)
      }

      // Fecha de matriculación
      if (data.vehiculo.fechaMatriculacion) {
        const fechaMatriculacionField = form.getTextField('Fecha matriculación')
        fechaMatriculacionField.setText(data.vehiculo.fechaMatriculacion)
      }

      // Datos del vendedor (propietario actual)
      if (data.vendedor.dni) {
        const vendedorDniField = form.getTextField('NIFNIECIF')
        vendedorDniField.setText(data.vendedor.dni)
      }
      
      if (data.vendedor.nombre) {
        // Dividir nombre en partes
        const nombreParts = data.vendedor.nombre.trim().split(' ')
        if (nombreParts.length >= 1) {
          const nombreField = form.getTextField('NombreRazón social')
          nombreField.setText(nombreParts[0])
        }
        if (nombreParts.length >= 2) {
          const apellido1Field = form.getTextField('Apellido 1')
          apellido1Field.setText(nombreParts[1])
        }
        if (nombreParts.length >= 3) {
          const apellido2Field = form.getTextField('Apellido 2')
          apellido2Field.setText(nombreParts.slice(2).join(' '))
        }
      }

      if (data.vendedor.fechaNacimiento) {
        const fechaNacimientoField = form.getTextField('Fecha nacimiento')
        fechaNacimientoField.setText(data.vendedor.fechaNacimiento)
      }

      // Datos del comprador (nuevo propietario)
      if (data.comprador.dni) {
        const compradorDniField = form.getTextField('NIFNIECIF_2')
        compradorDniField.setText(data.comprador.dni)
      }
      
      if (data.comprador.nombre) {
        // Dividir nombre en partes
        const nombreParts = data.comprador.nombre.trim().split(' ')
        if (nombreParts.length >= 1) {
          const nombreField = form.getTextField('NombreRazón social_2')
          nombreField.setText(nombreParts[0])
        }
        if (nombreParts.length >= 2) {
          const apellido1Field = form.getTextField('Apellido 1_2')
          apellido1Field.setText(nombreParts[1])
        }
        if (nombreParts.length >= 3) {
          const apellido2Field = form.getTextField('Apellido 2_2')
          apellido2Field.setText(nombreParts.slice(2).join(' '))
        }
      }

      // Dirección del comprador (si está disponible)
      if (data.comprador.direccion) {
        // Intentar parsear la dirección
        const direccionParts = data.comprador.direccion.split(',')
        if (direccionParts.length > 0) {
          // Asumir que el primer parte contiene la vía y número
          const viaYNumero = direccionParts[0].trim()
          const nombreViaField = form.getTextField('Nombre de la vía')
          nombreViaField.setText(viaYNumero)
        }
        if (direccionParts.length > 1) {
          // El último parte probablemente sea la localidad
          const localidadField = form.getTextField('Localidad')
          localidadField.setText(direccionParts[direccionParts.length - 1].trim())
        }
      }

      // Fecha actual para el trámite
      const fechaActual = new Date()
      const fechaFormateada = `${fechaActual.getDate().toString().padStart(2, '0')}/${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}/${fechaActual.getFullYear()}`
      
      const diaField = form.getTextField('a')
      const mesField = form.getTextField('de')
      const añoField = form.getTextField('de_2')
      
      diaField.setText(fechaActual.getDate().toString())
      mesField.setText((fechaActual.getMonth() + 1).toString())
      añoField.setText(fechaActual.getFullYear().toString())

      console.log('✅ Mod.02-ES PDF rellenado correctamente')
      
    } catch (fieldError) {
      console.log('⚠️ Algunos campos no se pudieron rellenar:', fieldError instanceof Error ? fieldError.message : fieldError)
    }
    
    // Serialize the PDF (don't flatten to allow manual editing)
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
    
  } catch (error) {
    console.error('❌ Error filling Mod.02-ES PDF:', error)
    throw new Error('Error al rellenar el formulario Mod.02-ES')
  }
}

import { PDFDocument, PDFForm } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import { DocumentData } from './types'

export async function fillContractPDF(data: DocumentData): Promise<Uint8Array> {
  try {
    // Read the contract template
    const contractPath = path.join(process.cwd(), 'public', 'contracts', 'contrato-tipo-compra-venta-vehiculos.pdf')
    const existingPdfBytes = fs.readFileSync(contractPath)
    
    // Load the PDF
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const form = pdfDoc.getForm()
    
    // Fill the form fields with the actual field names you found
    try {
      // Fecha actual
      const fechaActual = new Date()
      const dia = fechaActual.getDate().toString()
      const mes = fechaActual.toLocaleDateString('es-ES', { month: 'long' })
      const año = fechaActual.getFullYear().toString()
      
      // Campos de fecha
      if (form.getTextField('fecha_a')) {
        form.getTextField('fecha_a').setText(dia)
      }
      if (form.getTextField('fecha_de')) {
        form.getTextField('fecha_de').setText(mes)
      }
      if (form.getTextField('fecha_20_')) {
        form.getTextField('fecha_20_').setText(año)
      }
      if (form.getTextField('fecha_en')) {
        form.getTextField('fecha_en').setText('Madrid') // Ciudad por defecto, puedes cambiar
      }
      
      // Datos del vendedor
      if (data.vendedor.nombre && form.getTextField('vendedor_nombre_completo')) {
        form.getTextField('vendedor_nombre_completo').setText(data.vendedor.nombre)
      }
      
      if (data.vendedor.dni && form.getTextField('vendedor_nif')) {
        form.getTextField('vendedor_nif').setText(data.vendedor.dni)
      }
      
      if (data.vendedor.direccion) {
        if (form.getTextField('vendedor_domicilio')) {
          form.getTextField('vendedor_domicilio').setText(data.vendedor.direccion)
        }
        if (form.getTextField('vendedor_calle_de')) {
          // Extraer solo la calle de la dirección completa
          const calle = data.vendedor.direccion.split(',')[0] || data.vendedor.direccion
          form.getTextField('vendedor_calle_de').setText(calle)
        }
      }
      
      // Datos del comprador
      if (data.comprador.nombre && form.getTextField('comprador_nombre_completo')) {
        form.getTextField('comprador_nombre_completo').setText(data.comprador.nombre)
      }
      
      if (data.comprador.dni && form.getTextField('comprador_nif')) {
        form.getTextField('comprador_nif').setText(data.comprador.dni)
      }
      
      if (data.comprador.direccion) {
        if (form.getTextField('comprador_domicilio')) {
          form.getTextField('comprador_domicilio').setText(data.comprador.direccion)
        }
        if (form.getTextField('comprador_calle_de')) {
          // Extraer solo la calle de la dirección completa
          const calle = data.comprador.direccion.split(',')[0] || data.comprador.direccion
          form.getTextField('comprador_calle_de').setText(calle)
        }
      }
      
      // Datos del vehículo
      if (data.vehiculo.marca && form.getTextField('marca')) {
        form.getTextField('marca').setText(data.vehiculo.marca)
      }
      
      if (data.vehiculo.matricula && form.getTextField('matricula')) {
        form.getTextField('matricula').setText(data.vehiculo.matricula)
      }
      
      if (data.vehiculo.bastidor && form.getTextField('numero_bastidor')) {
        form.getTextField('numero_bastidor').setText(data.vehiculo.bastidor)
      }
      
      // Campo kilómetros - puedes dejarlo vacío para que lo rellenen manualmente
      // if (form.getTextField('kilometros')) {
      //   form.getTextField('kilometros').setText('______')
      // }
      
      console.log('✅ Contrato de compraventa rellenado correctamente con campos reales')
      
    } catch (fieldError) {
      console.log('⚠️ Algunos campos no se pudieron rellenar:', fieldError instanceof Error ? fieldError.message : fieldError)
    }
    
    // No hacer flatten para permitir edición manual posterior
    // form.flatten()
    
    // Serialize the PDF
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
    
  } catch (error) {
    console.error('❌ Error filling contract PDF:', error)
    throw new Error('Error al rellenar el contrato de compraventa')
  }
}

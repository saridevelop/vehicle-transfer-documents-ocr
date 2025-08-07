import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import { DocumentData } from './types'

export async function fillContractPDF(data: DocumentData): Promise<Uint8Array> {
  try {
    // Since the contract PDF has no form fields, we'll create a new PDF with the data
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595, 842]) // A4 size
    const { width, height } = page.getSize()
    
    // Load fonts
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)
    
    // Title
    page.drawText('CONTRATO DE COMPRAVENTA DE VEHÍCULO', {
      x: 50,
      y: height - 50,
      size: 18,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    
    // Subtitle
    page.drawText('Entre particulares', {
      x: 50,
      y: height - 80,
      size: 14,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    let currentY = height - 120
    const lineHeight = 20
    
    // Vendedor section
    page.drawText('DATOS DEL VENDEDOR:', {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight * 1.5
    
    page.drawText(`Nombre: ${data.vendedor.nombre || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`DNI/NIE: ${data.vendedor.dni || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`Fecha de nacimiento: ${data.vendedor.fechaNacimiento || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`Dirección: ${data.vendedor.direccion || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight * 2
    
    // Comprador section
    page.drawText('DATOS DEL COMPRADOR:', {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight * 1.5
    
    page.drawText(`Nombre: ${data.comprador.nombre || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`DNI/NIE: ${data.comprador.dni || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`Fecha de nacimiento: ${data.comprador.fechaNacimiento || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`Dirección: ${data.comprador.direccion || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight * 2
    
    // Vehicle section
    page.drawText('DATOS DEL VEHÍCULO:', {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight * 1.5
    
    page.drawText(`Marca: ${data.vehiculo.marca || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`Modelo: ${data.vehiculo.modelo || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`Matrícula: ${data.vehiculo.matricula || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`Número de bastidor: ${data.vehiculo.bastidor || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`Fecha de matriculación: ${data.vehiculo.fechaMatriculacion || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight
    
    page.drawText(`Tipo de vehículo: ${data.vehiculo.tipoVehiculo || '__________________'}`, {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight * 2
    
    // Contract text
    page.drawText('CONDICIONES DE LA VENTA:', {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight * 1.5
    
    const contractText = [
      'El vendedor declara ser el legítimo propietario del vehículo descrito',
      'y lo vende al comprador en las condiciones pactadas.',
      '',
      'El comprador acepta la compra del vehículo en el estado en que se encuentra,',
      'haciéndose responsable de los trámites de cambio de titularidad.',
      '',
      'Precio acordado: ______________ €',
      '',
      'Forma de pago: ______________',
    ]
    
    contractText.forEach(line => {
      page.drawText(line, {
        x: 50,
        y: currentY,
        size: 12,
        font: font,
        color: rgb(0, 0, 0),
      })
      currentY -= lineHeight
    })
    
    // Signatures
    currentY -= lineHeight
    page.drawText('FIRMAS:', {
      x: 50,
      y: currentY,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    })
    currentY -= lineHeight * 2
    
    page.drawText('Vendedor:', {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    page.drawText('Comprador:', {
      x: 350,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    currentY -= lineHeight * 3
    
    page.drawText('Firma: ________________', {
      x: 50,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    page.drawText('Firma: ________________', {
      x: 350,
      y: currentY,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    // Date
    const fechaActual = new Date().toLocaleDateString('es-ES')
    page.drawText(`Fecha: ${fechaActual}`, {
      x: 50,
      y: 50,
      size: 12,
      font: font,
      color: rgb(0, 0, 0),
    })
    
    console.log('✅ Contrato de compraventa generado correctamente')
    
    // Serialize the PDF
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
    
  } catch (error) {
    console.error('❌ Error generating contract PDF:', error)
    throw new Error('Error al generar el contrato de compraventa')
  }
}

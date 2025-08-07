import { PDFDocument } from 'pdf-lib'
import fs from 'fs'
import path from 'path'

/**
 * Utility function to inspect PDF form fields
 * This helps identify the correct field names for filling PDFs
 */
export async function inspectPDFFields(pdfFileName: string) {
  try {
    const pdfPath = path.join(process.cwd(), 'public', 'contracts', pdfFileName)
    const existingPdfBytes = fs.readFileSync(pdfPath)
    
    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const form = pdfDoc.getForm()
    const fields = form.getFields()
    
    console.log(`\n📋 Campos encontrados en ${pdfFileName}:`)
    console.log('=' + '='.repeat(50))
    
    fields.forEach((field, index) => {
      console.log(`${index + 1}. ${field.getName()} (${field.constructor.name})`)
    })
    
    console.log(`\nTotal de campos: ${fields.length}`)
    console.log('=' + '='.repeat(50))
    
    return fields.map(field => ({
      name: field.getName(),
      type: field.constructor.name
    }))
    
  } catch (error) {
    console.error(`Error inspeccionando ${pdfFileName}:`, error)
    return []
  }
}

/**
 * Function to run PDF inspection from command line
 * Usage: node -e "require('./lib/pdf-inspector.js').runInspection()"
 */
export async function runInspection() {
  console.log('🔍 Inspeccionando templates PDF...')
  
  await inspectPDFFields('contrato-tipo-compra-venta-vehiculos.pdf')
  await inspectPDFFields('Mod.02-ES.pdf')
  
  console.log('\n💡 Usa estos nombres de campos en fill-contract.ts y fill-mod02.ts')
  console.log('   Ejemplo: form.getTextField("nombre_del_campo").setText(valor)')
}

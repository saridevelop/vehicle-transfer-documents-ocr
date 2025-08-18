const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

async function inspectPDF(filename) {
  try {
    console.log(`\n📋 Inspeccionando ${filename}...`);
    console.log('='.repeat(50));
    
    const pdfPath = path.join(process.cwd(), 'public', 'contracts', filename);
    
    if (!fs.existsSync(pdfPath)) {
      console.log(`❌ Archivo no encontrado: ${pdfPath}`);
      return;
    }
    
    const existingPdfBytes = fs.readFileSync(pdfPath);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    
    console.log(`Total de campos encontrados: ${fields.length}`);
    
    if (fields.length === 0) {
      console.log('⚠️  No se encontraron campos de formulario en este PDF');
      console.log('   Esto significa que el PDF no es rellenable automáticamente');
      console.log('   Los PDFs necesitan tener campos de formulario definidos');
    } else {
      console.log('\nCampos disponibles:');
      fields.forEach((field, index) => {
        console.log(`${index + 1}. ${field.getName()} (${field.constructor.name})`);
      });
    }
    
  } catch (error) {
    console.error(`❌ Error inspeccionando ${filename}:`, error.message);
  }
}

async function main() {
  console.log('🔍 Inspeccionando templates PDF...\n');
  
//  await inspectPDF('contrato-tipo-compra-venta-vehiculos.pdf');
//  await inspectPDF('Mod.02-ES.pdf');
//  await inspectPDF('CONTRATO DE COMPRA-VENTA NUEVO.pdf');
  await inspectPDF('CONTRATO_DE_COMPRA-VENTA.pdf');

  console.log('\n💡 Si no hay campos, los PDFs son solo imágenes/texto.');
  console.log('   Necesitarías PDFs con campos de formulario para rellenar automáticamente.');
}

main().catch(console.error);

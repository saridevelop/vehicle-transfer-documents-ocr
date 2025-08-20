import { NextRequest, NextResponse } from 'next/server'
import { processImageWithOCR } from '@/lib/ocr'
import { parseDNIData } from '@/lib/parse-dni'
import { parseFichaData } from '@/lib/parse-ficha'

export async function POST(request: NextRequest) {
  let type = 'unknown'
  
  try {
    const formData = await request.formData()
    
    const file = formData.get('image') as File | null
    type = formData.get('type') as string
    
    if (!file) {
      return NextResponse.json(
        { error: 'No se proporcionó ninguna imagen' },
        { status: 400 }
      )
    }

    if (!type || !['vendedor', 'comprador', 'ficha'].includes(type)) {
      return NextResponse.json(
        { error: 'Tipo de documento inválido' },
        { status: 400 }
      )
    }

    console.log('============ INICIANDO PROCESAMIENTO ============')
    console.log(`Procesando documento tipo: ${type}`)
    console.log(`Nombre del archivo: ${file.name}`)
    console.log(`Tamaño del archivo: ${file.size} bytes`)
    console.log(`Tipo MIME: ${file.type}`)
    console.log('===============================================')
    
    const buffer = Buffer.from(await file.arrayBuffer())
    console.log(`Buffer creado, tamaño: ${buffer.length} bytes`)
    
    let result = {}
    
    try {
      let ocrResult
      if (type === 'ficha') {
        console.log('Llamando a processImageWithOCR para ficha técnica...')
        ocrResult = await processImageWithOCR(buffer, 'ficha')
        console.log('OCR completado para ficha, resultado:', ocrResult)
        
        console.log('Parseando datos de ficha...')
        result = parseFichaData(ocrResult)
      } else {
        console.log('Llamando a processImageWithOCR para DNI/NIE...')
        ocrResult = await processImageWithOCR(buffer, 'dni')
        console.log('OCR completado para DNI, resultado:', ocrResult)
        
        console.log('Parseando datos de DNI...')
        result = parseDNIData(ocrResult)
      }
      
      console.log(`============ PROCESAMIENTO EXITOSO ============`)
      console.log(`Tipo: ${type}`)
      console.log('Resultado final:', result)
      console.log('==============================================')
      
    } catch (ocrError: any) {
      console.error('============ ERROR EN PROCESAMIENTO OCR ============')
      console.error(`Error al procesar ${type}:`, ocrError)
      console.error('Mensaje:', ocrError?.message || 'Sin mensaje')
      console.error('Stack:', ocrError?.stack || 'Sin stack')
      console.error('================================================')
      throw ocrError
    }
    
    return NextResponse.json({ 
      type,
      data: result 
    })

  } catch (error: any) {
    console.error('============ ERROR GENERAL API ============')
    console.error('Error processing image:', error)
    console.error('Tipo de error:', typeof error)
    console.error('Mensaje:', error?.message || 'Sin mensaje')
    console.error('Stack:', error?.stack || 'Sin stack')
    console.error('==========================================')
    
    return NextResponse.json(
      { 
        error: 'Error al procesar la imagen',
        details: error?.message || 'Error desconocido',
        type: type
      },
      { status: 500 }
    )
  }
}
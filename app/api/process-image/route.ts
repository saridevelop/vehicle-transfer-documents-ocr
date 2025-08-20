import { NextRequest, NextResponse } from 'next/server'
import { processImageWithOCR } from '@/lib/ocr'
import { parseDNIData } from '@/lib/parse-dni'
import { parseFichaData } from '@/lib/parse-ficha'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const file = formData.get('image') as File | null
    const type = formData.get('type') as string
    
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

    console.log(`Processing ${type} document:`, file.name)
    
    const buffer = Buffer.from(await file.arrayBuffer())
    
    let result = {}
    
    if (type === 'ficha') {
      const ocrResult = await processImageWithOCR(buffer, 'ficha')
      result = parseFichaData(ocrResult)
    } else {
      const ocrResult = await processImageWithOCR(buffer, 'dni')
      result = parseDNIData(ocrResult)
    }

    console.log(`${type} processed successfully:`, result)
    
    return NextResponse.json({ 
      type,
      data: result 
    })

  } catch (error) {
    console.error('Error processing image:', error)
    return NextResponse.json(
      { error: 'Error al procesar la imagen' },
      { status: 500 }
    )
  }
}
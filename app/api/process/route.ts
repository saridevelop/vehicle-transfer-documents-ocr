import { NextRequest, NextResponse } from 'next/server'
import { processImageWithOCR } from '@/lib/ocr'
import { parseDNIData } from '@/lib/parse-dni'
import { parseFichaData } from '@/lib/parse-ficha'
import { DocumentData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const vendedorFile = formData.get('vendedor') as File | null
    const compradorFile = formData.get('comprador') as File | null
    const fichaFile = formData.get('ficha') as File | null

    console.log('Files received:', {
      vendedor: vendedorFile?.name || 'none',
      comprador: compradorFile?.name || 'none', 
      ficha: fichaFile?.name || 'none'
    })

    const result: DocumentData = {
      vendedor: {},
      comprador: {},
      vehiculo: {}
    }

    // Process vendedor document
    if (vendedorFile) {
      try {
        console.log('Processing vendedor document...')
        const vendedorBuffer = Buffer.from(await vendedorFile.arrayBuffer())
        const vendedorOCR = await processImageWithOCR(vendedorBuffer, 'dni')
        console.log('Vendedor OCR result:', vendedorOCR)
        result.vendedor = parseDNIData(vendedorOCR)
        console.log('Vendedor parsed data:', result.vendedor)
      } catch (error) {
        console.error('Error processing vendedor document:', error)
        // Continue with empty data instead of failing completely
      }
    }

    // Process comprador document
    if (compradorFile) {
      try {
        console.log('Processing comprador document...')
        const compradorBuffer = Buffer.from(await compradorFile.arrayBuffer())
        const compradorOCR = await processImageWithOCR(compradorBuffer, 'dni')
        console.log('Comprador OCR result:', compradorOCR)
        result.comprador = parseDNIData(compradorOCR)
        console.log('Comprador parsed data:', result.comprador)
      } catch (error) {
        console.error('Error processing comprador document:', error)
        // Continue with empty data instead of failing completely
      }
    }

    // Process ficha document
    if (fichaFile) {
      try {
        console.log('Processing ficha document...')
        const fichaBuffer = Buffer.from(await fichaFile.arrayBuffer())
        const fichaOCR = await processImageWithOCR(fichaBuffer, 'ficha')
        console.log('Ficha OCR result:', fichaOCR)
        result.vehiculo = parseFichaData(fichaOCR)
        console.log('Vehiculo parsed data:', result.vehiculo)
      } catch (error) {
        console.error('Error processing ficha document:', error)
        // Continue with empty data instead of failing completely
      }
    }

    console.log('Final result:', result)
    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in process API:', error)
    return NextResponse.json(
      { error: 'Error al procesar los documentos' },
      { status: 500 }
    )
  }
}

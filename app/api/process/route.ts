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

    const result: DocumentData = {
      vendedor: {},
      comprador: {},
      vehiculo: {}
    }

    // Process vendedor document
    if (vendedorFile) {
      try {
        const vendedorBuffer = Buffer.from(await vendedorFile.arrayBuffer())
        const vendedorOCR = await processImageWithOCR(vendedorBuffer, 'dni')
        result.vendedor = parseDNIData(vendedorOCR)
      } catch (error) {
        console.error('Error processing vendedor document:', error)
        // Continue with empty data instead of failing completely
      }
    }

    // Process comprador document
    if (compradorFile) {
      try {
        const compradorBuffer = Buffer.from(await compradorFile.arrayBuffer())
        const compradorOCR = await processImageWithOCR(compradorBuffer, 'dni')
        result.comprador = parseDNIData(compradorOCR)
      } catch (error) {
        console.error('Error processing comprador document:', error)
        // Continue with empty data instead of failing completely
      }
    }

    // Process ficha document
    if (fichaFile) {
      try {
        const fichaBuffer = Buffer.from(await fichaFile.arrayBuffer())
        const fichaOCR = await processImageWithOCR(fichaBuffer, 'ficha')
        result.vehiculo = parseFichaData(fichaOCR)
      } catch (error) {
        console.error('Error processing ficha document:', error)
        // Continue with empty data instead of failing completely
      }
    }

    return NextResponse.json(result)

  } catch (error) {
    console.error('Error in process API:', error)
    return NextResponse.json(
      { error: 'Error al procesar los documentos' },
      { status: 500 }
    )
  }
}

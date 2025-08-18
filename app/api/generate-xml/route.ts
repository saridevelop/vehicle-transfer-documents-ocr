import { NextRequest, NextResponse } from 'next/server'
import { generateDGTXML } from '@/lib/generate-xml'
import { DocumentData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { 
      data,
      options 
    }: { 
      data: DocumentData,
      options?: {
        agentNif?: string
        agencyNif?: string
        dgtLocalDivisionKey?: string
        customDossierNumber?: string
      }
    } = await request.json()

    // Generar el XML
    const xmlContent = generateDGTXML(data, options)
    
    // Crear nombre de archivo con timestamp
    const timestamp = new Date().toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '')
      .split('.')[0]
    const filename = `CTIT_${timestamp}.xml`

    // Retornar el XML como descarga
    return new NextResponse(xmlContent, {
      headers: {
        'Content-Type': 'application/xml',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('Error generating XML:', error)
    return NextResponse.json(
      { error: 'Error al generar el archivo XML' },
      { status: 500 }
    )
  }
}
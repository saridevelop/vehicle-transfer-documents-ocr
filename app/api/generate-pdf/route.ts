import { NextRequest, NextResponse } from 'next/server'
import { fillContractPDF } from '@/lib/fill-contract'
import { fillMod02PDF } from '@/lib/fill-mod02'
import { DocumentData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { data, type }: { data: DocumentData, type: 'contract' | 'mod02' } = await request.json()

    let pdfBuffer: Uint8Array
    let filename: string

    if (type === 'contract') {
      pdfBuffer = await fillContractPDF(data)
      filename = 'contrato-compraventa.pdf'
    } else if (type === 'mod02') {
      pdfBuffer = await fillMod02PDF(data)
      filename = 'mod-02-es.pdf'
    } else {
      return NextResponse.json(
        { error: 'Tipo de documento no válido' },
        { status: 400 }
      )
    }

    // Return the single PDF file
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`
      }
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Error al generar el documento PDF' },
      { status: 500 }
    )
  }
}

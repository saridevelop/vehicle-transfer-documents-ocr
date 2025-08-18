import { NextRequest, NextResponse } from 'next/server'
import { fillContractPDF, ContractType } from '@/lib/fill-contract'
import { fillMod02PDF } from '@/lib/fill-mod02'
import { DocumentData } from '@/lib/types'

export async function POST(request: NextRequest) {
  try {
    const { 
      data, 
      type, 
      contractType,
      preview 
    }: { 
      data: DocumentData, 
      type: 'contract' | 'mod02',
      contractType?: ContractType,
      preview?: boolean 
    } = await request.json()

    let pdfBuffer: Uint8Array
    let filename: string

    if (type === 'contract') {
      const selectedContractType = contractType || 'new'
      pdfBuffer = await fillContractPDF(data, selectedContractType)
      filename = selectedContractType === 'new' 
        ? 'contrato-compraventa-nuevo.pdf' 
        : 'contrato-compraventa.pdf'
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
    const headers: Record<string, string> = {
      'Content-Type': 'application/pdf'
    }
    
    // Si es preview, no forzar descarga
    if (!preview) {
      headers['Content-Disposition'] = `attachment; filename="${filename}"`
    }
    
    return new NextResponse(Buffer.from(pdfBuffer), {
      headers
    })

  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json(
      { error: 'Error al generar el documento PDF' },
      { status: 500 }
    )
  }
}

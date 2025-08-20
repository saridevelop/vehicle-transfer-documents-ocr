import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function processImageWithOCR(
  imageBuffer: Buffer,
  documentType: 'dni' | 'ficha'
): Promise<any> {
  try {
    console.log(`Starting OCR processing for ${documentType} document`)
    console.log(`Image buffer size: ${imageBuffer.length} bytes`)
    
    const base64Image = imageBuffer.toString('base64')
    const mimeType = 'image/jpeg' // Assuming JPEG, could be enhanced to detect actual type

    let prompt = ''
    if (documentType === 'dni') {
      prompt = `
        Analiza este documento de identidad español (DNI o NIE) y extrae la siguiente información en formato JSON:
        {
          "nombre": "nombre completo",
          "dni": "número de DNI/NIE",
          "fechaNacimiento": "fecha de nacimiento (DD/MM/AAAA)",
          "direccion": "dirección completa (calle, número, piso, puerta)",
          "poblacion": "ciudad/municipio y código postal",
          "fechaCaducidad": "fecha de caducidad (DD/MM/AAAA)"
        }
        
        INSTRUCCIONES ESPECÍFICAS:
        - Para DIRECCIÓN: incluye calle, número, piso, puerta si están visibles. Ejemplo: "C/ MAYOR 123, 2º A"
        - Para POBLACIÓN: incluye ciudad/municipio y código postal si están visibles. Ejemplo: "MADRID 28001"
        - Si la dirección aparece en una sola línea, sepárala en dirección (calle/número) y población (ciudad/CP)
        - Si algún campo no está visible o no se puede leer claramente, usa null para ese campo
        - Busca cuidadosamente la información de domicilio que puede aparecer en diferentes partes del documento
        
        Responde únicamente con el JSON, sin texto adicional.
      `
    } else if (documentType === 'ficha') {
      prompt = `
        Analiza esta ficha técnica de vehículo española (tarjeta ITV) y extrae la siguiente información en formato JSON:
        {
          "marca": "D.1 Marca del vehículo",
          "modelo": "D.2 Tipo/Variante/Versión",
          "denominacionComercial": "D.3 Denominación comercial del vehículo",
          "matricula": "número de matrícula del vehículo",
          "bastidor": "E Nº de identificación del vehículo (VIN/Bastidor)",
          "fechaMatriculacion": "fecha de primera matriculación",
          "categoria": "J Categoría del vehículo",
          "carroceria": "J.1 Carrocería del vehículo",
          "clase": "J.2 Clase",
          "cilindrada": "P.1 Cilindrada (en cm³)",
          "potencia": "P.2 Potencia de motor (en kW o CV)",
          "potenciaFiscal": "P.2.1 Potencia fiscal",
          "combustible": "P.3 Tipo de combustible o fuente de energía",
          "codigoMotor": "P.5 Código de identificación del motor",
          "fabricanteMotor": "P.5.1 Fabricante o marca del motor",
          "plazasAsiento": "S.1 Nº de plazas asiento",
          "plazasPie": "S.2 Nº de plazas de pie",
          "velocidadMaxima": "T Velocidad máxima",
          "masaOrdenMarcha": "G Masa en Orden de marcha (MOM)",
          "masaMaxima": "F.2 Masa Máxima en carga Admisible del Vehículo en circulación (MMA)",
          "masaMaximaTecnica": "F.1 Masa Máxima en carga Técnicamente Admisible (MMTA)",
          "dimensionesNeumaticos": "L.2 Dimensiones de los neumáticos",
          "numeroEjes": "L Nº de ejes y ruedas",
          "ejesMotrices": "L.1 Ejes motrices",
          "distanciaEjes": "M.1 Distancia entre ejes",
          "longitud": "F.6 Longitud total",
          "anchura": "F.5 Anchura total",
          "altura": "F.4 Altura total",
          "masaRemolcable": "O.1 Masa Remolcable con frenos",
          "color": "R Color",
          "emisiones": "V.7 Emisiones de CO2",
          "nivelEmisiones": "V.9 Nivel de emisiones",
          "homologacion": "K Nº de homologación del vehículo",
          "procedencia": "D.6 Procedencia"
        }
        
        INSTRUCCIONES ESPECÍFICAS:
        - Busca especialmente los campos D.1 (Marca), D.2 (Tipo/Variante/Versión), D.3 (Denominación comercial)
        - El campo E contiene el número de bastidor/VIN
        - Los campos F.1, F.2 se refieren a masas máximas
        - El campo G es la masa en orden de marcha
        - Los campos P.1, P.2, P.3 son datos del motor (cilindrada, potencia, combustible)
        - Los campos S.1, S.2 son datos de plazas
        - El campo J es la categoría del vehículo
        - El campo L.2 contiene las dimensiones de neumáticos
        - Si encuentras códigos de campo (como D.1, D.2, etc.), úsalos para identificar mejor los datos
        - Si algún campo no está visible o no se puede leer claramente, usa null para ese campo
        - Presta especial atención a los números precedidos por letras (como D.1, E, F.2, etc.)
        - Para fechas, usa formato DD/MM/AAAA si es posible
        - Para masas, incluye la unidad si está visible (kg)
        - Para potencia, incluye la unidad si está visible (kW o CV)
        
        Responde únicamente con el JSON, sin texto adicional.
      `
    }

    console.log('Sending request to OpenAI...')
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64Image}`,
              },
            },
          ],
        },
      ],
      max_tokens: 1000,
    })
    console.log('Received response from OpenAI')

    const content = response.choices[0]?.message?.content
    
    console.log('============ RESPUESTA DE OPENAI ============')
    console.log('Response completo:', response)
    console.log('Choices length:', response.choices?.length || 0)
    console.log('Respuesta raw de OpenAI:')
    console.log('Tipo:', typeof content)
    console.log('Longitud:', content?.length || 0)
    console.log('Contenido completo:')
    console.log(content)
    console.log('===========================================')
    
    if (!content) {
      throw new Error('No se recibió respuesta del OCR')
    }

    let jsonString = ''
    try {
      // Limpiar la respuesta de marcadores de código markdown si existen
      jsonString = content.trim()
      
      console.log('Iniciando limpieza de la respuesta...')
      console.log('String original (primeros 200 chars):', jsonString.substring(0, 200))
      
      // Remover ```json al inicio y ``` al final si existen
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '')
        console.log('Removido ```json del inicio')
      }
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '')
        console.log('Removido ``` del inicio')
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.replace(/\s*```$/, '')
        console.log('Removido ``` del final')
      }
      
      console.log('String después de limpieza (primeros 200 chars):', jsonString.substring(0, 200))
      console.log('String después de limpieza (últimos 200 chars):', jsonString.substring(Math.max(0, jsonString.length - 200)))
      
      console.log('Intentando parsear JSON...')
      const parsedResult = JSON.parse(jsonString)
      console.log('Parsed JSON result:', parsedResult)
      return parsedResult
    } catch (parseError: any) {
      console.error('============ ERROR DE PARSEO JSON ============')
      console.error('Respuesta original de OpenAI:')
      console.error('Tipo:', typeof content)
      console.error('Longitud:', content?.length || 0)
      console.error('Contenido completo:')
      console.error(content)
      console.error('============================================')
      console.error('JSON string después de limpieza:')
      console.error('Tipo:', typeof jsonString)
      console.error('Longitud:', jsonString?.length || 0)
      console.error('Contenido limpio:')
      console.error(jsonString)
      console.error('============================================')
      console.error('Error específico de JSON.parse:')
      console.error('Mensaje:', parseError?.message || 'Sin mensaje')
      console.error('Stack:', parseError?.stack || 'Sin stack')
      console.error('============================================')
      
      throw new Error(`Error al parsear la respuesta del OCR. Respuesta de OpenAI: "${content?.substring(0, 500)}${content?.length > 500 ? '...' : ''}"`)
    }
  } catch (error: any) {
    console.error('Error in OCR processing:', error)
    throw error
  }
}

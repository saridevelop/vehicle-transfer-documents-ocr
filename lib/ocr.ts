import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function processImageWithOCR(
  imageBuffer: Buffer,
  documentType: 'dni' | 'ficha'
): Promise<any> {
  try {
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
          "direccion": "dirección completa si está visible",
          "fechaCaducidad": "fecha de caducidad (DD/MM/AAAA)"
        }
        
        Si algún campo no está visible o no se puede leer claramente, usa null para ese campo.
        Responde únicamente con el JSON, sin texto adicional.
      `
    } else if (documentType === 'ficha') {
      prompt = `
        Analiza esta ficha técnica de vehículo española y extrae la siguiente información en formato JSON:
        {
          "marca": "marca del vehículo",
          "modelo": "modelo del vehículo",
          "matricula": "número de matrícula",
          "bastidor": "número de bastidor/VIN",
          "fechaMatriculacion": "fecha de matriculación",
          "tipoVehiculo": "tipo de vehículo (turismo, furgón, etc.)",
          "potencia": "potencia del motor",
          "cilindrada": "cilindrada",
          "plazas": "número de plazas",
          "neumaticos": "neumáticos homologados",
          "categoria": "categoría del vehículo",
          "masaMaxima": "masa máxima autorizada"
        }
        
        Si algún campo no está visible o no se puede leer claramente, usa null para ese campo.
        Responde únicamente con el JSON, sin texto adicional.
      `
    }

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

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No se recibió respuesta del OCR')
    }

    try {
      // Limpiar la respuesta de marcadores de código markdown si existen
      let jsonString = content.trim()
      
      // Remover ```json al inicio y ``` al final si existen
      if (jsonString.startsWith('```json')) {
        jsonString = jsonString.replace(/^```json\s*/, '')
      }
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```\s*/, '')
      }
      if (jsonString.endsWith('```')) {
        jsonString = jsonString.replace(/\s*```$/, '')
      }
      
      return JSON.parse(jsonString)
    } catch (parseError) {
      console.error('Error parsing OCR response:', content)
      throw new Error('Error al parsear la respuesta del OCR')
    }
  } catch (error) {
    console.error('Error in OCR processing:', error)
    throw error
  }
}

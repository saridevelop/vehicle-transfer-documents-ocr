# 🧠 Prompt para una App Web de Transferencia de Vehículos con OCR

## Objetivo

Construir una aplicación web que permita subir imágenes de documentos para completar automáticamente:

- El **contrato de compraventa** entre particulares
- El **modelo oficial DGT de cambio de titularidad (Mod.02-ES)**

La app usará **OCR basado en OpenAI GPT-4o Vision** para extraer información de:

1. DNI/NIE del vendedor
2. DNI/NIE del comprador
3. Ficha técnica del vehículo (ambas variantes)
4. Certificado de características técnicas del fabricante

---

## Tipos de documentos compatibles (y ejemplos proporcionados)

### 🧍‍♂️ Documento de identidad (DNI/NIE)

- Extraer:
  - Nombre completo
  - Número de DNI/NIE
  - Fecha de nacimiento
  - Dirección (en reverso del DNI si está disponible)
  - Fecha de caducidad del documento

- Formatos compatibles:
  - DNI electrónico español (anverso y reverso)
  - NIE con o sin chip
  - Escaneado de buena calidad o foto con buena luz

### 🚗 Ficha técnica del vehículo (verde o blanca)

- Extraer:
  - Marca
  - Modelo
  - Matrícula
  - Nº de bastidor (VIN)
  - Fecha de matriculación
  - Tipo de vehículo (furgón, turismo, etc.)
  - Potencia, cilindrada, plazas
  - Neumáticos homologados

- Formatos reconocidos:
  - Ficha técnica verde clásica
  - Ficha técnica tipo B con tabla (formato nuevo)

- Algunos campos pueden tener variantes según fabricante:
  - Campo **D.1**: marca
  - Campo **D.3**: modelo
  - Campo **E**: VIN (bastidor)
  - Campo **F.1, F.2, F.3**: masas máximas
  - Campo **J.1**: categoría del vehículo
  - Campo **P.x**: datos técnicos del motor
  - Campo **S.1**: número de plazas

---

## Flujo de la App

1. **Pantalla principal**:
   - Muestra visual del proceso (1. Subir → 2. Procesar → 3. Descargar/Compartir)

2. **Formulario de carga**:
   - Cajas de subida de imágenes para:
     - Documento del **vendedor**
     - Documento del **comprador**
     - **Ficha técnica**
   - Vista previa y posibilidad de editar datos extraídos

3. **Procesamiento OCR**:
   - Llama a OpenAI GPT-4o (API de vision) para interpretar texto e imágenes
   - Limpia y valida los campos: `dni`, `nombre`, `bastidor`, etc.

4. **Rellenado de PDFs**:
   - Usa `pdf-lib` para insertar los datos en:
     - `contrato-tipo-compra-venta-vehiculos.pdf`
     - `Mod.02-ES.pdf`

5. **Exportación**:
   - Descargar PDF
   - Compartir vía:
     - Web Share API (para WhatsApp, Telegram)
     - `mailto:` con enlace al PDF

---

## Arquitectura sugerida

/public/contracts/
contrato-tipo-compra-venta-vehiculos.pdf
Mod.02-ES.pdf

/lib/
ocr.ts ← Procesamiento de imágenes con GPT-4o
parse-dni.ts ← Extraer campos de documentos de identidad
parse-ficha.ts ← Extraer datos técnicos del vehículo
fill-contract.ts ← Rellenar contrato PDF
fill-mod02.ts ← Rellenar Mod.02-ES

/components/
UploadBox.tsx ← UI para subir imágenes
EditableForm.tsx ← Permitir corregir datos extraídos
PDFViewer.tsx ← Vista previa del PDF

/pages/api/
process.ts ← API route para OCR
generate-pdf.ts ← API route para PDF final


---

## Variables de entorno

```env
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_BASE_URL=https://tuapp.vercel.app

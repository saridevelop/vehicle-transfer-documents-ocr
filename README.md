# 🚗 Vehicle Transfer Documents OCR

Una aplicación web moderna que automatiza el llenado de documentos de transferencia de vehículos usando OCR (Reconocimiento Óptico de Caracteres) basado en OpenAI GPT-4 Vision.

## 🎯 Características

- **OCR Inteligente**: Extrae automáticamente información de documentos de identidad (DNI/NIE) y fichas técnicas de vehículos
- **Llenado Automático**: Completa automáticamente el contrato de compraventa y el formulario Mod.02-ES de la DGT
- **Interfaz Moderna**: UI intuitiva y responsive construida con React y Tailwind CSS
- **Exportación Múltiple**: Descarga los documentos en formato ZIP o comparte vía WhatsApp/Telegram

## 📋 Documentos Compatibles

### Documentos de Identidad
- DNI electrónico español (anverso y reverso)
- NIE con o sin chip
- Formatos: JPEG, PNG, GIF, BMP, WebP

### Fichas Técnicas de Vehículos
- Ficha técnica verde clásica
- Ficha técnica tipo B (formato nuevo)
- Extrae datos como marca, modelo, matrícula, bastidor, etc.

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 18 o superior
- Cuenta de OpenAI con acceso a GPT-4 Vision

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd vehicle-transfer-documents-ocr
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   
   Copia el archivo `.env.local` y configura las variables:
   ```env
   OPENAI_API_KEY=sk-your-openai-api-key-here
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. **Ejecutar en modo desarrollo**
   ```bash
   npm run dev
   ```

5. **Abrir en el navegador**
   
   Visita `http://localhost:3000`

## 🏗️ Arquitectura del Proyecto

```
├── app/                    # Next.js 13+ App Router
│   ├── api/               # API Routes
│   │   ├── process/       # OCR processing endpoint
│   │   └── generate-pdf/  # PDF generation endpoint
│   ├── globals.css        # Estilos globales
│   ├── layout.tsx         # Layout principal
│   └── page.tsx          # Página principal
├── components/            # Componentes React
│   ├── UploadBox.tsx     # Componente de carga de archivos
│   ├── EditableForm.tsx  # Formulario editable
│   └── ProcessingStep.tsx # Indicador de progreso
├── lib/                   # Utilidades y lógica de negocio
│   ├── ocr.ts            # Procesamiento OCR con OpenAI
│   ├── parse-dni.ts      # Parser para documentos DNI/NIE
│   ├── parse-ficha.ts    # Parser para fichas técnicas
│   ├── fill-contract.ts  # Llenado del contrato PDF
│   ├── fill-mod02.ts     # Llenado del Mod.02-ES PDF
│   └── types.ts          # Tipos TypeScript
└── public/
    └── contracts/         # Templates PDF
        ├── contrato-tipo-compra-venta-vehiculos.pdf
        └── Mod.02-ES.pdf
```

## 🔧 Tecnologías Utilizadas

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **OCR**: OpenAI GPT-4 Vision API
- **PDF Processing**: pdf-lib
- **File Upload**: react-dropzone
- **Icons**: Lucide React
- **Compression**: JSZip

## 🔄 Flujo de la Aplicación

1. **Carga de Documentos**: El usuario sube imágenes de DNI/NIE del vendedor, comprador y ficha técnica
2. **Procesamiento OCR**: OpenAI GPT-4 Vision extrae la información de las imágenes
3. **Validación y Edición**: El usuario puede revisar y corregir los datos extraídos
4. **Generación de PDFs**: La aplicación rellena automáticamente los templates PDF
5. **Descarga/Compartir**: Los documentos se descargan como ZIP o se comparten

## 🎨 Campos Extraídos

### Personas (Vendedor/Comprador)
- Nombre completo
- Número de DNI/NIE
- Fecha de nacimiento
- Dirección
- Fecha de caducidad del documento

### Vehículo
- Marca y modelo
- Matrícula
- Número de bastidor (VIN)
- Fecha de matriculación
- Tipo de vehículo
- Potencia y cilindrada
- Número de plazas
- Neumáticos homologados
- Categoría del vehículo
- Masa máxima autorizada

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en el dashboard
3. Despliega automáticamente

### Docker
```bash
# Construir imagen
docker build -t vehicle-transfer-ocr .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env.local vehicle-transfer-ocr
```

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## ⚠️ Disclaimer

Esta aplicación es una herramienta de ayuda para la generación de documentos. Los usuarios deben verificar siempre la exactitud de los datos antes de usar los documentos generados para transacciones oficiales.

## 🆘 Soporte

Si encuentras algún problema o tienes preguntas:

1. Revisa la documentación
2. Busca en los issues existentes
3. Crea un nuevo issue con detalles del problema

---

Desarrollado con ❤️ para simplificar las transferencias de vehículos en España.

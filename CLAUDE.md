# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on localhost:3000
- `npm run build` - Build production application  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run setup` - Initialize project environment and check PDF templates

### Environment Setup
- Copy `.env.local` and configure `OPENAI_API_KEY` with valid OpenAI API key
- Ensure PDF templates exist in `public/contracts/`:
  - `contrato-tipo-compra-venta-vehiculos.pdf`
  - `Mod.02-ES.pdf`

## Architecture Overview

This is a **Next.js 14 (App Router)** application that automates Spanish vehicle transfer document generation using **OpenAI GPT-4 Vision OCR**.

### Application Flow
1. **Document Upload**: Users upload images of DNI/NIE (seller/buyer) and vehicle registration documents
2. **OCR Processing**: OpenAI GPT-4 Vision extracts structured data from uploaded images
3. **Data Validation**: Users review and edit extracted information in an editable form
4. **PDF Generation**: System fills official PDF templates with validated data
5. **Export/Share**: Documents are downloadable as ZIP or shareable via encoded URLs

### Key Technical Components

#### API Routes (`app/api/`)
- `process/route.ts` - Main OCR processing endpoint, handles file uploads and coordinates data extraction
- `generate-pdf/route.ts` - PDF generation endpoint, fills templates with form data

#### Core Libraries (`lib/`)
- `ocr.ts` - OpenAI GPT-4 Vision integration with specialized prompts for Spanish documents
- `parse-dni.ts` - Parser for Spanish DNI/NIE identity documents
- `parse-ficha.ts` - Parser for vehicle registration documents (ficha técnica)
- `fill-contract.ts` - PDF form filling for purchase contracts
- `fill-mod02.ts` - PDF form filling for DGT Mod.02-ES forms
- `types.ts` - TypeScript interfaces for document data structures

#### Components (`components/`)
- `EditableForm.tsx` - Main data editing interface with debounced inputs and mobile optimization
- `UploadBox.tsx` - File upload component with camera/gallery selection for mobile
- `ProcessingStep.tsx` - Progress indicator component

### Data Structure
```typescript
interface DocumentData {
  vendedor: PersonData    // Seller information
  comprador: PersonData   // Buyer information  
  vehiculo: VehicleData   // Vehicle information
}
```

### Mobile-First Design
- Uses `useMobileInput` hook for optimal mobile keyboard handling
- Touch-optimized UI with proper button sizing (`touch-manipulation`)
- Camera/gallery selection modal for image capture
- Debounced form inputs to prevent focus loss during typing

### Error Handling
- Graceful degradation: if OCR fails for individual documents, processing continues with empty data
- Manual fallback: users can skip OCR and fill forms manually
- Debug mode available in development to inspect extracted data

### PDF Processing
- Uses `pdf-lib` for PDF form field manipulation
- Templates are pre-filled Spanish legal documents stored in `public/contracts/`
- Supports both contract generation and official DGT form completion

### State Management
- React state with URL-based data sharing (base64 encoded)
- Step-based wizard flow (upload → process → edit → export)
- Form state synchronized with parent via debounced callbacks

### Mobile Optimizations
- Viewport configuration prevents zoom on input focus
- Camera access with `capture="environment"` for rear camera
- Custom animation timings for smooth mobile interactions
- Input debouncing prevents keyboard dismissal during typing
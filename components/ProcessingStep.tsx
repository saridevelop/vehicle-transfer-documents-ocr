interface ProcessingStepProps {
  currentStep: number
}

export default function ProcessingStep({ currentStep }: ProcessingStepProps) {
  const steps = [
    { number: 1, title: 'Subir Documentos', description: 'Sube las imágenes de los documentos' },
    { number: 2, title: 'Procesar OCR', description: 'Extraemos la información automáticamente' },
    { number: 3, title: 'Revisar y Descargar', description: 'Revisa los datos y descarga los PDFs' }
  ]

  return (
    <div className="flex items-center justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
              currentStep >= step.number
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 text-gray-500'
            }`}>
              {currentStep > step.number ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span className="text-sm font-semibold">{step.number}</span>
              )}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${
                currentStep >= step.number ? 'text-blue-600' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
              <p className="text-xs text-gray-400">{step.description}</p>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-12 h-0.5 ml-4 ${
                currentStep > step.number ? 'bg-blue-600' : 'bg-gray-300'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

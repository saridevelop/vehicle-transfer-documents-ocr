import { Check } from 'lucide-react'

interface ProcessingStepProps {
  currentStep: number
}

export default function ProcessingStep({ currentStep }: ProcessingStepProps) {
  const steps = [
    { number: 1, title: 'Subir Documentos' },
    { number: 2, title: 'Procesar con OCR' },
    { number: 3, title: 'Revisar y Descargar' }
  ]

  return (
    <nav aria-label="Progreso">
      <ol role="list" className="flex items-center justify-center space-x-2 sm:space-x-4">
        {steps.map((step, index) => (
          <li key={step.title} className="flex-1">
            <div className="group flex w-full flex-col items-center">
              <div className="flex items-center w-full">
                <div className="flex-1 h-px bg-border" />
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors
                    ${currentStep > step.number
                      ? 'bg-primary border-primary text-primary-foreground'
                      : currentStep === step.number
                      ? 'border-primary text-primary'
                      : 'border-border bg-card text-muted-foreground'
                    }`}
                >
                  {currentStep > step.number ? (
                    <Check className="h-6 w-6" />
                  ) : (
                    <span className="text-sm font-bold">{step.number}</span>
                  )}
                </div>
                <div className="flex-1 h-px bg-border" />
              </div>
              <p
                className={`mt-2 text-center text-sm font-medium transition-colors
                  ${currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                  }`}
              >
                {step.title}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}

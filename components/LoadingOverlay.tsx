"use client"

import React from 'react'
import { Loader2 } from 'lucide-react'

interface LoadingOverlayProps {
  isLoading: boolean
  title?: string
  steps?: string[]
  currentStep?: number
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  title = 'Preparing your book...',
  steps = ['Uploading your PDF', 'Extracting the text', 'Indexing chapters', 'Warming up the voice'],
  currentStep = 0,
}) => {
  if (!isLoading) return null

  return (
    <div className="loading-wrapper" role="status" aria-live="polite">
      <div className="loading-shadow-wrapper">
        <div className="loading-shadow">
          <Loader2 className="loading-animation w-10 h-10" />
          <h3 className="loading-title">{title}</h3>
          <div className="loading-progress">
            {steps.map((step, index) => (
              <div key={step} className="loading-progress-item">
                <span
                  className={
                    index < currentStep
                      ? 'w-2 h-2 bg-[var(--success)] rounded-full'
                      : index === currentStep
                      ? 'loading-progress-status'
                      : 'w-2 h-2 bg-[var(--bg-secondary)] rounded-full'
                  }
                />
                <span
                  className={
                    index <= currentStep
                      ? 'text-[var(--text-primary)] font-medium'
                      : 'text-[var(--text-muted)]'
                  }
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoadingOverlay

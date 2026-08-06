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
  title = 'Processing your book...',
  steps = ['Uploading PDF', 'Extracting content', 'Generating synthesis', 'Preparing interview'],
  currentStep = 0,
}) => {
  if (!isLoading) return null

  return (
    <div className="loading-wrapper">
      <div className="loading-shadow-wrapper bg-white">
        <div className="loading-shadow">
          <Loader2 className="loading-animation w-12 h-12 text-[#663820]" />
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
                      : 'w-2 h-2 bg-gray-300 rounded-full'
                  }
                />
                <span
                  className={
                    index <= currentStep
                      ? 'text-[var(--text-primary)] font-medium'
                      : 'text-gray-400'
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

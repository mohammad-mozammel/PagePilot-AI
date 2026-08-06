"use client"

import React, { useCallback, useRef, useState } from 'react'
import { useForm, useWatch, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Upload, Image as ImageIcon, X, FileText, GripVertical } from 'lucide-react'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import LoadingOverlay from '@/components/LoadingOverlay'
import {
  voiceOptions,
  voiceCategories,
  DEFAULT_VOICE,
  MAX_FILE_SIZE,
  ACCEPTED_PDF_TYPES,
  MAX_IMAGE_SIZE,
  ACCEPTED_IMAGE_TYPES,
} from '@/lib/constants'
import { cn } from '@/lib/utils'

const formSchema = z.object({
  pdfFile: z
    .custom<File | null>()
    .refine((file) => file instanceof File, 'Please upload a PDF file')
    .refine(
      (file) => !file || file.size <= MAX_FILE_SIZE,
      'PDF file size must be less than 50MB'
    )
    .refine(
      (file) => !file || ACCEPTED_PDF_TYPES.includes(file.type),
      'Only PDF files are accepted'
    ),
  coverImage: z
    .custom<File | null>()
    .refine(
      (file) => file === null || file instanceof File,
      'Please upload a valid image file'
    )
    .refine(
      (file) => !file || file.size <= MAX_IMAGE_SIZE,
      'Cover image size must be less than 10MB'
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Only JPG, PNG, and WebP images are accepted'
    ),
  title: z
    .string()
    .trim()
    .min(2, 'Title must be at least 2 characters')
    .max(200, 'Title must be less than 200 characters'),
  author: z
    .string()
    .trim()
    .min(2, 'Author name must be at least 2 characters')
    .max(100, 'Author name must be less than 100 characters'),
  voice: z.enum(['dave', 'daniel', 'chris', 'rachel', 'sarah'], {
    message: 'Please select a valid voice',
  }),
})

type VoiceKey = 'dave' | 'daniel' | 'chris' | 'rachel' | 'sarah'

interface FormValues {
  pdfFile: File | null
  coverImage: File | null
  title: string
  author: string
  voice: VoiceKey
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

interface DropzoneProps {
  inputRef: React.RefObject<HTMLInputElement | null>
  file: File | null | undefined
  onFileSelect: (file: File) => void
  onFileRemove: () => void
  accept: string
  icon: React.ReactNode
  uploadedIcon: React.ReactNode
  emptyText: string
  emptyHint: string
  uploadedHint?: string
}

const Dropzone: React.FC<DropzoneProps> = ({
  inputRef,
  file,
  onFileSelect,
  onFileRemove,
  accept,
  icon,
  uploadedIcon,
  emptyText,
  emptyHint,
  uploadedHint = 'Click to change file',
}) => {
  const [isDragOver, setIsDragOver] = useState(false)

  const openFilePicker = () => inputRef.current?.click()

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      openFilePicker()
    }
  }

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
      const droppedFile = e.dataTransfer.files?.[0]
      if (droppedFile) onFileSelect(droppedFile)
    },
    [onFileSelect]
  )

  const handleRemoveClick = (e: React.MouseEvent | React.KeyboardEvent) => {
    e.stopPropagation()
    if ('key' in e) {
      if (e.key !== 'Enter' && e.key !== ' ') return
      e.preventDefault()
    }
    onFileRemove()
    if (inputRef.current) inputRef.current.value = ''
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFileSelect(f)
        }}
        className="hidden"
      />
      <div
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragOver={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (!isDragOver) setIsDragOver(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          e.stopPropagation()
          if (isDragOver) setIsDragOver(false)
        }}
        onDrop={handleDrop}
        role="button"
        tabIndex={0}
        aria-label={file ? `${uploadedHint}: ${file.name}` : emptyText}
        className={cn(
          'upload-dropzone border-2 border-dashed outline-none transition-all duration-200',
          file ? 'upload-dropzone-uploaded border-[#663820]/50' : 'border-[#8B7355]/40',
          isDragOver &&
          'scale-[1.01] border-[#663820] bg-[#fff6e5] shadow-soft-md',
          !file && !isDragOver && 'focus-visible:border-[#663820] focus-visible:ring-2 focus-visible:ring-[#663820]/20'
        )}
      >
        {file ? (
          <div className="flex flex-col items-center gap-2">
            {uploadedIcon}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-full px-2">
              <span className="upload-dropzone-text font-semibold truncate max-w-[220px] sm:max-w-xs">
                {file.name}
              </span>
              <span className="text-xs font-medium text-[#8B7355] bg-white/60 px-2 py-0.5 rounded-md">
                {formatFileSize(file.size)}
              </span>
              <span
                role="button"
                tabIndex={0}
                aria-label={`Remove ${file.name}`}
                onClick={handleRemoveClick}
                onKeyDown={handleRemoveClick}
                className="upload-dropzone-remove shrink-0"
              >
                <X className="w-5 h-5" />
              </span>
            </div>
            <span className="upload-dropzone-hint text-sm flex items-center gap-1">
              <GripVertical className="w-3 h-3 opacity-50" />
              {uploadedHint}
            </span>
          </div>
        ) : (
          <>
            {isDragOver ? (
              <GripVertical className="upload-dropzone-icon animate-bounce text-[#663820]" />
            ) : (
              icon
            )}
            <span className="upload-dropzone-text">
              {isDragOver ? 'Drop to upload' : emptyText}
            </span>
            <span className="upload-dropzone-hint">{emptyHint}</span>
          </>
        )}
      </div>
    </div>
  )
}

const UploadForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const coverInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema) as unknown as Resolver<FormValues>,
    defaultValues: {
      pdfFile: null,
      coverImage: null,
      title: '',
      author: '',
      voice: DEFAULT_VOICE as VoiceKey,
    },
    mode: 'onTouched',
  })

  const pdfFile = useWatch({ control: form.control, name: 'pdfFile' })
  const coverImage = useWatch({ control: form.control, name: 'coverImage' })

  const handlePdfSelect = useCallback(
    (file: File) => {
      form.setValue('pdfFile', file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    [form]
  )

  const handlePdfRemove = useCallback(() => {
    form.setValue('pdfFile', null, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [form])

  const handleCoverSelect = useCallback(
    (file: File) => {
      form.setValue('coverImage', file, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      })
    },
    [form]
  )

  const handleCoverRemove = useCallback(() => {
    form.setValue('coverImage', null, {
      shouldValidate: true,
      shouldDirty: true,
    })
  }, [form])

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      console.log('Form submitted:', values)
    } catch (error) {
      console.error('Submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderVoiceOption = (voiceKey: VoiceKey) => {
    const voice = voiceOptions[voiceKey as keyof typeof voiceOptions]
    return (
      <FormField
        key={voiceKey}
        control={form.control}
        name="voice"
        render={({ field }) => {
          const isSelected = field.value === voiceKey
          return (
            <label
              className={cn(
                'voice-selector-option flex-col sm:flex-col sm:items-start sm:justify-start text-left cursor-pointer select-none',
                isSelected && 'voice-selector-option-selected ring-1 ring-[#663820]/30',
                !isSelected && 'voice-selector-option-default'
              )}
            >
              <input
                type="radio"
                name={field.name}
                value={voiceKey}
                checked={isSelected}
                onChange={() => field.onChange(voiceKey)}
                onBlur={field.onBlur}
                ref={field.ref}
                className="sr-only"
              />
              <div className="flex items-center w-full sm:w-auto gap-2 mb-1">
                <span
                  className={cn(
                    'w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all duration-150 shrink-0',
                    isSelected
                      ? 'border-[#663820] bg-[#663820]/5'
                      : 'border-gray-300 bg-white'
                  )}
                >
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#663820] animate-in zoom-in-50 duration-150" />
                  )}
                </span>
                <span
                  className={cn(
                    'font-semibold text-base',
                    isSelected ? 'text-[#663820]' : 'text-[#212a3b]'
                  )}
                >
                  {voice.name}
                </span>
              </div>
              <span
                className={cn(
                  'text-xs sm:text-sm pl-6 sm:pl-0 leading-snug',
                  isSelected ? 'text-[#8B7355]' : 'text-[#3d485e]'
                )}
              >
                {voice.description}
              </span>
            </label>
          )
        }}
      />
    )
  }

  return (
    <>
      <LoadingOverlay isLoading={isSubmitting} title="Synthesizing your book..." />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="new-book-wrapper space-y-8"
          noValidate
        >
          <FormField
            control={form.control}
            name="pdfFile"
            render={() => (
              <FormItem>
                <FormLabel className="form-label">Upload Book PDF</FormLabel>
                <FormControl>
                  <Dropzone
                    inputRef={pdfInputRef}
                    file={pdfFile}
                    onFileSelect={handlePdfSelect}
                    onFileRemove={handlePdfRemove}
                    accept=".pdf,application/pdf"
                    icon={<Upload className="upload-dropzone-icon" />}
                    uploadedIcon={<FileText className="upload-dropzone-icon" />}
                    emptyText="Click or drag PDF here"
                    emptyHint="PDF file (max 50MB)"
                    uploadedHint="Click to change, or drop a new file"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="coverImage"
            render={() => (
              <FormItem>
                <FormLabel className="form-label">Upload Book Cover Image</FormLabel>
                <FormControl>
                  <Dropzone
                    inputRef={coverInputRef}
                    file={coverImage ?? null}
                    onFileSelect={handleCoverSelect}
                    onFileRemove={handleCoverRemove}
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    icon={<ImageIcon className="upload-dropzone-icon" />}
                    uploadedIcon={<ImageIcon className="upload-dropzone-icon" />}
                    emptyText="Click or drag image here"
                    emptyHint="Leave empty to auto-generate from PDF"
                    uploadedHint="Click to change, or drop a new image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Title</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="ex: Rich Dad Poor Dad"
                    className="form-input"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="form-label">Author Name</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="ex: Robert Kiyosaki"
                    className="form-input"
                    autoComplete="off"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel className="form-label">Choose Assistant Voice</FormLabel>
            <FormControl>
              <div className="space-y-6">
                <div>
                  <p className="text-base font-medium text-[#3d485e] mb-3 flex items-center gap-2">
                    <span className="inline-block w-1 h-1 rounded-full bg-[#663820]" />
                    Male Voices
                  </p>
                  <div className="voice-selector-options flex flex-col sm:flex-row">
                    {voiceCategories.male.map((vk) =>
                      renderVoiceOption(vk as VoiceKey)
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-base font-medium text-[#3d485e] mb-3 flex items-center gap-2">
                    <span className="inline-block w-1 h-1 rounded-full bg-[#663820]" />
                    Female Voices
                  </p>
                  <div className="voice-selector-options flex flex-col sm:flex-row">
                    {voiceCategories.female.map((vk) =>
                      renderVoiceOption(vk as VoiceKey)
                    )}
                  </div>
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>

          <button
            type="submit"
            className="form-btn disabled:opacity-70 disabled:cursor-not-allowed active:scale-[0.99]"
            disabled={isSubmitting || form.formState.isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Synthesizing...
              </span>
            ) : (
              'Begin Synthesis'
            )}
          </button>
        </form>
      </Form>
    </>
  )
}

export default UploadForm

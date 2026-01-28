'use client'

import { useEffect } from 'react'
import { RiCloseLine, RiArrowLeftLine, RiArrowRightSLine } from 'react-icons/ri'
import {
  FileWithPreview,
  getFileType,
  formatFileSize,
} from '@/shared/hooks/useFileUpload'

interface FilePreviewModalProps {
  file: FileWithPreview | null
  index: number
  total: number
  onClose: () => void
  onNext: () => void
  onPrevious: () => void
}

export function FilePreviewModal({
  file,
  index,
  total,
  onClose,
  onNext,
  onPrevious,
}: FilePreviewModalProps) {
  // Handle keyboard navigation
  useEffect(() => {
    if (!file) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrevious()
      if (e.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [file, onNext, onPrevious, onClose])

  if (!file) return null

  const fileType = getFileType(file)

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Preview de arquivo"
    >
      <div
        className="relative max-w-5xl max-h-[90vh] w-full mx-4"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
          aria-label="Fechar"
        >
          <RiCloseLine className="size-8" />
        </button>

        {/* Content */}
        <div className="bg-black rounded-lg overflow-hidden">
          {fileType === 'image' && file.preview && (
            <img
              src={file.preview}
              alt={file.name}
              className="max-h-[80vh] max-w-full object-contain mx-auto"
            />
          )}
          {fileType === 'video' && file.preview && (
            <video
              src={file.preview}
              controls
              className="max-h-[80vh] max-w-full mx-auto"
              autoPlay
            />
          )}
          {fileType === 'audio' && file.preview && (
            <div className="p-8 flex flex-col items-center justify-center">
              <audio
                src={file.preview}
                controls
                autoPlay
                className="w-full max-w-md"
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={onPrevious}
            className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
            aria-label="Arquivo anterior"
          >
            <RiArrowLeftLine className="size-8" />
            Anterior
          </button>
          <span className="text-white text-sm">
            {index + 1} / {total}
          </span>
          <button
            onClick={onNext}
            className="text-white hover:text-gray-300 transition-colors flex items-center gap-2"
            aria-label="Próximo arquivo"
          >
            Próximo
            <RiArrowRightSLine className="size-8" />
          </button>
        </div>

        {/* File info */}
        <div className="mt-2 text-center">
          <p className="text-white text-sm truncate">{file.name}</p>
          <p className="text-gray-400 text-xs">
            {formatFileSize(file.size)}
          </p>
        </div>
      </div>
    </div>
  )
}

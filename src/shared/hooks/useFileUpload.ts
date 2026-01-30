'use client'

import { useState, useCallback, useEffect } from 'react'
import { LIMITS } from '@/shared/constants/designTokens'

export type FileWithPreview = File & { preview?: string }

export type FileType = 'image' | 'video' | 'audio' | 'document'

interface UseFileUploadOptions {
  maxFiles?: number
  acceptedTypes?: string
}

export interface UseFileUploadReturn {
  files: FileWithPreview[]
  previewFile: FileWithPreview | null
  previewIndex: number
  canAddMore: boolean
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void
  removeFile: (index: number) => void
  openPreview: (file: FileWithPreview, index: number) => void
  closePreview: () => void
  nextPreview: () => void
  prevPreview: () => void
  clearAll: () => void
}

export function useFileUpload(
  options: UseFileUploadOptions = {}
): UseFileUploadReturn {
  const {
    maxFiles = LIMITS.MAX_FILE_COUNT,
    acceptedTypes = '.pdf,.png,.jpg,.jpeg,.webp,.mp3,.wav,.ogg,.mp4,.webm,.mov',
  } = options

  const [files, setFiles] = useState<FileWithPreview[]>([])
  const [previewFile, setPreviewFile] = useState<FileWithPreview | null>(null)
  const [previewIndex, setPreviewIndex] = useState(0)

  // Cleanup blob URLs when files change
  useEffect(() => {
    return () => {
      files.forEach(file => {
        if (file?.preview) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [files])

  const handleFileUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFiles = Array.from(e.target.files || [])

      // Filter by accepted types
      const validFiles = selectedFiles.filter(file => {
        const extension = '.' + file.name.split('.').pop()?.toLowerCase()
        return acceptedTypes.includes(extension)
      })

      if (files.length + validFiles.length > maxFiles) {
        alert(`Você pode enviar no máximo ${maxFiles} arquivos`)
        return
      }

      const filesWithPreview = validFiles.map(file => {
        const fileWithPreview = file as FileWithPreview
        if (
          file.type.startsWith('image/') ||
          file.type.startsWith('video/') ||
          file.type.startsWith('audio/')
        ) {
          fileWithPreview.preview = URL.createObjectURL(file)
        }
        return fileWithPreview
      })

      setFiles(prev => [...prev, ...filesWithPreview])
    },
    [files.length, maxFiles, acceptedTypes]
  )

  const removeFile = useCallback(
    (index: number) => {
      setFiles(prev => {
        const file = prev[index]
        if (file?.preview) {
          URL.revokeObjectURL(file.preview)
        }
        // Close preview if removing the currently viewed file
        if (file === previewFile) {
          setPreviewFile(null)
        }
        return prev.filter((_, i) => i !== index)
      })
    },
    [previewFile]
  )

  const openPreview = useCallback((file: FileWithPreview, index: number) => {
    setPreviewFile(file)
    setPreviewIndex(index)
  }, [])

  const closePreview = useCallback(() => {
    setPreviewFile(null)
  }, [])

  const nextPreview = useCallback(() => {
    const mediaFiles = files.filter(
      f =>
        f.type.startsWith('image/') ||
        f.type.startsWith('video/') ||
        f.type.startsWith('audio/')
    )
    const currentIndex = mediaFiles.findIndex(f => f === previewFile)
    const nextIndex = (currentIndex + 1) % mediaFiles.length
    setPreviewFile(mediaFiles[nextIndex] as FileWithPreview)
    setPreviewIndex(files.indexOf(mediaFiles[nextIndex] as FileWithPreview))
  }, [files, previewFile])

  const prevPreview = useCallback(() => {
    const mediaFiles = files.filter(
      f =>
        f.type.startsWith('image/') ||
        f.type.startsWith('video/') ||
        f.type.startsWith('audio/')
    )
    const currentIndex = mediaFiles.findIndex(f => f === previewFile)
    const prevIndex = (currentIndex - 1 + mediaFiles.length) % mediaFiles.length
    setPreviewFile(mediaFiles[prevIndex] as FileWithPreview)
    setPreviewIndex(files.indexOf(mediaFiles[prevIndex] as FileWithPreview))
  }, [files, previewFile])

  const clearAll = useCallback(() => {
    files.forEach(file => {
      if (file?.preview) {
        URL.revokeObjectURL(file.preview)
      }
    })
    setFiles([])
    setPreviewFile(null)
    setPreviewIndex(0)
  }, [files])

  const canAddMore = files.length < maxFiles

  return {
    files,
    previewFile,
    previewIndex,
    canAddMore,
    handleFileUpload,
    removeFile,
    openPreview,
    closePreview,
    nextPreview,
    prevPreview,
    clearAll,
  }
}

export function getFileType(file: File): FileType {
  if (!file?.type) return 'document'
  if (file.type.startsWith('image/')) return 'image'
  if (file.type.startsWith('video/')) return 'video'
  if (file.type.startsWith('audio/')) return 'audio'
  return 'document'
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}

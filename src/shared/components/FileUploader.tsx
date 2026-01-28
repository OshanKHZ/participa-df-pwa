'use client'

import { RiFileAddLine, RiMicLine, RiZoomInLine } from 'react-icons/ri'
import {
  useFileUpload,
  getFileType,
  type FileWithPreview,
  type UseFileUploadReturn,
} from '@/shared/hooks/useFileUpload'

interface FileUploaderProps {
  fileUpload?: UseFileUploadReturn
  acceptedTypes?: string
  maxFiles?: number
  onFilesChange?: (files: FileWithPreview[]) => void
  label?: string
  hint?: string
  className?: string
}

function PdfIcon() {
  return (
    <img
      src="https://upload.wikimedia.org/wikipedia/commons/8/87/PDF_file_icon.svg"
      alt="PDF"
      className="size-12"
    />
  )
}

function getFileIcon(file: File): React.ReactNode {
  if (!file?.type) return <span className="text-xl">📎</span>
  if (file.type.startsWith('image/')) return <span className="text-xl">🖼️</span>
  if (file.type.startsWith('video/')) return <span className="text-xl">🎥</span>
  if (file.type.startsWith('audio/')) return <span className="text-xl">🎵</span>
  if (file.type.includes('pdf')) return <PdfIcon />
  return <span className="text-xl">📎</span>
}

interface FileThumbnailProps {
  file: FileWithPreview
  fileType: ReturnType<typeof getFileType>
  thumbnail?: string
  isMedia: boolean
  onRemove: () => void
  onPreview?: () => void
}

function FileThumbnail({
  file,
  fileType,
  thumbnail,
  isMedia,
  onRemove,
  onPreview,
}: FileThumbnailProps) {
  return (
    <div className="border-2 border-border rounded-lg overflow-hidden">
      {/* Thumbnail */}
      <div
        className={`relative group aspect-video bg-muted ${isMedia && onPreview ? 'cursor-pointer' : ''}`}
        onClick={onPreview}
      >
        {thumbnail && isMedia ? (
          <>
            {fileType === 'image' && (
              <img
                src={thumbnail}
                alt={file.name}
                className="w-full h-full object-cover"
              />
            )}
            {fileType === 'video' && (
              <video
                src={thumbnail}
                className="w-full h-full object-cover"
              />
            )}
            {fileType === 'audio' && (
              <div className="w-full h-full flex items-center justify-center bg-accent">
                <RiMicLine className="size-6 text-muted-foreground" />
              </div>
            )}
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <RiZoomInLine className="size-6 text-white" />
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-accent p-2">
            <span className="text-2xl">{getFileIcon(file)}</span>
          </div>
        )}
      </div>

      {/* Info bar */}
      <div className="px-2 py-1.5 bg-card flex items-center justify-between gap-1">
        <span
          className="text-xs text-foreground truncate flex-1"
          title={file.name}
        >
          {file.name}
        </span>
        <button
          onClick={e => {
            e.stopPropagation()
            onRemove()
          }}
          className="text-destructive hover:text-destructive/80 ml-1 cursor-pointer btn-focus p-1 text-lg leading-none"
          aria-label={`Remover arquivo ${file.name}`}
        >
          ×
        </button>
      </div>
    </div>
  )
}

export function FileUploader({
  fileUpload: externalFileUpload,
  acceptedTypes = '.pdf,.png,.jpg,.jpeg,.webp,.mp3,.wav,.ogg,.mp4,.webm,.mov',
  maxFiles,
  label = 'Anexar arquivos',
  hint,
  className = '',
}: FileUploaderProps) {
  // Use external hook if provided, otherwise create internal one
  const {
    files,
    handleFileUpload,
    removeFile,
    openPreview,
    canAddMore,
  } = externalFileUpload || useFileUpload({ maxFiles, acceptedTypes })

  return (
    <div className={className}>
      <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      {canAddMore && (
        <label className="block">
          <div className="border-2 border-dashed border-border rounded-lg p-4 text-center cursor-pointer hover:bg-accent transition-colors">
            <RiFileAddLine className="w-8 h-8 text-muted-foreground mx-auto mb-1" />
            <p className="text-xs text-muted-foreground">
              Clique para selecionar {maxFiles && `(até ${maxFiles})`}
            </p>
          </div>
          <input
            type="file"
            multiple
            accept={acceptedTypes}
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      )}
      {hint && <p className="text-xs text-muted-foreground mt-2">{hint}</p>}
      {files.length > 0 && (
        <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
          {files.map((file: FileWithPreview, index: number) => {
            const fileType = getFileType(file)
            const isMedia =
              fileType === 'image' ||
              fileType === 'video' ||
              fileType === 'audio'
            const thumbnail = file.preview || undefined

            return (
              <FileThumbnail
                key={index}
                file={file}
                fileType={fileType}
                thumbnail={thumbnail}
                isMedia={isMedia}
                onRemove={() => removeFile(index)}
                onPreview={() => isMedia && openPreview(file, index)}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

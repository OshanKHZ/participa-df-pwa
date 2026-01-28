'use client'

import { RiMicLine, RiCloseLine } from 'react-icons/ri'
import { useAudioRecorder, formatTime, type UseAudioRecorderReturn } from '@/shared/hooks/useAudioRecorder'

interface AudioRecorderProps {
  audioRecorder?: UseAudioRecorderReturn
  maxAudios?: number
  maxDuration?: number
  compact?: boolean
  className?: string
}

export function AudioRecorder({
  audioRecorder: externalRecorder,
  maxAudios,
  maxDuration,
  compact = false,
  className = '',
}: AudioRecorderProps) {
  // Use external recorder if provided, otherwise create internal one
  const {
    isRecording,
    audioBlobs,
    recordingTime,
    canRecord,
    startRecording,
    stopRecording,
    deleteAudio,
  } = externalRecorder || useAudioRecorder({ maxAudios, maxDuration })

  return (
    <div className={className}>
      {!compact && (
        <p className="text-sm font-medium text-foreground mb-2">
          Gravar áudio
        </p>
      )}

      {canRecord && (
        <div className="flex items-center gap-2">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className={`flex items-center justify-center gap-2 py-2 bg-secondary text-white rounded-lg text-sm btn-focus ${
                compact ? 'flex-1' : 'px-4'
              }`}
              aria-label="Iniciar gravação"
            >
              <RiMicLine className="size-4" />
              {compact ? 'Gravar' : 'Gravar áudio'}
            </button>
          ) : (
            <>
              <span className="text-sm font-mono" aria-live="polite">
                {formatTime(recordingTime)}
              </span>
              <button
                onClick={stopRecording}
                className="px-3 py-2 bg-destructive text-white rounded-lg text-xs btn-focus"
                aria-label="Parar gravação"
              >
                Parar
              </button>
            </>
          )}
        </div>
      )}

      {audioBlobs.length > 0 && (
        <div className={`${compact ? 'mt-2' : 'mt-4'} space-y-2`}>
          {audioBlobs.map((blob, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-success/10 rounded p-2"
            >
              <audio
                controls
                className="flex-1 h-8"
                src={URL.createObjectURL(blob)}
              />
              <button
                onClick={() => deleteAudio(index)}
                className="text-destructive p-1 btn-focus rounded"
                aria-label={`Remover áudio ${index + 1}`}
              >
                <RiCloseLine className="size-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Export the hook return type for external use
export type { UseAudioRecorderReturn }

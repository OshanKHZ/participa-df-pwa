'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import { LIMITS, DURATION } from '@/shared/constants/designTokens'

interface UseAudioRecorderOptions {
  maxAudios?: number
  maxDuration?: number
}

export interface UseAudioRecorderReturn {
  isRecording: boolean
  audioBlobs: Blob[]
  recordingTime: number
  canRecord: boolean
  maxAudios: number
  startRecording: () => Promise<void>
  stopRecording: () => void
  deleteAudio: (index: number) => void
  clearAll: () => void
  restoreAudio: (audio: Blob) => void
}

export function useAudioRecorder(
  options: UseAudioRecorderOptions = {}
): UseAudioRecorderReturn {
  const {
    maxAudios = LIMITS.MAX_AUDIO_COUNT,
    maxDuration = LIMITS.MAX_AUDIO_DURATION_SECONDS,
  } = options

  const [isRecording, setIsRecording] = useState(false)
  const [audioBlobs, setAudioBlobs] = useState<Blob[]>([])
  const [recordingTime, setRecordingTime] = useState(0)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [])

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = e => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlobs(prev => [...prev, blob])
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration - 1) {
            stopRecording()
            return prev
          }
          return prev + 1
        })
      }, DURATION.TIMER_INTERVAL)
    } catch {
      alert('Erro ao acessar microfone. Verifique as permissões.')
    }
  }, [maxDuration])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setRecordingTime(0)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  const deleteAudio = useCallback((index: number) => {
    setAudioBlobs(prev => prev.filter((_, i) => i !== index))
  }, [])

  const clearAll = useCallback(() => {
    setAudioBlobs([])
    setRecordingTime(0)
    setIsRecording(false)
  }, [])

  const restoreAudio = useCallback((audio: Blob) => {
    setAudioBlobs([audio])
  }, [])

  const canRecord = audioBlobs.length < maxAudios

  return {
    isRecording,
    audioBlobs,
    recordingTime,
    canRecord,
    maxAudios,
    startRecording,
    stopRecording,
    deleteAudio,
    clearAll,
    restoreAudio,
  }
}

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

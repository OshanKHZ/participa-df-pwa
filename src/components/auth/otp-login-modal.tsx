'use client'

import { useState, useEffect } from 'react'
import { RiCloseLine, RiLoader4Line, RiMailSendLine } from 'react-icons/ri'
import { verifyOtp, sendOtp } from '@/app/actions/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/shared/components/Button'

interface OtpModalProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export function OtpModal({ isOpen, onClose, email }: OtpModalProps) {
  const [code, setCode] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resending, setResending] = useState(false)
  const router = useRouter()

  const [success, setSuccess] = useState(false)
  const [userName, setUserName] = useState('')
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds

  // Timer logic
  useEffect(() => {
    if (!isOpen || success || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [isOpen, success, timeLeft])

  // Reset timer when modal closes and reopen (handled by initial state usually, but let's be safe)
  useEffect(() => {
    if (isOpen && !success) {
      setTimeLeft(15 * 60)
      document.getElementById('otp-0')?.focus()
    }
  }, [isOpen, success])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleChange = (index: number, value: string) => {
    // If value is more than 1 char, it might be a paste or auto-fill
    if (value.length > 1) {
      const pastedData = value.slice(0, 6).split('')
      const newCode = [...code]
      pastedData.forEach((char, i) => {
        if (index + i < 6) newCode[index + i] = char
      })
      setCode(newCode)

      // Focus the next empty input or the last one
      const nextIndex = Math.min(index + pastedData.length, 5)
      document.getElementById(`otp-${nextIndex}`)?.focus()

      // Auto-submit if full code is now present
      if (newCode.every(c => c !== '')) {
        handleVerify(newCode)
      }
      return
    }

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-advance
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    } else if (value && index === 5) {
      // Auto-submit ONLY when the last digit is entered
      handleVerify(newCode)
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    } else if (e.key === 'ArrowLeft' && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    } else if (e.key === 'ArrowRight' && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6).split('')
    if (pastedData.length > 0) {
      const newCode = [...code]
      pastedData.forEach((char, i) => {
        if (i < 6) newCode[i] = char
      })
      setCode(newCode)
      // Focus last filled or next empty
      const focusIdx = Math.min(pastedData.length, 5)
      document.getElementById(`otp-${focusIdx}`)?.focus()
    }
  }

  const handleVerify = async (codeToVerify?: string[]) => {
    const codeToProcess = codeToVerify || code
    const fullCode = codeToProcess.join('')
    if (fullCode.length !== 6) {
      if (codeToVerify) return // Don't show toast on auto-submit attempts if incomplete
      toast.error('Digite o código completo de 6 dígitos.')
      return
    }

    setLoading(true)
    try {
      const result = await verifyOtp(email, fullCode)
      if (result.success) {
        toast.success('Login realizado com sucesso!')
        setSuccess(true)
        if (result.user?.name) {
          setUserName(result.user.name)
        }
        router.refresh()
        // Modal remains open showing success state
      } else {
        toast.error(result.error || 'Código inválido.')
      }
    } catch {
      toast.error('Erro ao verificar código.')
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResending(true)
    try {
      const result = await sendOtp(email)
      if (result.success) {
        toast.success('Novo código enviado!')
        setCode(['', '', '', '', '', '']) // Clear code on resend
        setTimeLeft(15 * 60) // Reset timer
        document.getElementById('otp-0')?.focus()
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Erro ao reenviar código.')
    } finally {
      setResending(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-[20px] shadow-xl w-full max-w-md p-8 relative animate-in zoom-in-95 duration-200">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-900 transition-colors"
          disabled={loading}
        >
          <RiCloseLine className="size-6" />
        </button>

        {success ? (
          <div className="text-center py-8">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-in zoom-in duration-300">
              <svg
                className="w-10 h-10 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">
              Login realizado com sucesso!
            </h2>
            <p className="text-zinc-500 mb-8">
              Bem-vindo de volta{userName ? `, ${userName}` : ''}.
              <br />
              Você já pode continuar navegando.
            </p>
            <Button
              variant="secondary"
              onClick={() => {
                onClose()
                window.location.reload()
              }}
              className="w-full"
              size="lg"
            >
              Continuar
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-accent rounded-full flex items-center justify-center mb-6">
                <RiMailSendLine className="size-8 text-secondary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Verifique seu email
              </h2>
              <p className="text-muted-foreground">
                Enviamos um código de 6 dígitos para <br />
                <span className="font-semibold text-foreground">{email}</span>
              </p>
              <div
                className={`mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  timeLeft === 0
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-secondary/10 text-secondary'
                }`}
              >
                {timeLeft === 0
                  ? 'Código expirado'
                  : `Expira em ${formatTime(timeLeft)}`}
              </div>
            </div>

            <div className="flex justify-center gap-2 mb-8">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={6} // Allow longer for paste/autofill handling in handleChange
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  onPaste={idx === 0 ? handlePaste : undefined}
                  autoComplete={idx === 0 ? 'one-time-code' : 'off'}
                  onFocus={e => e.target.select()}
                  aria-label={`Dígito ${idx + 1} do código de verificação`}
                  className="w-11 h-14 text-center text-2xl font-bold rounded-lg border border-input bg-background focus:ring-2 focus:ring-secondary focus:border-secondary outline-none transition-all disabled:opacity-50 text-foreground placeholder:text-muted-foreground"
                  disabled={loading}
                />
              ))}
            </div>

            <div className="space-y-6">
              <Button
                onClick={() => handleVerify()}
                disabled={loading || code.some(c => !c) || timeLeft === 0}
                variant="secondary"
                className="w-full"
                size="lg"
              >
                {loading ? (
                  <>
                    <RiLoader4Line className="size-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar código'
                )}
              </Button>

              <div className="text-center">
                <Button
                  onClick={handleResend}
                  disabled={resending || loading}
                  variant="link"
                  className="text-sm font-medium text-secondary hover:underline underline-offset-4 transition-colors disabled:opacity-50 h-auto p-0"
                >
                  {resending ? 'Enviando...' : 'Reenviar código'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

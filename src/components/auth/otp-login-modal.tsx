'use client'

import { useState, useEffect } from 'react'
import { RiCloseLine, RiLoader4Line, RiMailSendLine } from 'react-icons/ri'
import { verifyOtp, sendOtp } from '@/app/actions/auth'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

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

  // Focus first input on open
  useEffect(() => {
    if (isOpen && !success) {
      document.getElementById('otp-0')?.focus()
    }
  }, [isOpen, success])

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return // Prevent multiple chars

    const newCode = [...code]
    newCode[index] = value
    setCode(newCode)

    // Auto-advance
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerify = async () => {
    const fullCode = code.join('')
    if (fullCode.length !== 6) {
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

  // Auto-submit when all fields filled
  useEffect(() => {
    if (code.every(c => c !== '') && !success) {
      handleVerify()
    }
  }, [code, success])

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
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-colors shadow-md shadow-blue-600/10"
            >
              Continuar
            </button>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6">
                <RiMailSendLine className="size-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-blue-950 mb-2">
                Verifique seu email
              </h2>
              <p className="text-zinc-500">
                Enviamos um código de 6 dígitos para <br />
                <span className="font-semibold text-zinc-900">{email}</span>
              </p>
            </div>

            <div className="flex justify-center gap-3 mb-8">
              {code.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(idx, e.target.value)}
                  onKeyDown={e => handleKeyDown(idx, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-lg border border-zinc-200 bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 outline-none transition-all disabled:opacity-50 text-zinc-900 placeholder:text-zinc-300"
                  disabled={loading}
                />
              ))}
            </div>

            <div className="space-y-6">
              <button
                onClick={handleVerify}
                disabled={loading || code.some(c => !c)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-blue-600/10"
              >
                {loading ? (
                  <>
                    <RiLoader4Line className="size-5 animate-spin" />
                    Verificando...
                  </>
                ) : (
                  'Verificar código'
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleResend}
                  disabled={resending || loading}
                  className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline underline-offset-4 transition-colors disabled:opacity-50"
                >
                  {resending ? 'Enviando...' : 'Reenviar código'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

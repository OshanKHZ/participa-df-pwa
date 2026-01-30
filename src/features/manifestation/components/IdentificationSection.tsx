'use client'

import { useState, useEffect } from 'react'

import {
  RiEye2Line,
  RiEyeCloseLine,
  RiPhoneLine,
  RiCheckLine,
} from 'react-icons/ri'
import { TOGGLE } from '@/shared/constants/designTokens'
import { sendOtp, logout, getSessionData } from '@/app/actions/auth'
import { RiMailLine } from 'react-icons/ri'
import { Button } from '@/shared/components/Button'
import { OtpModal } from '@/components/auth/otp-login-modal'

interface IdentificationSectionProps {
  isAnonymous: boolean
  onAnonymousChange: (value: boolean) => void
  onFormDataChange: (data: {
    name: string
    email: string
    phone: string
  }) => void
  onAnonymousConsentChange?: (hasConsent: boolean) => void
  formData: {
    name: string
    email: string
    phone: string
  }
  allowAnonymous?: boolean
  requiresIdentification?: boolean
}

export function IdentificationSection({
  isAnonymous,
  onAnonymousChange,
  onFormDataChange,
  onAnonymousConsentChange,
  formData,
  allowAnonymous = true,
  requiresIdentification = false,
}: IdentificationSectionProps) {
  const [session, setSession] = useState<{
    user?: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  } | null>(null)

  useEffect(() => {
    getSessionData().then(user => {
      if (user) setSession({ user })
    })
  }, [])

  const [anonymousConsent, setAnonymousConsent] = useState(false)

  // OTP State
  const [authEmail, setAuthEmail] = useState('')
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Load saved data on mount

  // Update parent when form data changes
  // Update parent when session changes or visibility changes
  useEffect(() => {
    // We only update if session exists and user is not anonymous
    // This populates the name/email fields from session
    if (!isAnonymous && session?.user) {
      onFormDataChange({
        name: session.user.name || '',
        email: session.user.email || '',
        phone: formData.phone,
      })
    }
    // We only want to run this when session loads or anonymity mode changes,
    // NOT when formData changes (to avoid loops)
  }, [session, isAnonymous, onFormDataChange])

  // Update parent when consent changes
  useEffect(() => {
    if (onAnonymousConsentChange) {
      onAnonymousConsentChange(anonymousConsent)
    }
  }, [anonymousConsent, onAnonymousConsentChange])

  const handleInputChange = (field: string, value: string) => {
    onFormDataChange({ ...formData, [field]: value })
  }

  const handleSendOtp = async () => {
    if (!authEmail) {
      setError('Por favor, informe seu e-mail')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const result = await sendOtp(authEmail)
      if (result.success) {
        setIsOtpModalOpen(true)
      } else {
        setError(result.error || 'Erro ao enviar código.')
      }
    } catch (err) {
      setError('Erro ao enviar código. Tente novamente.')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
    window.location.reload()
  }

  return (
    <>
      {/* Anonymous Toggle - Only show if anonymous is allowed and identification is not mandatory */}
      {allowAnonymous && !requiresIdentification && (
        <div className="bg-card rounded-sm p-4 card-border mb-6">
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
          {isAnonymous ? (
            <RiEyeCloseLine className="size-6 text-secondary flex-shrink-0" />
          ) : (
            <RiEye2Line className="size-6 text-secondary flex-shrink-0" />
          )}
          <div>
            <h3 className="font-semibold text-foreground">
              {isAnonymous
                ? 'Prosseguir sem identificação'
                : 'Prefiro me identificar'}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isAnonymous
                ? 'Sua identidade será mantida em sigilo'
                : 'Seus dados pessoais estarão seguros'}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onAnonymousChange(!isAnonymous)}
            role="switch"
            aria-checked={isAnonymous}
            aria-label={
              isAnonymous ? 'Desativar anonimato' : 'Ativar anonimato'
            }
            className={`relative flex-shrink-0 inline-flex h-6 w-11 items-center rounded-full transition-colors btn-focus ${
              isAnonymous ? 'bg-secondary' : 'bg-muted'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                isAnonymous ? TOGGLE.TRANSITION_ON : TOGGLE.TRANSITION_OFF
              }`}
            />
          </button>
          </div>
        </div>
      )}

      {/* Anonymous Consent */}
      {isAnonymous && (
        <div className="space-y-4">
          {/* Legal Info Box with Checkbox */}
          <div className="flex items-start gap-3 bg-accent rounded-sm p-4">
            <button
              type="button"
              role="checkbox"
              aria-checked={anonymousConsent}
              onClick={() => setAnonymousConsent(!anonymousConsent)}
              className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded border-2 flex items-center justify-center transition-colors btn-focus ${
                anonymousConsent
                  ? 'bg-secondary border-secondary'
                  : 'bg-white border-gray-400'
              }`}
            >
              {anonymousConsent && (
                <RiCheckLine className="size-4 text-white" aria-hidden="true" />
              )}
            </button>
            <button
              type="button"
              className="flex-1 text-left p-0 btn-focus"
              onClick={() => setAnonymousConsent(!anonymousConsent)}
              aria-label="Aceitar termos de anonimato"
            >
              <p className="text-xs text-accent-foreground leading-relaxed">
                <span className="text-destructive">*</span> Solicito que minha
                identidade seja preservada neste pedido, em atendimento ao
                princípio constitucional da impessoalidade e, ainda, conforme o
                disposto no art. 11, § 7º da Lei Distrital nº 6.519/2020.
              </p>
              <p className="text-xs text-accent-foreground leading-relaxed mt-2">
                Estou ciente de que, com a identidade preservada, somente a
                Controladoria-Geral do Distrito Federal terá acesso aos meus
                dados pessoais, ressalvadas as exceções previstas nos parágrafos
                3º e 4º, do art. 33 da Lei Distrital nº 4.990/2012.
              </p>
              <p className="text-xs text-accent-foreground leading-relaxed mt-2 font-bold">
                Estou ciente, também, de que o órgão destinatário não poderá
                solicitar esclarecimentos adicionais, assim como não poderá
                atender a pedidos de informação pessoal, uma vez que não terá
                como confirmar minha identidade.
              </p>
            </button>
          </div>
        </div>
      )}

      {/* Personal Data Section */}
      {!isAnonymous && (
        <div className="space-y-4">
          {/* Logged in user */}
          {session?.user ? (
            <div className="bg-card rounded-lg p-4 card-border">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {session.user.image && (
                    <img
                      src={session.user.image}
                      alt={session.user.name || 'Avatar'}
                      className="w-12 h-12 rounded-full"
                    />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-xs text-destructive hover:underline btn-focus"
                >
                  Sair
                </button>
              </div>

              <p className="text-xs text-muted-foreground mb-3">
                Seus dados serão usados na manifestação. Edite o telefone se
                necessário:
              </p>

              <div>
                <label
                  htmlFor="logged-phone"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Telefone (opcional)
                </label>
                <div className="relative">
                  <RiPhoneLine className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
                  <input
                    id="logged-phone"
                    type="tel"
                    value={formData.phone}
                    onChange={e => handleInputChange('phone', e.target.value)}
                    placeholder="(00) 00000-0000"
                    autoComplete="tel"
                    className="w-full pl-10 pr-4 py-3 border card-border rounded-lg btn-focus"
                  />
                </div>
              </div>
            </div>
          ) : (
            /* Not logged in - show login/register with OTP */
            <div className="space-y-4 pt-1">
              <div className="bg-muted/30 p-4 rounded-lg border border-border">
                <h4 className="text-sm font-semibold text-foreground mb-4">
                  Identifique-se para continuar
                </h4>

                {error && (
                  <div className="bg-destructive/10 text-destructive text-xs p-3 rounded-md mb-4">
                    {error}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label
                      htmlFor="auth-email"
                      className="text-xs text-muted-foreground mb-1 block"
                    >
                      E-mail
                    </label>
                    <div className="relative">
                      <RiMailLine
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                        aria-hidden="true"
                      />
                      <input
                        id="auth-email"
                        type="email"
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="seu@email.com"
                        autoComplete="email"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={handleSendOtp}
                    disabled={isLoading}
                    variant="secondary"
                    className="w-full"
                  >
                    {isLoading ? 'Enviando...' : 'Entrar com E-mail'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      <OtpModal
        isOpen={isOtpModalOpen}
        onClose={() => setIsOtpModalOpen(false)}
        email={authEmail}
      />
    </>
  )
}
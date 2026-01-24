'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { RiMailLine, RiUserLine, RiGoogleFill, RiCheckLine, RiErrorWarningLine } from 'react-icons/ri'
import { signIn } from 'next-auth/react'

const SPACING = {
  form: 'space-y-5',
  inputGroup: 'space-y-2',
  divider: 'mt-6 mb-4',
  footer: 'mt-6',
}

const BUTTON = {
  primary: 'w-full bg-secondary hover:bg-secondary-hover text-secondary-foreground font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  outline: 'w-full flex items-center justify-center gap-2 bg-card hover:bg-accent border border-border text-foreground font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed',
  text: 'text-secondary hover:text-secondary-hover font-medium py-2 text-sm flex items-center justify-center gap-2',
}

type AuthMode = 'login' | 'register'

interface AuthFormProps {
  mode: AuthMode
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const isLogin = mode === 'login'
  const title = isLogin ? 'Entrar' : 'Cadastrar-se'
  const description = isLogin
    ? 'Digite seu email para receber um link de acesso'
    : 'Crie sua conta para acompanhar suas manifestações'
  const submitText = isLoading ? 'Enviando...' : isLogin ? 'Enviar link de acesso' : 'Criar conta'
  const dividerText = isLogin ? 'ou continue com' : 'ou cadastre-se com'
  const footerText = isLogin
    ? 'Não tem uma conta?'
    : 'Já tem uma conta?'
  const footerLink = isLogin ? '/cadastrar' : '/entrar'
  const footerLinkText = isLogin ? 'Cadastre-se' : 'Entrar'
  const successMessage = isLogin
    ? 'Enviamos um link de acesso para'
    : 'Enviamos um link de confirmação para'
  const successSubtext = isLogin
    ? 'Verifique sua caixa de entrada.'
    : 'Clique no link para completar seu cadastro.'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const result = await signIn('nodemailer', {
        email,
        redirect: false,
        callbackUrl: '/',
      })

      if (result?.error) {
        setError('Erro ao enviar email. Tente novamente.')
      } else {
        setSuccess(true)
      }
    } catch {
      setError('Erro ao enviar email. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    signIn('google', { callbackUrl: '/' })
  }

  if (success) {
    return (
      <div className="text-center py-10">
        <div className="w-14 h-14 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <RiMailLine className="size-7 text-secondary" />
        </div>
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Email enviado!
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          {successMessage} <strong>{email}</strong>. {successSubtext}
        </p>
        <button
          onClick={() => router.push('/')}
          className={BUTTON.primary}
        >
          Voltar ao início
        </button>
      </div>
    )
  }

  return (
    <>
      <p className="text-sm text-muted-foreground mb-5">
        {description}
      </p>

      {error && (
        <div className="mb-5 flex items-start gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <RiErrorWarningLine className="size-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className={SPACING.form}>
        {!isLogin && (
          <div className={SPACING.inputGroup}>
            <label htmlFor="name" className="block text-sm font-medium text-foreground">
              Nome completo
            </label>
            <div className="relative">
              <RiUserLine className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Seu nome"
                required
                className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
                disabled={isLoading}
              />
            </div>
          </div>
        )}

        <div className={SPACING.inputGroup}>
          <label htmlFor="email" className="block text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <RiMailLine className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              required
              className="w-full pl-10 pr-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-secondary focus:border-transparent transition-all"
              disabled={isLoading}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || (isLogin ? !email : !name || !email)}
          className={BUTTON.primary}
        >
          {submitText}
        </button>
      </form>

      <div className="mt-6">
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-background text-muted-foreground">
              {dividerText}
            </span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={isLoading}
          className={BUTTON.outline}
        >
          <RiGoogleFill className="size-5" />
          Google
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {footerText}{' '}
        <Link href={footerLink} className="text-secondary hover:underline font-medium">
          {footerLinkText}
        </Link>
      </p>
    </>
  )
}

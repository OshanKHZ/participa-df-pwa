'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { RiLoader4Line, RiMailLine, RiArrowRightLine } from 'react-icons/ri'
import { OtpModal } from '@/components/auth/otp-login-modal'
import { sendOtp } from '@/app/actions/auth'
import { toast } from 'sonner'
import { Button } from '@/shared/components/Button'

const authSchema = z.object({
  email: z.string().email('Digite um email válido'),
})

type AuthSchema = z.infer<typeof authSchema>

interface AuthFormProps {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: AuthFormProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [currentEmail, setCurrentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthSchema>({
    resolver: zodResolver(authSchema),
  })

  const onSubmit = async (data: AuthSchema) => {
    setIsLoading(true)
    try {
      const result = await sendOtp(data.email)

      if (result.success) {
        setCurrentEmail(data.email)
        setIsModalOpen(true)
        toast.success('Código enviado para seu email!')
      } else {
        toast.error(result.error || 'Erro ao enviar código.')
      }
    } catch {
      toast.error('Ocorreu um erro inesperado. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-8">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">
          {mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}
        </h1>
        <p className="text-muted-foreground">
          {mode === 'login'
            ? 'Digite seu email para acessar sua conta'
            : 'Digite seu email para criar uma nova conta'}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <div className="relative">
            <div className="absolute left-3 top-3 text-muted-foreground">
              <RiMailLine className="size-5" />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="seu@email.com"
              className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-input transition-all outline-none"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-destructive font-medium pl-1">
              {errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          variant="secondary"
          className="w-full"
        >
          {isLoading ? (
            <RiLoader4Line className="size-5 animate-spin" />
          ) : (
            <>
              {mode === 'login' ? 'Entrar com Email' : 'Continuar com Email'}
              <RiArrowRightLine className="size-5" />
            </>
          )}
        </Button>
      </form>


      <OtpModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        email={currentEmail}
      />
    </div>
  )
}
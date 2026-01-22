'use client'

import { useState } from 'react'
import { registerAnonymousUser } from '@/app/actions/auth'
import { useFormStatus } from 'react-dom'
import { FaUniversalAccess } from 'react-icons/fa'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
    >
      {pending ? 'Entrando...' : 'Entrar Agora'}
    </button>
  )
}

export function AnonymousRegisterForm() {
  const [needsAccessibility, setNeedsAccessibility] = useState(false)

  return (
    <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Acesso Rápido</h2>
        <p className="text-gray-500 text-sm mt-1">
          Identifique-se para começar
        </p>
      </div>

      <form action={registerAnonymousUser} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Nome de Usuário
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            placeholder="Como você gostaria de ser chamado?"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            placeholder="seu@email.com"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <div className="pt-2">
          <label className="flex items-center space-x-3 cursor-pointer group p-3 border border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all">
            <div className="flex items-center justify-center w-6 h-6 text-blue-600">
              <FaUniversalAccess size={20} />
            </div>
            <div className="flex-1">
              <span className="text-gray-700 font-medium group-hover:text-blue-700">
                Preciso de acessibilidade
              </span>
            </div>
            <input
              type="checkbox"
              name="needsAccessibility"
              checked={needsAccessibility}
              onChange={e => setNeedsAccessibility(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
          </label>
        </div>

        {needsAccessibility && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label
              htmlFor="accessibilityInfo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Qual tipo de acessibilidade?
            </label>
            <textarea
              id="accessibilityInfo"
              name="accessibilityInfo"
              rows={3}
              placeholder="Ex: Leitor de tela, Navegação por teclado, Contraste alto..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        )}

        <div className="pt-4">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

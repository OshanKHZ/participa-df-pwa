'use client'

import { useState } from 'react'
import { updateUserAccessibility } from '@/app/actions/profile'
import { useFormStatus } from 'react-dom'
import { FaUniversalAccess } from 'react-icons/fa'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50"
    >
      {pending ? 'Salvando...' : 'Salvar Alterações'}
    </button>
  )
}

interface AccessibilityFormProps {
  initialAccessibilityInfo: string | null
}

export function AccessibilityForm({
  initialAccessibilityInfo,
}: AccessibilityFormProps) {
  const [needsAccessibility, setNeedsAccessibility] = useState(
    !!initialAccessibilityInfo
  )

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <FaUniversalAccess size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Acessibilidade</h2>
          <p className="text-sm text-gray-500">
            Gerenciar suas preferências de acesso
          </p>
        </div>
      </div>

      <form action={updateUserAccessibility} className="space-y-4">
        <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="needsAccessibility"
              checked={needsAccessibility}
              onChange={e => setNeedsAccessibility(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            />
            <span className="text-gray-700 font-medium">
              Preciso de recursos de acessibilidade
            </span>
          </label>
        </div>

        {needsAccessibility && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label
              htmlFor="accessibilityInfo"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Conte-nos mais sobre suas necessidades
            </label>
            <textarea
              id="accessibilityInfo"
              name="accessibilityInfo"
              rows={3}
              defaultValue={initialAccessibilityInfo || ''}
              placeholder="Ex: Leitor de tela, Navegação por teclado, Alto contraste..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
            />
          </div>
        )}

        <div className="flex justify-end pt-2">
          <SubmitButton />
        </div>
      </form>
    </div>
  )
}

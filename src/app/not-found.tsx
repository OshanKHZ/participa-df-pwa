import Link from 'next/link'
import { RiHome4Line } from 'react-icons/ri'
import { Button } from '@/shared/components/Button'
import { DesktopHeader } from '@/shared/components/DesktopHeader'
import { MobileHeader } from '@/shared/components/MobileHeader'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <DesktopHeader />
      <MobileHeader title="Página não encontrada" />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 text-center animate-in zoom-in duration-300">
        <h1 className="text-[10rem] font-black text-gray-400 leading-none select-none">
          404
        </h1>
        
        <h2 className="text-2xl font-bold tracking-tight text-foreground mb-3">
          Página não encontrada
        </h2>
        
        <p className="text-base text-muted-foreground max-w-md mb-8">
          Ops! A página que você está procurando não existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">
              <RiHome4Line className="mr-2 size-5" />
              Voltar para o Início
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}

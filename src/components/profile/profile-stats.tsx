import { FaClipboardList } from 'react-icons/fa'

interface ProfileStatsProps {
  manifestationsCount: number
}

export function ProfileStats({ manifestationsCount }: ProfileStatsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center">
      <div className="p-3 bg-green-100 text-green-600 rounded-full mb-3">
        <FaClipboardList size={32} />
      </div>
      <h3 className="text-4xl font-bold text-gray-900 mb-1">
        {manifestationsCount}
      </h3>
      <p className="text-gray-500 font-medium uppercase text-xs tracking-wider">
        Manifestações Abertas
      </p>
    </div>
  )
}

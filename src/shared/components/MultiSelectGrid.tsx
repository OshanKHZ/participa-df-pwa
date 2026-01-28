'use client'

import { type IconType } from 'react-icons/lib'

export interface SelectableItem {
  id: string
  label: string
  description?: string
  icon: IconType
}

interface MultiSelectGridProps {
  items: SelectableItem[]
  selectedIds: string[]
  onToggle: (id: string) => void
  label?: string
  columns?: 2 | 3 | 4
  storageKey?: string
  className?: string
}

export function MultiSelectGrid({
  items,
  selectedIds,
  onToggle,
  label,
  columns = 3,
  storageKey,
  className = '',
}: MultiSelectGridProps) {
  const handleToggle = (id: string) => {
    onToggle(id)

    // Optionally persist to localStorage
    if (storageKey) {
      const newSelected = selectedIds.includes(id)
        ? selectedIds.filter(itemId => itemId !== id)
        : [...selectedIds, id]

      localStorage.setItem(storageKey, JSON.stringify(newSelected))
    }
  }

  const gridCols = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  }[columns]

  return (
    <div className={className}>
      {label && (
        <p className="text-sm font-medium text-foreground mb-2">{label}</p>
      )}
      <div className={`grid ${gridCols} gap-2 mb-2`}>
        {items.map(item => {
          const Icon = item.icon
          const isSelected = selectedIds.includes(item.id)

          return (
            <button
              key={item.id}
              onClick={() => handleToggle(item.id)}
              className={`bg-card rounded-lg p-2 card-border text-center transition-all btn-focus ${
                isSelected ? 'ring-2 ring-secondary' : 'hover:bg-accent'
              }`}
              aria-pressed={isSelected}
            >
              <div
                className={`w-8 h-8 border-2 rounded-lg flex items-center justify-center mx-auto mb-1 ${
                  isSelected ? 'border-secondary' : 'border-border'
                }`}
              >
                <Icon
                  className={`size-4 ${isSelected ? 'text-secondary' : 'text-muted-foreground'}`}
                />
              </div>
              <p
                className={`text-xs font-medium ${isSelected ? 'text-foreground' : 'text-muted-foreground'}`}
              >
                {item.label}
              </p>
              {item.description && (
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {item.description}
                </p>
              )}
            </button>
          )
        })}
      </div>
      {selectedIds.length > 0 && (
        <div className="text-xs text-success">
          ✓ {selectedIds.length}{' '}
          {selectedIds.length === 1 ? 'selecionado' : 'selecionados'}
        </div>
      )}
    </div>
  )
}

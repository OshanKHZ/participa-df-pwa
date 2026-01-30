'use client'

import { useState } from 'react'
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  itemsCount?: number
  itemsPerPage?: number
  onItemsPerPageChange?: (itemsPerPage: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsCount,
  itemsPerPage,
  onItemsPerPageChange,
}: PaginationProps) {
  const [inputPage, setInputPage] = useState(currentPage.toString())

  if (totalPages <= 1 && !onItemsPerPageChange) return null

  return (
    <div className="flex items-center justify-between py-3">
      {/* Left side: Info + Items per page */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">
          {itemsCount && itemsPerPage
            ? `${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, itemsCount)} de ${itemsCount}`
            : `Página ${currentPage} de ${totalPages}`}
        </span>

        {onItemsPerPageChange && (
          <select
            value={itemsPerPage || 10}
            onChange={e => onItemsPerPageChange(parseInt(e.target.value, 10))}
            className="px-2 py-1.5 text-sm border border-input rounded bg-background cursor-pointer"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        )}
      </div>

      {/* Right side: Navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className={`px-3 py-1.5 rounded text-lg flex items-center ${
            currentPage === 1
              ? 'bg-secondary/30 text-secondary/60 cursor-not-allowed'
              : 'bg-secondary text-white hover:bg-secondary/90'
          }`}
        >
          <RiArrowLeftSLine />
        </button>

        <select
          value={inputPage}
          onChange={e => {
            const page = parseInt(e.target.value, 10)
            setInputPage(e.target.value)
            onPageChange(page)
          }}
          className="px-2 py-1.5 text-sm border border-input rounded bg-background cursor-pointer"
        >
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <option key={page} value={page}>
              {page}
            </option>
          ))}
        </select>

        <span className="text-sm text-muted-foreground">/ {totalPages}</span>

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className={`px-3 py-1.5 rounded text-lg flex items-center ${
            currentPage === totalPages
              ? 'bg-secondary/30 text-secondary/60 cursor-not-allowed'
              : 'bg-secondary text-white hover:bg-secondary/90'
          }`}
        >
          <RiArrowRightSLine />
        </button>
      </div>
    </div>
  )
}

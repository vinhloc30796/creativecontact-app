import React from 'react'
import { X } from 'lucide-react'

interface ComboBadgeProps {
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  leftColor?: string
  rightColor?: string
  onDelete?: () => void
}

export function ComboBadge({
  leftContent,
  rightContent,
  leftColor = 'bg-primary',
  rightColor = 'bg-primary',
  onDelete
}: ComboBadgeProps) {
  return (
    <div className="inline-flex rounded-full overflow-hidden text-xs font-medium transition-all duration-300 hover:shadow-md group">
      <div className={`${leftColor} text-white px-2 py-1 transition-opacity duration-300 hover:opacity-90`}>{leftContent}</div>
      <div className={`${rightColor} text-white px-2 py-1 transition-opacity duration-300 hover:opacity-90 flex items-center gap-1`}>
        {rightContent}
        {onDelete && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="ml-1 p-0.5 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Delete"
          >
            <X className="h-3 w-3" />
          </button>
        )}
      </div>
    </div>
  )
}

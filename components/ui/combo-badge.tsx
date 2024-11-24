import React from 'react'

interface ComboBadgeProps {
  leftContent: React.ReactNode
  rightContent: React.ReactNode
  leftColor?: string
  rightColor?: string
}

export function ComboBadge({
  leftContent,
  rightContent,
  leftColor = 'bg-primary',
  rightColor = 'bg-primary'
}: ComboBadgeProps) {
  return (
    <div className="inline-flex rounded-full overflow-hidden text-xs font-medium transition-all duration-300 hover:shadow-md">
      <div className={`${leftColor} text-white px-2 py-1 transition-opacity duration-300 hover:opacity-90`}>{leftContent}</div>
      <div className={`${rightColor} text-white px-2 py-1 transition-opacity duration-300 hover:opacity-90`}>{rightContent}</div>
    </div>
  )
}

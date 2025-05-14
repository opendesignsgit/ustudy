'use client'

import React from 'react'

type AppliedFiltersProps = {
  appliedFilters: string[]
  onRemove: (filter: string) => void
  onClear: () => void
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  appliedFilters = [],
  onRemove,
  onClear,
}) => {
  if (appliedFilters.length === 0) {
    return null
  }

  return (
    <div className="ApplieBox flex items-center gap-2 p-4 bg-gray-50 rounded-lg mb-4">
      <div className="AppliedTitles flex items-center gap-2">
        <h3 className="font-medium">Applied Filters:</h3>
        <div className="flitmsvBoxs flex flex-wrap gap-2">
          {appliedFilters.map((filter, index) => (
            <div 
              key={index} 
              className="flitmsviews flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-gray-200"
            >
              <span>{filter}</span>
              <button
                onClick={() => onRemove(filter)}
                className="ml-1 text-gray-500 hover:text-red-500 transition-colors"
                aria-label={`Remove ${filter}`}
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <button 
        className="ml-auto text-sm text-blue-600 hover:text-blue-800 underline"
        onClick={onClear}
      >
        Clear All
      </button>
    </div>
  )
}

export default AppliedFilters
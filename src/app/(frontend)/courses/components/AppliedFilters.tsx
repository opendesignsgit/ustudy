'use client'

import React from 'react'

const AppliedFilters: React.FC<{
  appliedFilters: string[]
  onRemove: (type: string, value: string) => void
  onClear: () => void
}> = ({ appliedFilters = [], onRemove, onClear }) => {
  if (appliedFilters.length === 0) {
    return null
  }

  const handleRemove = (filter: string) => {
    const separatorIndex = filter.indexOf(': ')
    if (separatorIndex === -1) return

    const type = filter.substring(0, separatorIndex)
    const value = filter.substring(separatorIndex + 2)
    onRemove(type, value)
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
              <span className="truncate">{filter}</span>
              <button
                onClick={() => handleRemove(filter)}
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
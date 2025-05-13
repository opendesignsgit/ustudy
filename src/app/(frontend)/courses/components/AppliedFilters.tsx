'use client'

import React from 'react'

type AppliedFiltersProps = {
  appliedFilters?: string[] // Marking as optional with a default fallback
  onRemove: (filter: string) => void // Callback to remove a specific filter
  onClear: () => void // Callback to clear all filters
}

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  appliedFilters = [], // Fallback to an empty array if undefined
  onRemove,
  onClear,
}) => {
  if (appliedFilters.length === 0) {
    return null // Don't show the component if there are no filters applied.
  }

  return (
    <div className="ApplieBox flex items-center">
      <div className="AppliedTitles">
        <h3>Applied Filters</h3>
        <div className="flitmsvBoxs flex items-center text-sm">
          {appliedFilters.map((filter, index) => (
            <div key={index} className="flitmsviews flex items-center text-sm">
              <span>{filter}</span>
              <button
                onClick={() => onRemove(filter)}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <button className="ml-auto text-sm text-red-500 underline cleatbtn" onClick={onClear}>
        Clear All
      </button>
    </div>
  )
}

export default AppliedFilters
//final

"use client";

import React from "react";

type AppliedFiltersProps = {
  appliedFilters?: string[]; // Marking as optional with a default fallback
  onRemove: (filter: string) => void; // Callback to remove a specific filter
  onClear: () => void; // Callback to clear all filters
};

const AppliedFilters: React.FC<AppliedFiltersProps> = ({
  appliedFilters = [], // Fallback to an empty array if undefined
  onRemove,
  onClear,
}) => {
  if (appliedFilters.length === 0) {
    return null; // Don't show the component if there are no filters applied.
  }

  return (
    <div className="bg-white p-4 rounded shadow mb-4">
      <h3 className="font-medium mb-2">Applied Filters</h3>
      <div className="flex flex-wrap gap-2">
        {appliedFilters.map((filter, index) => (
          <div
            key={index}
            className="flex items-center bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm"
          >
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
      <button
        className="mt-3 text-sm text-red-500 underline"
        onClick={onClear}
      >
        Clear All
      </button>
    </div>
  );
};

export default AppliedFilters;
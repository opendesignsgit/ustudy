"use client";

import React, { useState } from "react";
import AppliedFilters from "./AppliedFilters";

type FiltersState = {
  countries: string[];
  universities: string[];
  studyAreas: string[];
};

type SearchTermsState = {
  countries: string;
  universities: string;
  studyAreas: string;
};

type CollapsedSectionsState = {
  countries: boolean;
  universities: boolean;
  studyAreas: boolean;
};

const FiltersClient: React.FC = () => {
  const [filters, setFilters] = useState<FiltersState>({
    countries: [],
    universities: [],
    studyAreas: [],
  });
  const [searchTerms, setSearchTerms] = useState<SearchTermsState>({
    countries: "",
    universities: "",
    studyAreas: "",
  });
  const [collapsedSections, setCollapsedSections] =
    useState<CollapsedSectionsState>({
      countries: false,
      universities: false,
      studyAreas: false,
    });

      const handleRemoveFilter = (filter: string) => {
    setFilters((prevFilters) => ({
      countries: prevFilters.countries.filter((item) => item !== filter),
      universities: prevFilters.universities.filter((item) => item !== filter),
      studyAreas: prevFilters.studyAreas.filter((item) => item !== filter),
    }));
  };
  const handleFilterChange = (category: keyof FiltersState, value: string) => {
    const updatedFilter = {
      ...filters,
      [category]: filters[category].includes(value)
        ? filters[category].filter((item) => item !== value)
        : [...filters[category], value],
    };
    setFilters(updatedFilter);
  };

  const handleSearchChange = (category: keyof SearchTermsState, value: string) => {
    setSearchTerms({
      ...searchTerms,
      [category]: value,
    });
  };

  const toggleCollapse = (category: keyof CollapsedSectionsState) => {
    setCollapsedSections({
      ...collapsedSections,
      [category]: !collapsedSections[category],
    });
  };

  const clearFilters = () => {
    setFilters({
      countries: [],
      universities: [],
      studyAreas: [],
    });
    setSearchTerms({
      countries: "",
      universities: "",
      studyAreas: "",
    });
  };

  const countries = [
    { name: "Malaysia", flag: "🇲🇾" },
    { name: "Barbados", flag: "🇧🇧" },
    { name: "Kazakhstan", flag: "🇰🇿" },
    { name: "Singapore", flag: "🇸🇬" },
    { name: "Kyrgyzstan", flag: "🇰🇬" },
    { name: "Tajikistan", flag: "🇹🇯" },
  ];

  const filterOptions = {
    universities: [
      "Brickfields Asia College",
      "Veritas University College",
      "Kokshetau State University",
      "Bridgetown International University",
      "Kazakh-Russian Medical University",
    ],
    studyAreas: ["Science", "Technology", "Arts", "Business", "Engineering"],
  };

  return (
      <div className="bg-gray-100 rounded p-4">
          
            {/* Applied Filters */}
      <AppliedFilters
        appliedFilters={Object.values(filters).flat()}
        onRemove={handleRemoveFilter}
        onClear={clearFilters}
      />
      {/* Country Slider */}
      <div className="mb-4">
        <h3 className="font-medium mb-2">Countries (Slider)</h3>
        <div className="flex overflow-x-auto gap-4 py-2">
          {countries.map((country) => (
            <div
              key={country.name}
              className={`flex flex-col items-center cursor-pointer ${
                filters.countries.includes(country.name)
                  ? "text-blue-500 font-bold"
                  : "text-gray-700"
              }`}
              onClick={() => handleFilterChange("countries", country.name)}
            >
              <span className="text-3xl">{country.flag}</span>
              <span className="text-sm mt-1">{country.name}</span>
            </div>
          ))}
        </div>
      </div>
      

      {/* Countries Filter with Collapse and Search */}
      <div className="mb-4">
        {/* Collapsible Title */}
        <div
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleCollapse("countries")}
        >
          <h3 className="font-medium">Countries (Filter)</h3>
          <button className="text-sm text-blue-500">
            {collapsedSections.countries ? "Expand" : "Collapse"}
          </button>
        </div>

        {/* Collapsible Content */}
        {!collapsedSections.countries && (
          <div>
            {/* Search Box */}
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mb-2"
              placeholder="Search countries"
              value={searchTerms.countries}
              onChange={(e) => handleSearchChange("countries", e.target.value)}
            />
            {/* Country List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {countries
                .filter((country) =>
                  country.name
                    .toLowerCase()
                    .includes(searchTerms.countries.toLowerCase())
                )
                .map((country) => (
                  <div key={country.name}>
                    <input
                      type="checkbox"
                      id={country.name}
                      value={country.name}
                      onChange={() =>
                        handleFilterChange("countries", country.name)
                      }
                      checked={filters.countries.includes(country.name)}
                    />
                    <label htmlFor={country.name} className="ml-2">
                      {country.name}
                    </label>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>

    

      {/* Filters for Universities and Study Areas */}
      {Object.keys(filterOptions).map((category) => (
        <div key={category} className="mb-4">
          {/* Collapsible Title */}
          <div
            className="flex justify-between items-center cursor-pointer"
            onClick={() =>
              toggleCollapse(category as keyof CollapsedSectionsState)
            }
          >
            <h3 className="font-medium capitalize">{category}</h3>
            <button className="text-sm text-blue-500">
              {collapsedSections[category as keyof CollapsedSectionsState]
                ? "Expand"
                : "Collapse"}
            </button>
          </div>

          {/* Filter Options */}
          {!collapsedSections[category as keyof CollapsedSectionsState] && (
            <div>
              {/* Search Box */}
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded mb-2"
                placeholder={`Search ${category}`}
                value={searchTerms[category as keyof SearchTermsState]}
                onChange={(e) =>
                  handleSearchChange(
                    category as keyof SearchTermsState,
                    e.target.value
                  )
                }
              />
              {/* Filter List */}
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {filterOptions[category as keyof typeof filterOptions]
                  .filter((option) =>
                    option
                      .toLowerCase()
                      .includes(
                        searchTerms[category as keyof SearchTermsState]?.toLowerCase()
                      )
                  )
                  .map((option) => (
                    <div key={option}>
                      <input
                        type="checkbox"
                        id={option}
                        value={option}
                        onChange={() =>
                          handleFilterChange(category as keyof FiltersState, option)
                        }
                        checked={filters[category as keyof FiltersState]?.includes(
                          option
                        )}
                      />
                      <label htmlFor={option} className="ml-2">
                        {option}
                      </label>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FiltersClient;
//final
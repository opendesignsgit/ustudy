'use client';
import React, { useState, useEffect } from 'react';
import { CollectionArchiveCourses } from "@/components/CollectionArchiveCourses";
import { CoursesPaginationAjax } from '@/components/CoursesPagination';
import { ajaxFetchCourses } from '@/utilities/ajaxFetchCourses';

type CoursesPaginationClientProps = {
  appliedFilters?: string[];
  initialCourses?: any;
  onRemoveFilter?: (filter: string) => void;
  onClearFilters?: () => void;
};

export default function CoursesPaginationClient({ 
  appliedFilters = [], 
  initialCourses,
  onRemoveFilter,
  onClearFilters
}: CoursesPaginationClientProps) {
  const [courses, setCourses] = useState<any>(initialCourses || { docs: [], page: 1, totalPages: 1 });
  const limit = 5;

  useEffect(() => {
    if (!initialCourses) {
      ajaxFetchCourses(1, limit).then((data) => {
        setCourses(data);
      });
    }
  }, [limit, initialCourses]);

  const fetchCourses = async (page: number) => {
    const data = await ajaxFetchCourses(page, limit);
    setCourses(data);
  };

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold">76 List of Degrees</h2>
          {appliedFilters.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Filters:</span>
              <div className="flex flex-wrap gap-2">
                {appliedFilters.map((filter, index) => (
                  <div
                    key={index}
                    className="flex items-center bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs"
                  >
                    <span>{filter}</span>
                    {onRemoveFilter && (
                      <button
                        onClick={() => onRemoveFilter(filter)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                ))}
              </div>
              {onClearFilters && (
                <button
                  onClick={onClearFilters}
                  className="text-sm text-red-500 underline ml-2"
                >
                  Clear All
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <CollectionArchiveCourses posts={courses.docs} relationTo="courses" />
      <div className="container">
        {courses.totalPages > 1 && (
          <CoursesPaginationAjax
            page={courses.page}
            totalPages={courses.totalPages}
            onPageChange={fetchCourses}
          />
        )}
      </div>
    </>
  );
}
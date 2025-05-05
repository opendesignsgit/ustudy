import React from "react";
import { CollectionArchive } from "@/components/CollectionArchive";
import { Pagination } from "@/components/Pagination";
import AppliedFilters from "./AppliedFilters";

type MainContentProps = {
  courses: any; // Replace this with the appropriate type for courses
  appliedFilters: string[];
  onRemoveFilter: (filter: string) => void;
  onClearFilters: () => void;
};

const MainContent: React.FC<MainContentProps> = ({
  courses,
  appliedFilters,
  onRemoveFilter,
  onClearFilters,
}) => {
  return (
    <div className="w-3/4">
      <div className="mb-4 flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold">Courses</h2>
          {/* Render the AppliedFilters component */}
          <AppliedFilters
            appliedFilters={appliedFilters}
            onRemove={onRemoveFilter}
            onClear={onClearFilters}
          />
        </div>
      </div>

      {/* Render the course archive */}
      <CollectionArchive posts={courses.docs} />

      {/* Render pagination if there are multiple pages */}
      {courses.totalPages > 1 && courses.page && (
        <Pagination page={courses.page} totalPages={courses.totalPages} />
      )}
    </div>
  );
};

export default MainContent;
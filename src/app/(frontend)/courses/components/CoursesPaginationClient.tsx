'use client';
import React, { useState, useEffect } from 'react';
import { CollectionArchiveCourses } from "@/components/CollectionArchiveCourses";
import { CoursesPaginationAjax } from '@/components/CoursesPagination';
import { ajaxFetchCourses } from '@/utilities/ajaxFetchCourses';

export default function CoursesPaginationClient() {
  const [courses, setCourses] = useState<any>({ docs: [], page: 1, totalPages: 1 });
  const limit = 5; // Set the limit for the number of courses per page

  useEffect(() => {
    // Fetch initial data
    ajaxFetchCourses(1, limit).then((data) => {
      setCourses(data);
    });
  }, [limit]);

  const fetchCourses = async (page: number) => {
    const data = await ajaxFetchCourses(page, limit);
    setCourses(data);
  };

  return (
    <>
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
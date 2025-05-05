export async function ajaxFetchCourses(page: number, limit: number = 12) {
  const response = await fetch(`/api/courses?page=${page}&limit=${limit}`);
  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }
  const data = await response.json();
  return data;
}
import api from "./api";

export const getCourses = async (params = {}) => {
  const { data } = await api.get("/courses", { params });
  return data.data;
};

export const getCourseBySlug = async (slug) => {
  const { data } = await api.get(`/courses/${slug}`);
  return data.data;
};

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data.data;
};

export const enrollInCourse = async (courseId) => {
  const { data } = await api.post("/enrollments", { courseId });
  return data.data;
};

export const getMyEnrollments = async () => {
  const { data } = await api.get("/enrollments/me");
  return data.data;
};

export const updateEnrollmentProgress = async (id, progress) => {
  const { data } = await api.put(`/enrollments/${id}`, { progress });
  return data.data;
};

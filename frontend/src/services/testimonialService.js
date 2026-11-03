import api from "./api";

export const getTestimonials = async () => {
  const { data } = await api.get("/testimonials");
  return data.data;
};

export const getMyTestimonial = async () => {
  const { data } = await api.get("/testimonials/me");
  return data.data;
};

export const saveMyTestimonial = async (payload) => {
  const { data } = await api.put("/testimonials/me", payload);
  return data.data;
};

export const deleteMyTestimonial = async () => {
  const { data } = await api.delete("/testimonials/me");
  return data;
};

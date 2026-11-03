import api from "./api";

export const getDashboardStats = async () => {
  const { data } = await api.get("/dashboard/stats");
  return data.data;
};

export const getAdminStats = async () => {
  const { data } = await api.get("/dashboard/admin");
  return data.data;
};

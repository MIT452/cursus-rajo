import api from "./api";

export const getUsers = async () => {
  const { data } = await api.get("/users");
  return data.data;
};

export const setUserSuspension = async (id, suspended) => {
  const { data } = await api.put(`/users/${id}/suspend`, { suspended });
  return data.data;
};

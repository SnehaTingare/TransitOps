import apiClient from "./apiClient";

const login = async (email, password) => {
  const response = await apiClient.post("/auth/login", {
    email,
    password,
  });

  return response.data;
};

const getCurrentUser = async () => {
  const response = await apiClient.get("/auth/me");

  return response.data;
};

const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default {
  login,
  getCurrentUser,
  logout,
};
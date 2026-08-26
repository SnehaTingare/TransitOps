import apiClient from "./apiClient";

const getKpis = async (filters = {}) => {
  const params = {};

  if (filters.vehicleType) {
    params.vehicleType = filters.vehicleType;
  }

  if (filters.vehicleStatus) {
    params.vehicleStatus = filters.vehicleStatus;
  }

  if (filters.region) {
    params.region = filters.region;
  }

  const response = await apiClient.get("/dashboard/kpis", {
    params,
  });

  return response.data;
};

export default {
  getKpis,
};
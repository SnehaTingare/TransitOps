import apiClient from "./apiClient";

const getVehicles = async (filters = {}) => {
  const params = {};

  if (filters.type) {
    params.type = filters.type;
  }

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.region) {
    params.region = filters.region;
  }

  if (filters.search) {
    params.search = filters.search;
  }

  const response = await apiClient.get("/vehicles", {
    params,
  });

  return response.data;
};

const getVehicleById = async (id) => {
  const response = await apiClient.get(`/vehicles/${id}`);

  return response.data;
};

const createVehicle = async (vehicleData) => {
  const response = await apiClient.post(
    "/vehicles",
    vehicleData
  );

  return response.data;
};

const updateVehicle = async (id, vehicleData) => {
  const response = await apiClient.put(
    `/vehicles/${id}`,
    vehicleData
  );

  return response.data;
};

const deleteVehicle = async (id) => {
  const response = await apiClient.delete(
    `/vehicles/${id}`
  );

  return response.data;
};

export default {
  getVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
};
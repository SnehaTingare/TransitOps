import apiClient from "./apiClient";

const getDrivers = async (filters = {}) => {
  const params = {};

  if (filters.status) {
    params.status = filters.status;
  }

  if (filters.eligible !== undefined && filters.eligible !== "") {
    params.eligible = filters.eligible;
  }

  const response = await apiClient.get("/drivers", {
    params,
  });

  return response.data;
};

const getDriverById = async (id) => {
  const response = await apiClient.get(
    `/drivers/${id}`
  );

  return response.data;
};

const createDriver = async (driverData) => {
  const response = await apiClient.post(
    "/drivers",
    driverData
  );

  return response.data;
};

const updateDriver = async (id, driverData) => {
  const response = await apiClient.put(
    `/drivers/${id}`,
    driverData
  );

  return response.data;
};

const deleteDriver = async (id) => {
  const response = await apiClient.delete(
    `/drivers/${id}`
  );

  return response.data;
};

export default {
  getDrivers,
  getDriverById,
  createDriver,
  updateDriver,
  deleteDriver,
};
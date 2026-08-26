import { useEffect, useState } from "react";


import AppLayout from "../layouts/AppLayout";
import vehicleService from "../services/vehicleService";

import VehicleTable from "../components/vehicles/VehicleTable";
import VehicleFilterBar from "../components/vehicles/VehicleFilterBar";
import VehicleForm from "../components/vehicles/VehicleForm";
import VehicleDetailsDrawer from "../components/vehicles/VehicleDetailsDrawer";

const VehiclesPage = () => {


  const [vehicles, setVehicles] = useState([]);

  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
    region: "",
  });

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] =
    useState(null);
  const [detailsVehicle, setDetailsVehicle] =
  useState(null);

  const loadVehicles = async (currentFilters = filters) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await vehicleService.getVehicles(
          currentFilters
        );

      setVehicles(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load vehicles:",
        error
      );

      setError(
        error.response?.data?.error ||
          "Unable to load vehicles."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles({
      search: "",
      type: "",
      status: "",
      region: "",
    });
  }, []);

  const handleFilterChange = (name, value) => {
    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);

    loadVehicles(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: "",
      type: "",
      status: "",
      region: "",
    };

    setFilters(clearedFilters);

    loadVehicles(clearedFilters);
  };

  const handleAddVehicle = () => {
    setSelectedVehicle(null);
    setShowForm(true);
    setError("");
  };

const handleViewVehicle = (vehicle) => {
  setDetailsVehicle(vehicle);
};

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowForm(true);
    setError("");
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedVehicle(null);
  };

  const handleSubmitVehicle = async (vehicleData) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedVehicle) {
        await vehicleService.updateVehicle(
          selectedVehicle.id,
          vehicleData
        );
      } else {
        await vehicleService.createVehicle(
          vehicleData
        );
      }

      setShowForm(false);
      setSelectedVehicle(null);

      await loadVehicles(filters);
    } catch (error) {
      console.error(
        "Failed to save vehicle:",
        error
      );

      setError(
        error.response?.data?.error ||
          "Unable to save vehicle."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteVehicle = async (vehicle) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete vehicle ${vehicle.registrationNumber}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await vehicleService.deleteVehicle(
        vehicle.id
      );

      await loadVehicles(filters);
    } catch (error) {
      console.error(
        "Failed to delete vehicle:",
        error
      );

      setError(
        error.response?.data?.error ||
          "Unable to delete vehicle."
      );

      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1>Vehicles</h1>

          <p>
            Manage fleet vehicles and their
            operational information.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAddVehicle}
        >
          Add Vehicle
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <VehicleFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {showForm && (
        <div className="form-section">
          <VehicleForm
            vehicle={selectedVehicle}
            onSubmit={handleSubmitVehicle}
            onCancel={handleCancelForm}
            loading={formLoading}
          />
        </div>
      )}

      <VehicleTable
        vehicles={vehicles}
        loading={loading}
        onView={handleViewVehicle}
        onEdit={handleEditVehicle}
        onDelete={handleDeleteVehicle}
      />
      <VehicleDetailsDrawer
  vehicle={detailsVehicle}
  open={!!detailsVehicle}
  onClose={() => setDetailsVehicle(null)}
/>
    </AppLayout>
  );
};

export default VehiclesPage;
import { useEffect, useState } from "react";

import AppLayout from "../layouts/AppLayout";
import driverService from "../services/driverService";

import DriverForm from "../components/drivers/DriverForm";
import DriverTable from "../components/drivers/DriverTable";
import DriverFilterBar from "../components/drivers/DriverFilterBar";
import DriverDetailsDrawer from "../components/drivers/DriverDetailsDrawer";

const DriversPage = () => {
  const [drivers, setDrivers] = useState([]);

  const [filters, setFilters] = useState({
    status: "",
    eligible: "",
  });

  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [showForm, setShowForm] =
    useState(false);

  const [selectedDriver, setSelectedDriver] =
    useState(null);

  const [detailsDriver, setDetailsDriver] =
    useState(null);

  // ==========================================
  // LOAD DRIVERS
  // ==========================================

  const loadDrivers = async (
    currentFilters = filters
  ) => {
    try {
      setLoading(true);
      setError("");

      const response =
        await driverService.getDrivers(
          currentFilters
        );

      setDrivers(response.data || []);
    } catch (error) {
      console.error(
        "Failed to load drivers:",
        error
      );

      setError(
        error.response?.data?.error ||
          "Unable to load drivers."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadDrivers({
      status: "",
      eligible: "",
    });
  }, []);

  // ==========================================
  // FILTER CHANGE
  // ==========================================

  const handleFilterChange = (
    name,
    value
  ) => {
    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);

    loadDrivers(updatedFilters);
  };

  // ==========================================
  // CLEAR FILTERS
  // ==========================================

  const handleClearFilters = () => {
    const clearedFilters = {
      status: "",
      eligible: "",
    };

    setFilters(clearedFilters);

    loadDrivers(clearedFilters);
  };

  // ==========================================
  // ADD DRIVER
  // ==========================================

  const handleAddDriver = () => {
    setSelectedDriver(null);
    setShowForm(true);
    setError("");
  };

  // ==========================================
  // VIEW DRIVER
  // ==========================================

  const handleViewDriver = (driver) => {
    setDetailsDriver(driver);
  };

  // ==========================================
  // EDIT DRIVER
  // ==========================================

  const handleEditDriver = (driver) => {
    setSelectedDriver(driver);
    setShowForm(true);
    setError("");
  };

  // ==========================================
  // CANCEL FORM
  // ==========================================

  const handleCancelForm = () => {
    setShowForm(false);
    setSelectedDriver(null);
  };

  // ==========================================
  // CREATE / UPDATE DRIVER
  // ==========================================

  const handleSubmitDriver = async (
    driverData
  ) => {
    try {
      setFormLoading(true);
      setError("");

      if (selectedDriver) {
        await driverService.updateDriver(
          selectedDriver.id,
          driverData
        );
      } else {
        await driverService.createDriver(
          driverData
        );
      }

      setShowForm(false);
      setSelectedDriver(null);

      await loadDrivers(filters);
    } catch (error) {
      console.error(
        "Failed to save driver:",
        error
      );

      setError(
        error.response?.data?.error ||
          "Unable to save driver."
      );
    } finally {
      setFormLoading(false);
    }
  };

  // ==========================================
  // DELETE DRIVER
  // ==========================================

  const handleDeleteDriver = async (driver) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete driver ${driver.name}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      await driverService.deleteDriver(
        driver.id
      );

      await loadDrivers(filters);
    } catch (error) {
      console.error(
        "Failed to delete driver:",
        error
      );

      setError(
        error.response?.data?.error ||
          "Unable to delete driver."
      );

      setLoading(false);
    }
  };

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <AppLayout>

      {/* PAGE HEADER */}

      <div className="page-header">

        <div>
          <h1>Drivers</h1>

          <p>
            Manage drivers, licenses and
            operational status.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={handleAddDriver}
        >
          Add Driver
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* FILTERS */}

      <DriverFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {/* FORM */}

      {showForm && (
        <div className="form-section">

          <DriverForm
            driver={selectedDriver}
            onSubmit={handleSubmitDriver}
            onCancel={handleCancelForm}
            loading={formLoading}
          />

        </div>
      )}

      {/* TABLE */}

      <DriverTable
        drivers={drivers}
        loading={loading}
        onView={handleViewDriver}
        onEdit={handleEditDriver}
        onDelete={handleDeleteDriver}
      />

      {/* DETAILS DRAWER */}

      <DriverDetailsDrawer
        driver={detailsDriver}
        open={!!detailsDriver}
        onClose={() =>
          setDetailsDriver(null)
        }
      />

    </AppLayout>
  );
};

export default DriversPage;
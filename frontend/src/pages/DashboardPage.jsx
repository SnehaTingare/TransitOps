import { useEffect, useState } from "react";

import AppLayout from "../layouts/AppLayout";
import dashboardService from "../services/dashboardService";

import KpiCard from "../components/ui/KpiCard";
import DashboardFilterBar from "../components/dashboard/DashboardFilterBar";

const DashboardPage = () => {
  const [kpis, setKpis] = useState(null);

  const [filters, setFilters] = useState({
    vehicleType: "",
    vehicleStatus: "",
    region: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadKpis = async (currentFilters) => {
    try {
      setLoading(true);
      setError("");

      const response = await dashboardService.getKpis(
        currentFilters
      );

      setKpis(response.data);
    } catch (error) {
      console.error(
        "Failed to load dashboard KPIs:",
        error
      );

      setError(
        error.response?.data?.error ||
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadKpis(filters);
  }, []);

  const handleFilterChange = (name, value) => {
    const updatedFilters = {
      ...filters,
      [name]: value,
    };

    setFilters(updatedFilters);

    loadKpis(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      vehicleType: "",
      vehicleStatus: "",
      region: "",
    };

    setFilters(clearedFilters);

    loadKpis(clearedFilters);
  };

  return (
    <AppLayout>
      <div className="page-header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Operational overview of the fleet.
          </p>
        </div>
      </div>

      <DashboardFilterBar
        filters={filters}
        onFilterChange={handleFilterChange}
        onClear={handleClearFilters}
      />

      {loading && (
        <div className="page-state">
          Loading dashboard...
        </div>
      )}

      {!loading && error && (
        <div className="error-message">
          <p>{error}</p>

          <button onClick={() => loadKpis(filters)}>
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && kpis && (
        <div className="kpi-grid">
          <KpiCard
            title="Active Vehicles"
            value={kpis.activeVehicles}
          />

          <KpiCard
            title="Available Vehicles"
            value={kpis.availableVehicles}
          />

          <KpiCard
            title="Vehicles in Maintenance"
            value={kpis.vehiclesInMaintenance}
          />

          <KpiCard
            title="Active Trips"
            value={kpis.activeTrips}
          />

          <KpiCard
            title="Pending Trips"
            value={kpis.pendingTrips}
          />

          <KpiCard
            title="Drivers On Duty"
            value={kpis.driversOnDuty}
          />

          <KpiCard
            title="Fleet Utilization"
            value={kpis.fleetUtilization}
            suffix="%"
          />
        </div>
      )}

      {!loading && !error && !kpis && (
        <div className="page-state">
          No dashboard data available.
        </div>
      )}
    </AppLayout>
  );
};

export default DashboardPage;
import { useEffect, useState } from "react";

import vehicleService from "../../services/vehicleService";

const VehicleDetailsDrawer = ({
  vehicle,
  open,
  onClose,
}) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || !vehicle?.id) {
      return;
    }

    const loadDetails = async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await vehicleService.getVehicleById(
            vehicle.id
          );

        setDetails(response.data);
      } catch (error) {
        console.error(
          "Failed to load vehicle details:",
          error
        );

        setError(
          error.response?.data?.error ||
            "Unable to load vehicle details."
        );
      } finally {
        setLoading(false);
      }
    };

    loadDetails();
  }, [open, vehicle]);

  if (!open) {
    return null;
  }

  return (
    <div className="drawer-overlay">
      <div className="vehicle-details-drawer">

        <div className="drawer-header">
          <div>
            <h2>Vehicle Details</h2>

            {vehicle?.registrationNumber && (
              <p>
                {vehicle.registrationNumber}
              </p>
            )}
          </div>

          <button
            type="button"
            className="drawer-close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="drawer-content">
          {loading && (
            <div className="page-state">
              Loading vehicle details...
            </div>
          )}

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {!loading && !error && details && (
            <div className="vehicle-detail-grid">

              <div className="detail-item">
                <span>
                  Registration Number
                </span>

                <strong>
                  {details.registrationNumber || "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Model</span>

                <strong>
                  {details.model || "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Vehicle Type</span>

                <strong>
                  {details.type || "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Capacity</span>

                <strong>
                  {details.capacity ?? "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>
                  Maximum Load Capacity
                </span>

                <strong>
                  {details.maxLoadCapacity ?? "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Odometer</span>

                <strong>
                  {details.odometer ?? "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Acquisition Cost</span>

                <strong>
                  {details.acquisitionCost ?? "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Region</span>

                <strong>
                  {details.region || "-"}
                </strong>
              </div>

              <div className="detail-item">
                <span>Status</span>

                <strong>
                  {details.status || "-"}
                </strong>
              </div>

            </div>
          )}

          {!loading && !error && !details && (
            <div className="page-state">
              No vehicle details found.
            </div>
          )}
        </div>

        <div className="drawer-footer">
          <button
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default VehicleDetailsDrawer;
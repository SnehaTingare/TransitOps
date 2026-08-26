const DriverDetailsDrawer = ({
  driver,
  open,
  onClose,
}) => {
  if (!open || !driver) {
    return null;
  }

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  return (
    <div className="drawer-overlay">
      <div className="details-drawer">

        {/* Header */}

        <div className="drawer-header">
          <div>
            <h2>{driver.name}</h2>

            <p>
              Driver Details
            </p>
          </div>

          <button
            type="button"
            className="drawer-close-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {/* Status */}

        <div className="driver-details-status">
          <span
            className={`status-badge status-${driver.status.toLowerCase()}`}
          >
            {driver.status}
          </span>
        </div>

        {/* Details */}

        <div className="details-section">

          <h3>Personal Information</h3>

          <div className="details-grid">

            <div className="detail-item">
              <span className="detail-label">
                Name
              </span>

              <span className="detail-value">
                {driver.name || "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                Contact Number
              </span>

              <span className="detail-value">
                {driver.contactNumber || "-"}
              </span>
            </div>

          </div>

        </div>

        {/* License */}

        <div className="details-section">

          <h3>License Information</h3>

          <div className="details-grid">

            <div className="detail-item">
              <span className="detail-label">
                License Number
              </span>

              <span className="detail-value">
                {driver.licenseNumber || "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                License Category
              </span>

              <span className="detail-value">
                {driver.licenseCategory || "-"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                License Expiry
              </span>

              <span className="detail-value">
                {formatDate(
                  driver.licenseExpiryDate
                )}
              </span>
            </div>

          </div>

        </div>

        {/* Safety */}

        <div className="details-section">

          <h3>Safety Information</h3>

          <div className="details-grid">

            <div className="detail-item">
              <span className="detail-label">
                Safety Score
              </span>

              <span className="detail-value">
                {driver.safetyScore ?? "-"}
                {" / 100"}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                Current Status
              </span>

              <span className="detail-value">
                {driver.status || "-"}
              </span>
            </div>

          </div>

        </div>

        {/* User Link */}

        {driver.userId && (
          <div className="details-section">

            <h3>Linked User</h3>

            <div className="details-grid">

              <div className="detail-item">
                <span className="detail-label">
                  User ID
                </span>

                <span className="detail-value">
                  {driver.userId}
                </span>
              </div>

            </div>

          </div>
        )}

        {/* Footer */}

        <div className="drawer-footer">

          <button
            type="button"
            className="secondary-button"
            onClick={onClose}
          >
            Close
          </button>

        </div>

      </div>
    </div>
  );
};

export default DriverDetailsDrawer;
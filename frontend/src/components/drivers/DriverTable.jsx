const DriverTable = ({
  drivers,
  loading,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="page-state">
        Loading drivers...
      </div>
    );
  }

  if (!drivers.length) {
    return (
      <div className="page-state">
        No drivers found.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>License Number</th>
            <th>Category</th>
            <th>Contact</th>
            <th>Safety Score</th>
            <th>Status</th>
            <th>License Expiry</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {drivers.map((driver) => (
            <tr key={driver.id}>
              <td>{driver.name}</td>

              <td>{driver.licenseNumber}</td>

              <td>{driver.licenseCategory}</td>

              <td>{driver.contactNumber}</td>

              <td>
                {driver.safetyScore ?? "-"}
              </td>

              <td>
                <span
                  className={`status-badge status-${driver.status.toLowerCase()}`}
                >
                  {driver.status}
                </span>
              </td>

              <td>
                {driver.licenseExpiryDate
                  ? new Date(
                      driver.licenseExpiryDate
                    ).toLocaleDateString()
                  : "-"}
              </td>

              <td>
                <div className="table-actions">
                  <button
                    type="button"
                    className="view-button"
                    onClick={() => onView(driver)}
                  >
                    View
                  </button>

                  <button
                    type="button"
                    className="edit-button"
                    onClick={() => onEdit(driver)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-button"
                    onClick={() => onDelete(driver)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DriverTable;
const VehicleTable = ({
  vehicles,
  loading,
  onView,
  onEdit,
  onDelete,
}) => {
  if (loading) {
    return (
      <div className="page-state">
        Loading vehicles...
      </div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="page-state">
        No vehicles found.
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Registration Number</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Status</th>
            <th>Region</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>
                {vehicle.registrationNumber}
              </td>

              <td>
                {vehicle.type}
              </td>

              <td>
                {vehicle.capacity}
              </td>

              <td>
                <span
                  className={`status-badge status-${vehicle.status?.toLowerCase()}`}
                >
                  {vehicle.status}
                </span>
              </td>

              <td>
                {vehicle.region || "-"}
              </td>

              <td>
                <div className="table-actions">
  <button
    type="button"
    onClick={() => onView(vehicle)}
    className="view-button"
  >
    View
  </button>

  <button
    type="button"
    onClick={() => onEdit(vehicle)}
    className="edit-button"
  >
    Edit
  </button>

  <button
    type="button"
    onClick={() => onDelete(vehicle)}
    className="delete-button"
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

export default VehicleTable;
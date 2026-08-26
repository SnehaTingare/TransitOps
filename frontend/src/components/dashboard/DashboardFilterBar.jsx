const DashboardFilterBar = ({
  filters,
  onFilterChange,
  onClear,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onFilterChange(name, value);
  };

  return (
    <div className="dashboard-filter-bar">
      {/* Vehicle Type */}
      <div className="filter-field">
        <label htmlFor="vehicleType">
          Vehicle Type
        </label>

        <input
          id="vehicleType"
          name="vehicleType"
          type="text"
          placeholder="All vehicle types"
          value={filters.vehicleType}
          onChange={handleChange}
        />
      </div>

      {/* Vehicle Status */}
      <div className="filter-field">
        <label htmlFor="vehicleStatus">
          Vehicle Status
        </label>

        <select
          id="vehicleStatus"
          name="vehicleStatus"
          value={filters.vehicleStatus}
          onChange={handleChange}
        >
          <option value="">
            All statuses
          </option>

          <option value="AVAILABLE">
            Available
          </option>

          <option value="ON_TRIP">
            On Trip
          </option>

          <option value="IN_SHOP">
            In Shop
          </option>

          <option value="RETIRED">
            Retired
          </option>
        </select>
      </div>

      {/* Region */}
      <div className="filter-field">
        <label htmlFor="region">
          Region
        </label>

        <input
          id="region"
          name="region"
          type="text"
          placeholder="All regions"
          value={filters.region}
          onChange={handleChange}
        />
      </div>

      {/* Clear */}
      <button
        type="button"
        className="clear-filter-button"
        onClick={onClear}
      >
        Clear Filters
      </button>
    </div>
  );
};

export default DashboardFilterBar;
const VehicleFilterBar = ({
  filters,
  onFilterChange,
  onClear,
}) => {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onFilterChange(name, value);
  };

  return (
    <div className="vehicle-filter-bar">
      {/* Search */}
      <div className="filter-field">
        <label htmlFor="vehicle-search">
          Search
        </label>

        <input
          id="vehicle-search"
          name="search"
          type="text"
          placeholder="Search registration number..."
          value={filters.search}
          onChange={handleChange}
        />
      </div>

      {/* Vehicle Type */}
      <div className="filter-field">
        <label htmlFor="vehicle-type">
          Type
        </label>

        <input
          id="vehicle-type"
          name="type"
          type="text"
          placeholder="All types"
          value={filters.type}
          onChange={handleChange}
        />
      </div>

      {/* Vehicle Status */}
      <div className="filter-field">
        <label htmlFor="vehicle-status">
          Status
        </label>

        <select
          id="vehicle-status"
          name="status"
          value={filters.status}
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
        <label htmlFor="vehicle-region">
          Region
        </label>

        <input
          id="vehicle-region"
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

export default VehicleFilterBar;
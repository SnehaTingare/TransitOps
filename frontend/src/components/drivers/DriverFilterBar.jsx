const DriverFilterBar = ({
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
      <div className="filter-field">
        <label htmlFor="driver-status">
          Status
        </label>

        <select
          id="driver-status"
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

          <option value="OFF_DUTY">
            Off Duty
          </option>

          <option value="SUSPENDED">
            Suspended
          </option>
        </select>
      </div>

      <div className="filter-field">
        <label htmlFor="driver-eligible">
          Eligibility
        </label>

        <select
          id="driver-eligible"
          name="eligible"
          value={filters.eligible}
          onChange={handleChange}
        >
          <option value="">
            All drivers
          </option>

          <option value="true">
            Eligible
          </option>

          <option value="false">
            Not eligible
          </option>
        </select>
      </div>

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

export default DriverFilterBar;
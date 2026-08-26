import { useEffect, useState } from "react";

const emptyVehicle = {
  registrationNumber: "",
  model: "",
  type: "",
  capacity: "",
  maxLoadCapacity: "",
  odometer: "",
  acquisitionCost: "",
  region: "",
  status: "AVAILABLE",
};

const VehicleForm = ({
  vehicle,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState(emptyVehicle);

  useEffect(() => {
    if (vehicle) {
      setFormData({
        registrationNumber:
          vehicle.registrationNumber || "",

        model:
          vehicle.model || "",

        type:
          vehicle.type || "",

        capacity:
          vehicle.capacity ?? "",

        maxLoadCapacity:
          vehicle.maxLoadCapacity ?? "",

        odometer:
          vehicle.odometer ?? "",

        acquisitionCost:
          vehicle.acquisitionCost ?? "",

        region:
          vehicle.region || "",

        status:
          vehicle.status || "AVAILABLE",
      });
    } else {
      setFormData(emptyVehicle);
    }
  }, [vehicle]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

 const handleSubmit = (event) => {
  event.preventDefault();

  const vehicleData = {
    ...formData,

    capacity: Number(formData.capacity),

    maxLoadCapacity: Number(
      formData.maxLoadCapacity
    ),

    odometer: Number(
      formData.odometer
    ),

    acquisitionCost: Number(
      formData.acquisitionCost
    ),
  };

  // Status cannot be changed through
  // the vehicle update API.
  if (vehicle) {
    delete vehicleData.status;
  }

  onSubmit(vehicleData);
};

  return (
    <form
      className="vehicle-form"
      onSubmit={handleSubmit}
    >
      <h2>
        {vehicle
          ? "Edit Vehicle"
          : "Add Vehicle"}
      </h2>

      {/* Registration Number */}

      <div className="form-field">
        <label htmlFor="registrationNumber">
          Registration Number
        </label>

        <input
          id="registrationNumber"
          name="registrationNumber"
          type="text"
          placeholder="MH12AB1234"
          value={formData.registrationNumber}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {/* Model */}

      <div className="form-field">
        <label htmlFor="model">
          Model
        </label>

        <input
          id="model"
          name="model"
          type="text"
          placeholder="Tata Ace"
          value={formData.model}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {/* Type */}

      <div className="form-field">
        <label htmlFor="type">
          Vehicle Type
        </label>

        <input
          id="type"
          name="type"
          type="text"
          placeholder="Van"
          value={formData.type}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {/* Capacity */}

      <div className="form-field">
        <label htmlFor="capacity">
          Capacity
        </label>

        <input
          id="capacity"
          name="capacity"
          type="number"
          min="0"
          placeholder="1000"
          value={formData.capacity}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {/* Maximum Load Capacity */}

      <div className="form-field">
        <label htmlFor="maxLoadCapacity">
          Maximum Load Capacity
        </label>

        <input
          id="maxLoadCapacity"
          name="maxLoadCapacity"
          type="number"
          min="0"
          placeholder="1500"
          value={formData.maxLoadCapacity}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {/* Odometer */}

      <div className="form-field">
        <label htmlFor="odometer">
          Odometer
        </label>

        <input
          id="odometer"
          name="odometer"
          type="number"
          min="0"
          placeholder="25000"
          value={formData.odometer}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {/* Acquisition Cost */}

      <div className="form-field">
        <label htmlFor="acquisitionCost">
          Acquisition Cost
        </label>

        <input
          id="acquisitionCost"
          name="acquisitionCost"
          type="number"
          min="0"
          placeholder="850000"
          value={formData.acquisitionCost}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </div>

      {/* Region */}

      <div className="form-field">
        <label htmlFor="region">
          Region
        </label>

        <input
          id="region"
          name="region"
          type="text"
          placeholder="Pune"
          value={formData.region}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      {/* Status */}

      <div className="form-field">
        <label htmlFor="status">
          Status
        </label>

        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading || !!vehicle}
        >
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

      {/* Buttons */}

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : vehicle
            ? "Update Vehicle"
            : "Create Vehicle"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
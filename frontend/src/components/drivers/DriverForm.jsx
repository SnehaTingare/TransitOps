import { useEffect, useState } from "react";

const DriverForm = ({
  driver,
  onSubmit,
  onCancel,
  loading,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    licenseNumber: "",
    licenseCategory: "",
    licenseExpiryDate: "",
    contactNumber: "",
    safetyScore: "",
    status: "AVAILABLE",
    userId: "",
  });

  const [formError, setFormError] = useState("");

  useEffect(() => {
    if (driver) {
      setFormData({
        name: driver.name || "",
        licenseNumber:
          driver.licenseNumber || "",
        licenseCategory:
          driver.licenseCategory || "",
        licenseExpiryDate: driver.licenseExpiryDate
          ? new Date(driver.licenseExpiryDate)
              .toISOString()
              .split("T")[0]
          : "",
        contactNumber:
          driver.contactNumber || "",
        safetyScore:
          driver.safetyScore ?? "",
        status:
          driver.status || "AVAILABLE",
        userId: driver.userId || "",
      });
    } else {
      setFormData({
        name: "",
        licenseNumber: "",
        licenseCategory: "",
        licenseExpiryDate: "",
        contactNumber: "",
        safetyScore: "",
        status: "AVAILABLE",
        userId: "",
      });
    }
  }, [driver]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setFormError("");

    if (!formData.name.trim()) {
      setFormError("Driver name is required.");
      return;
    }

    if (!formData.licenseNumber.trim()) {
      setFormError("License number is required.");
      return;
    }

    if (!formData.licenseCategory.trim()) {
      setFormError("License category is required.");
      return;
    }

    if (!formData.licenseExpiryDate) {
      setFormError(
        "License expiry date is required."
      );
      return;
    }

    if (!formData.contactNumber.trim()) {
      setFormError(
        "Contact number is required."
      );
      return;
    }

    if (
      formData.safetyScore === "" ||
      Number(formData.safetyScore) < 0 ||
      Number(formData.safetyScore) > 100
    ) {
      setFormError(
        "Safety score must be between 0 and 100."
      );
      return;
    }

    const driverData = {
      name: formData.name.trim(),
      licenseNumber:
        formData.licenseNumber.trim(),
      licenseCategory:
        formData.licenseCategory.trim(),
      licenseExpiryDate:
        formData.licenseExpiryDate,
      contactNumber:
        formData.contactNumber.trim(),
      safetyScore:
        Number(formData.safetyScore),
      status: formData.status,
    };

    if (formData.userId.trim()) {
      driverData.userId =
        formData.userId.trim();
    }

    onSubmit(driverData);
  };

  return (
    <form
      className="driver-form"
      onSubmit={handleSubmit}
    >
      <h2>
        {driver
          ? "Edit Driver"
          : "Add Driver"}
      </h2>

      {formError && (
        <div className="error-message">
          {formError}
        </div>
      )}

      <div className="form-field">
        <label htmlFor="driver-name">
          Driver Name
        </label>

        <input
          id="driver-name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter driver name"
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="driver-license">
          License Number
        </label>

        <input
          id="driver-license"
          name="licenseNumber"
          type="text"
          value={formData.licenseNumber}
          onChange={handleChange}
          placeholder="Enter license number"
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="driver-category">
          License Category
        </label>

        <input
          id="driver-category"
          name="licenseCategory"
          type="text"
          value={formData.licenseCategory}
          onChange={handleChange}
          placeholder="e.g. LMV, HMV"
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="driver-expiry">
          License Expiry Date
        </label>

        <input
          id="driver-expiry"
          name="licenseExpiryDate"
          type="date"
          value={formData.licenseExpiryDate}
          onChange={handleChange}
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="driver-contact">
          Contact Number
        </label>

        <input
          id="driver-contact"
          name="contactNumber"
          type="tel"
          value={formData.contactNumber}
          onChange={handleChange}
          placeholder="Enter contact number"
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="driver-safety-score">
          Safety Score
        </label>

        <input
          id="driver-safety-score"
          name="safetyScore"
          type="number"
          min="0"
          max="100"
          value={formData.safetyScore}
          onChange={handleChange}
          placeholder="0 - 100"
          disabled={loading}
        />
      </div>

      <div className="form-field">
        <label htmlFor="driver-status">
          Status
        </label>

        <select
          id="driver-status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          disabled={loading}
        >
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

      <div className="form-field">
        <label htmlFor="driver-user-id">
          User ID (Optional)
        </label>

        <input
          id="driver-user-id"
          name="userId"
          type="text"
          value={formData.userId}
          onChange={handleChange}
          placeholder="Optional linked user ID"
          disabled={loading}
        />
      </div>

      <div className="form-actions">
        <button
          type="submit"
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : driver
            ? "Update Driver"
            : "Create Driver"}
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

export default DriverForm;
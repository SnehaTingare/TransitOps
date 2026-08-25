const reportService = require("../services/reportService");

const getVehicleAnalytics = async (req, res, next) => {
  try {
    const analytics =
      await reportService.getVehicleAnalytics(req.query);

    return res.status(200).json({
      success: true,
      data: analytics,
    });
  } catch (error) {
    if (error.message === "Invalid vehicle ID") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

module.exports = {
  getVehicleAnalytics,
};
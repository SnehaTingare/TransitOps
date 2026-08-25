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

const exportCsv = async (req, res, next) => {
  try {
    const csv = await reportService.getExportData(req.query);

    const filename = "transitops-report.csv";

    res.status(200);

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${filename}"`
    );

    return res.send(csv);
  } catch (error) {
    if (
      error.message === "Unsupported report type" ||
      error.message === "Invalid vehicle ID" ||
      error.message === "Invalid from date" ||
      error.message === "Invalid to date"
    ) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    if (error.message === "Vehicle not found") {
      return res.status(404).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

module.exports = {
  getVehicleAnalytics,
  exportCsv,
};
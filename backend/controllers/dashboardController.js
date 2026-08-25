const dashboardService = require("../services/dashboardService");

const getDashboardKPIs = async (req, res, next) => {
  try {
    const kpis = await dashboardService.getDashboardKPIs(
      req.query
    );

    return res.status(200).json({
      success: true,
      data: kpis,
    });
  } catch (error) {
    if (error.message === "Invalid vehicle status") {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    next(error);
  }
};

module.exports = {
  getDashboardKPIs,
};
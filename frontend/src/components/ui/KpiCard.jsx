const KpiCard = ({ title, value, suffix = "" }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-card-title">
        {title}
      </div>

      <div className="kpi-card-value">
        {value}
        {suffix && (
          <span className="kpi-card-suffix">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

export default KpiCard;
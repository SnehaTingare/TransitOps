import { NavLink, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
    },
    {
      name: "Vehicles",
      path: "/vehicles",
    },
    {
      name: "Drivers",
      path: "/drivers",
    },
    {
      name: "Trips",
      path: "/trips",
    },
    {
      name: "Maintenance",
      path: "/maintenance",
    },
    {
      name: "Fuel & Expenses",
      path: "/fuel-expenses",
    },
    {
      name: "Reports",
      path: "/reports",
    },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">TransitOps</h2>

        <nav>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                isActive
                  ? "nav-link active"
                  : "nav-link"
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Section */}
      <div className="main-section">

        {/* Topbar */}
        <header className="topbar">

          <div className="topbar-title">
            <h3>Fleet Management System</h3>
          </div>

          <div className="topbar-user">

            <div className="user-details">
              <span className="user-name">
                {user?.name || "User"}
              </span>

              <span className="user-role">
                {user?.role
                  ? user.role
                      .replaceAll("_", " ")
                      .toLowerCase()
                      .replace(/\b\w/g, (char) =>
                        char.toUpperCase()
                      )
                  : ""}
              </span>
            </div>

            <button
              className="logout-button"
              onClick={handleLogout}
            >
              Logout
            </button>

          </div>
        </header>

        {/* Page Content */}
        <main className="content">
          {children}
        </main>

      </div>
    </div>
  );
};

export default AppLayout;
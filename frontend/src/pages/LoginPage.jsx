import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter email and password.");
      return;
    }

    try {
      setLoading(true);

      await login(email, password);

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.response?.data?.error ||
          "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>TransitOps</h1>

        <p>Fleet Management System</p>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email">Email</label>

            <input
              id="email"
              type="email"
              value={email}
              placeholder="Enter your email"
              onChange={(event) =>
                setEmail(event.target.value)
              }
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>

            <input
              id="password"
              type="password"
              value={password}
              placeholder="Enter your password"
              onChange={(event) =>
                setPassword(event.target.value)
              }
              disabled={loading}
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);

  if (loading) return <h1 className="text-white">Checking auth...</h1>;

  if (!auth) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;

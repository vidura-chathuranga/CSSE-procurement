import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteManager = () => {
  const manager = JSON.parse(localStorage.getItem("manager") || "{}");
  const accessToken = manager.accessToken;
  return accessToken ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRouteManager;

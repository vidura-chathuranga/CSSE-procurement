import { Navigate, Outlet } from "react-router-dom";

const PrivateRouteSupplier = () => {
  const supplier = JSON.parse(localStorage.getItem("supplier") || "{}");
  const accessToken = supplier.accessToken;
  return accessToken ? <Outlet /> : <Navigate to="/supplier/login" />;
};

export default PrivateRouteSupplier;

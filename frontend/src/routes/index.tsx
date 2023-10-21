import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ManagerLogin, ManagerDashboard, SupplierLogin } from "../pages";
import { Logout } from "../components";
import PrivateRouteManager from "./PrivateRouteManager";
import PrivateRouteSupplier from "./PrivateRouteSupplier";
import SupplierDashboard from "../pages/supplier-dashboard";
import SupplierLogout from "../components/supplierLogout";

const PageRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ManagerLogin />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/supplier/login" element={<SupplierLogin />} />
        <Route path="/supplier/logout" element={<SupplierLogout />} />

        <Route path="manager" element={<PrivateRouteManager />}>
          <Route path="dashboard" element={<ManagerDashboard />} />
        </Route>
        <Route path="supplier" element={<PrivateRouteSupplier />}>
          <Route path="dashboard" element={<SupplierDashboard />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default PageRoutes;

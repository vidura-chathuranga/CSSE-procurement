import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ManagerLogin, ManagerDashboard } from "../pages";
import { Logout } from "../components";
import PrivateRouteManager from "./PrivateRouteManager";

const PageRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ManagerLogin/>} />
                <Route path="/logout" element={<Logout/>} />

                <Route path="manager" element={<PrivateRouteManager/>}>
                    <Route path="dashboard" element={<ManagerDashboard/>} />
                </Route>
            </Routes>
        </Router>
    );
};

export default PageRoutes;
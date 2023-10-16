import {
    Box,  
  } from "@mantine/core";
import { ManagerDashboard as ManagerDashboardComponent } from "../../components";

const ManagerDashboard: React.FC = () => {
    return (
        <Box
            sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
            }}
        >
            <ManagerDashboardComponent />
        </Box>
    );
};

export default ManagerDashboard;
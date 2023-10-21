import {
    Box,  
  } from "@mantine/core";
import { SupplierDashboard as SupplierDashbaordComponent } from "../../components/";

const SupplierDashboard: React.FC = () => {
    return (
        <Box
            sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "start",
            }}
        >
            <SupplierDashbaordComponent />
        </Box>
    );
};

export default SupplierDashboard;
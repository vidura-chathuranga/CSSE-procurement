import axios from "axios";

const BASE_URL = "http://localhost:8090";

const supplier = JSON.parse(localStorage.getItem("supplier") || "{}");
class SupplierAPI {

    static supplierLogin(email: string, password: string) {
        let credentials = {
            email: email,
            password: password,
        };

        return axios.post(`${BASE_URL}/supplier/login`, credentials);
    }

    static getAcceptedOrders() {
        return axios.get(`${BASE_URL}/orders/accepted`, {
            headers: {
                Authorization: "Bearer " + supplier.accessToken || "",
                "Content-type": "application/json",
            },
        });
    }

    static orderAcceptedBySupplier(orderId: string) {
        return axios.put(`${BASE_URL}/supplier/order/accept/${orderId}`, {}, {
            headers: {
                Authorization: "Bearer " + supplier.accessToken || "",
                "Content-type": "application/json",
            },
        });
    }

    static orderDeclinedBySupplier(orderId: string) {
        return axios.put(`${BASE_URL}/supplier/order/decline/${orderId}`, {}, {
            headers: {
                Authorization: "Bearer " + supplier.accessToken || "",
                "Content-type": "application/json",
            },
        });
    }


}

export default SupplierAPI;
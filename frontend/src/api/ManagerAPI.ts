import axios from "axios";
import requestConfig from "./config";
import requestConfigJson from "./configJson";
import { PurchaceOrderItems } from "../components/ManageOrders";

const BASE_URL = "http://localhost:8090";

class ManagerAPI {
  static managerLogin = (email: string, password: string) => {
    let credentials = {
      email: email,
      password: password,
    };

    return axios.post(`${BASE_URL}/manager/login`, credentials);
  };

  //get all managers
  static getManagers = () => {
    return axios.get(`${BASE_URL}/manager`, requestConfig);
  };

  //add a new manager
  static addManager = (values: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: string;
  }) => {
    return axios.post(`${BASE_URL}/manager`, values, requestConfigJson);
  };

  //update a manager
  static editManagers = (values: {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: string;
  }) => {
    const manager = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role,
    };
    return axios.put(
      `${BASE_URL}/manager/${values.id}`,
      manager,
      requestConfigJson
    );
  };

  //delete a manager
  static deleteManager = (id: string) => {
    return axios.delete(`${BASE_URL}/manager/${id}`, requestConfig);
  };

  //get all suppliers
  static getSuppliers = () => {
    return axios.get(`${BASE_URL}/supplier`, requestConfig);
  };

  //add a new supplier
  static addSupplier = (values: {
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    return axios.post(`${BASE_URL}/supplier`, values, requestConfigJson);
  };

  //update a supplier
  static editSupplier = (values: {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
  }) => {
    const supplier = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      address: values.address,
    };
    return axios.put(
      `${BASE_URL}/supplier/${values.id}`,
      supplier,
      requestConfigJson
    );
  };

  //delete a supplier
  static deleteSupplier = (id: string) => {
    return axios.delete(`${BASE_URL}/supplier/${id}`, requestConfig);
  };

  //get all products
  static getProducts = () => {
    return axios.get(`${BASE_URL}/product`, requestConfig);
  };

  //add a new product
  static addProduct = (values: {
    name: string;
    price: string;
    description: string;
    supplier: string;
    image: string;
  }) => {
    return axios.post(`${BASE_URL}/product`, values, requestConfigJson);
  };

  //update a product
  static editProduct = (values: {
    id: string;
    name: string;
    price: string;
    description: string;
    supplier: string;
    image: string;
  }) => {
    const product = {
      name: values.name,
      price: values.price,
      description: values.description,
      supplier: values.supplier,
      image: values.image,
    };
    return axios.put(
      `${BASE_URL}/product/${values.id}`,
      product,
      requestConfigJson
    );
  };

  //delete a product
  static deleteProduct = (id: string) => {
    return axios.delete(`${BASE_URL}/product/${id}`, requestConfig);
  };

  //get all sites
  static getSites = () => {
    return axios.get(`${BASE_URL}/site`, requestConfig);
  };

  //add a new site
  static addSite = (values: {
    name: string;
    address: string;
    phone: string;
    manager: string;
    status: string;
  }) => {
    return axios.post(`${BASE_URL}/site`, values, requestConfigJson);
  };

  //update a site
  static editSite = (values: {
    id: string;
    name: string;
    address: string;
    phone: string;
    manager: string;
    status: string;
  }) => {
    const site = {
      name: values.name,
      address: values.address,
      phone: values.phone,
      manager: values.manager,
      status: values.status,
    };
    return axios.put(`${BASE_URL}/site/${values.id}`, site, requestConfigJson);
  };

  //delete a site
  static deleteSite = (id: string) => {
    return axios.delete(`${BASE_URL}/site/${id}`, requestConfig);
  };

  //get all orders
  static getOrders = () => {
    return axios.get(`${BASE_URL}/order`, requestConfig);
  };

  //add a new order
  static addOrder = (values: {
    products: PurchaceOrderItems[];
    deliveryDate: string;
    site: string;
    status: string;
    specialNotes: string;
    updatedBy: string;
  }) => {
    return axios.post(`${BASE_URL}/order`, values, requestConfigJson);
  };

  //update a order
  static editOrder = (values: {
    id: string;
    products: PurchaceOrderItems[];
    deliveryDate: string;
    site: string;
    status: string;
    specialNotes: string;
    updatedBy: string;
  }) => {
    const order = {
      products: values.products,
      delivryDate: values.deliveryDate,
      site: values.site,
      status: values.status,
      specialNotes: values.specialNotes,
      updatedBy: values.updatedBy,
    };
    return axios.put(
      `${BASE_URL}/order/${values.id}`,
      order,
      requestConfigJson
    );
  };

  //delete a order
  static deleteOrder = (id: string) => {
    return axios.delete(`${BASE_URL}/order/${id}`, requestConfig);
  };
}
export default ManagerAPI;

import supplierService from "../services/Supplier.service";
import supplier from "../models/Supplier.model";
import bcrypt from "bcryptjs";

//insert supplier
export const insertSupplier = async (req, res, next) => {
  console.log(req.body.password);
  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create supplier object
  const supplierObj = new supplier({
    name: req.body.name,
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address,
    password: hashedPassword,
    role: "SUPPLIER",
  });

  await supplierService
    .insertSupplier(supplierObj)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

//get all supplier
export const getAllSupplier = async (req, res, next) => {
  await supplierService
    .getAllSupplier()
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

//get supplier by id
export const getSupplierById = async (req, res, next) => {
  await supplierService
    .getSupplierById(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

//update supplier by id
export const updateSupplierById = async (req, res, next) => {
  await supplierService
    .updateSupplierById(req.params.id, req.body)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

//delete supplier by id
export const deleteSupplierById = async (req, res, next) => {
  await supplierService
    .deleteSupplierById(req.params.id)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};

export const supplierLogin = async (req, res, next) => {
  await supplierService
    .supplierLogin(req.body.email, req.body.password)
    .then((data) => {
      req.handleResponse.successRespond(res)(data);
      next();
    })
    .catch((err) => {
      req.handleResponse.errorRespond(res)(err);
      next();
    });
};


module.exports = {
  insertSupplier,
  getAllSupplier,
  getSupplierById,
  updateSupplierById,
  deleteSupplierById,
  supplierLogin,
};

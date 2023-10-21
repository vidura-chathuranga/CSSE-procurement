import supplier from "../models/Supplier.model";
import "dotenv/config";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import order from "../models/Order.model";

//insert supplier
export const insertSupplier = async (supplierObj) => {
  //check if email already exists
  const emailExists = await supplier.findOne({ email: supplierObj.email });
  if (emailExists) {
    throw new Error("Email already exists");
  } else {
    return await supplier
      .create(supplierObj)
      .then(async (data) => {
        await data.save();
        return data;
      })
      .catch((err) => {
        throw new Error(err.message);
      });
  }
};

//get all supplier
export const getAllSupplier = async () => {
  return await supplier
    .find()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

//get supplier by id
export const getSupplierById = async (id) => {
  return await supplier
    .findById(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Supplier not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

//update supplier by id
export const updateSupplierById = async (id, supplierObj) => {
  return await supplier
    .findByIdAndUpdate(id, supplierObj, { new: true })
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Supplier not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

//delete supplier by id
export const deleteSupplierById = async (id) => {
  return await supplier
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("Supplier not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const supplierLogin = async (email, password) => {
  ///print email and password
  return await supplier
    .findOne({ email })
    .then((data) => {
      if (data) {
        if (bcrypt.compareSync(password, data.password)) {
          const accessToken = jwt.sign(
            {
              _id: data._id,
              role: data.role,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "1d",
            }
          );
          //create response object
          const responseObj = {
            _id: data._id,
            name: data.name,
            phone: data.phone,
            email: data.email,
            role: data.role,
            accessToken: accessToken,
          };
          return responseObj;
        } else {
          throw new Error("Invalid Login Credentials");
        }
      } else {
        throw new Error("Invalid Login Credentials");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
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

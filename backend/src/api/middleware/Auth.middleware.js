import jwt from "jsonwebtoken";
import manager from "../models/Manager.model.js";
import supplier from "../models/Supplier.model.js";

//Protect Manager routes
export const managerProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (
        decoded.role !== "MANAGER" &&
        decoded.role !== "SITE_MANAGER" &&
        decoded.role !== "PROCUREMENT_STAFF" &&
        decoded.role !== "SUPPLIER"
      ) {
        return res
          .status(401)
          .json({ message: "Not authorized to access this route" });
      } else {
        if (
          decoded.role === "MANAGER" ||
          decoded.role === "SITE_MANAGER" ||
          decoded.role === "PROCUREMENT_STAFF"
        ) {
          req.manager = await manager.findById(decoded._id).select("-password");
        }
        if (decoded.role === "SUPPLIER") {
          req.supplier = await supplier
            .findById(decoded._id)
            .select("-password");
        }

        next();
      }
    } catch (error) {
      console.log(error.message);
      
      res.status(401);
      req.handleResponse.unauthorizedRespond(res)(
        "Not authorized to access this route"
      );
    }
  }
  if (!token) {
    res.status(401);
    req.handleResponse.unauthorizedRespond(res)(
      "Not authorized to access this route"
    );
  }
};

//Protect Manager routes
export const siteManagerProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.role !== "SITE_MANAGER") {
        return res
          .status(401)
          .json({ message: "Not authorized to access this route" });
      } else {
        req.manager = await manager.findById(decoded._id).select("-password");
        next();
      }
    } catch (error) {
      res.status(401);
      req.handleResponse.unauthorizedRespond(res)(
        "Not authorized to access this route"
      );
    }
  }
  if (!token) {
    res.status(401);
    req.handleResponse.unauthorizedRespond(res)(
      "Not authorized to access this route"
    );
  }
};

// supplire validation middleware function
export const supplierProtect = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.role !== "SUPPLIER") {
        return res
          .status(401)
          .json({ message: "Not authorized to access this route" });
      } else {
        req.supplier = await supplier
          .findById(decoded._id)
          .select("-password");
        next();
      }
    } catch (error) {
      res.status(401);
      req.handleResponse.unauthorizedRespond(res)(
        "Not authorized to access this route"
      );
    }
  }
  if (!token) {

    res.status(401);
    req.handleResponse.unauthorizedRespond(res)(
      "Not authorized to access this route"
    );
  }
};
module.exports = { managerProtect, siteManagerProtect, supplierProtect };

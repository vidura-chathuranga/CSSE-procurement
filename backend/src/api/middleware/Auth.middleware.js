import jwt from "jsonwebtoken";
import manager from "../models/Manager.model.js";

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
        decoded.role !== "PROCUREMENT_STAFF"
      ) {
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

module.exports = { managerProtect, siteManagerProtect };

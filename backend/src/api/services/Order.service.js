import order from "../models/Order.model";
import "dotenv/config";

//insert order
export const insertOrder = async (orderObj) => {
  return await order
    .create(orderObj)
    .then(async (data) => {
      await data.save();
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

//get all order
export const getAllOrders = async () => {
  return await order
    .find()
    .then((data) => {
      return data;
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

//get order by id
export const getOrderById = async (id) => {
  return await order
    .findById(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("order not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

//update order by id
export const updateOrderById = async (id, orderObj) => {
  return await order
    .findByIdAndUpdate(id, orderObj, { new: true })
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("order not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

//delete order by id
export const deleteOrderById = async (id) => {
  return await order
    .findByIdAndDelete(id)
    .then((data) => {
      if (data) {
        return data;
      } else {
        throw new Error("order not found");
      }
    })
    .catch((err) => {
      throw new Error(err.message);
    });
};

export const getApprovedOrders = async () => {
  try {
    // returning order data which approved by the procument staff
    return await order.find({
      $or: [
        { status: "APPROVED" },
        { status: "SUP_APPROVED" },
        { status: "SUP_DECLINED" },
      ],
    });
  } catch (error) {
    throw new Error(error.message);
  }
};

export const orderAcceptedBySupplier = async (orderId) => {
  try {
    return await order.findOneAndUpdate(
      { _id: orderId },
      { status: "SUP_APPROVED" },
      { new: true }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};

export const orderDeclinedBySupplier = async (orderId) => {
  try {
    return await order.findOneAndUpdate(
      { _id: orderId },
      { status: "SUP_DECLINED" },
      { new: true }
    );
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  insertOrder,
  getAllOrders,
  getOrderById,
  updateOrderById,
  deleteOrderById,
  getApprovedOrders,
  orderAcceptedBySupplier,
  orderDeclinedBySupplier,
};

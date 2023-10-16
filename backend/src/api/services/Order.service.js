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

module.exports = {
    insertOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrderById
}
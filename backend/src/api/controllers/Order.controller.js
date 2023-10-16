import orderService from "../services/Order.service";

//insert order
export const insertOrder = async (req, res, next) => {
	await orderService
		.insertOrder(req.body)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//get all order
export const getAllOrders = async (req, res, next) => {
	await orderService
		.getAllOrders()
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//get order by id
export const getOrderById = async (req, res, next) => {
	await orderService
		.getorderById(req.params.id)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//update order by id
export const updateOrderById = async (req, res, next) => {
	await orderService
		.updateOrderById(req.params.id, req.body)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//delete order by id
export const deleteOrderById = async (req, res, next) => {
	await orderService
		.deleteOrderById(req.params.id)
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
    insertOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrderById
}

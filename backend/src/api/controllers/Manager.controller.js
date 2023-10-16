import managerService from "../services/Manager.service";
import manager from "../models/Manager.model";
import bcrypt from "bcryptjs";

//insert manager
export const insertManager = async (req, res, next) => {
    //hash password
	const salt = await bcrypt.genSalt(10);
	const hashedPassword = await bcrypt.hash(req.body.password, salt);
	//create manager object
	const managerObj = new manager({
		name: req.body.name,
        phone: req.body.phone,
		email: req.body.email,
		password: hashedPassword,
		role: req.body.role,
	});

	await managerService
		.insertManager(managerObj)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//get all manager
export const getAllManager = async (req, res, next) => {
	await managerService
		.getAllManager()
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//get manager by id
export const getManagerById = async (req, res, next) => {
	await managerService
		.getManagerById(req.params.id)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//update manager by id
export const updateManagerById = async (req, res, next) => {
	await managerService
		.updateManagerById(req.params.id, req.body)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//delete manager by id
export const deleteManagerById = async (req, res, next) => {
	await managerService
		.deleteManagerById(req.params.id)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//login manager
export const loginManager = async (req, res, next) => {
	await managerService
		.loginManager(req.body.email, req.body.password)
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
    insertManager,
    getAllManager,
    getManagerById,
    updateManagerById,
    deleteManagerById,
    loginManager,
};
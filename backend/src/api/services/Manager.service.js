import manager from "../models/Manager.model";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import "dotenv/config";

//insert manager
export const insertManager = async (managerObj) => {
	//check if email already exists
	const emailExists = await manager.findOne({ email: managerObj.email });
	if (emailExists) {
		throw new Error("Email already exists");
	} else {
		return await manager
			.create(managerObj)
			.then(async (data) => {
				await data.save();
				return data;
			})
			.catch((err) => {
				throw new Error(err.message);
			});
	}
};

//get all manager
export const getAllManager = async () => {
	return await manager
		.find()
		.then((data) => {
			return data;
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//get manager by id
export const getManagerById = async (id) => {
	return await manager
		.findById(id)
		.then((data) => {
			if (data) {
				return data;
			} else {
				throw new Error("Manager not found");
			}
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//update manager by id
export const updateManagerById = async (id, managerObj) => {
	return await manager
		.findByIdAndUpdate(id, managerObj, { new: true })
		.then((data) => {
			if (data) {
				return data;
			} else {
				throw new Error("Manager not found");
			}
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//delete manager by id
export const deleteManagerById = async (id) => {
	return await manager
		.findByIdAndDelete(id)
		.then((data) => {
			if (data) {
				return data;
			} else {
				throw new Error("Manager not found");
			}
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//login manager
export const loginManager = async (email, password) => {
	console.log(password);

	///print email and password
	return await manager
		.findOne({ email })
		.then((data) => {
			if (data) {
				console.log(data);
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
			console.log(err.message)
			throw new Error(err.message);
		});
};

module.exports = {
    insertManager,
    getAllManager,
    getManagerById,
    updateManagerById,
    deleteManagerById,
    loginManager
}
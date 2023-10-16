import supplier from "../models/Supplier.model";
import "dotenv/config";

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

module.exports = {
    insertSupplier,
    getAllSupplier,
    getSupplierById,
    updateSupplierById,
    deleteSupplierById,
};
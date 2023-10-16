import product from "../models/Product.model";
import "dotenv/config";

//insert product
export const insertProduct = async (productObj) => {
	return await product
			.create(productObj)
			.then(async (data) => {
				await data.save();
				return data;
			})
			.catch((err) => {
				throw new Error(err.message);
			});
};

//get all product
export const getAllProduct = async () => {
	return await product
		.find()
		.then((data) => {
			return data;
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//get product by id
export const getProductById = async (id) => {
	return await product
		.findById(id)
		.then((data) => {
			if (data) {
				return data;
			} else {
				throw new Error("Product not found");
			}
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//update product by id
export const updateProductById = async (id, productObj) => {
	return await product
		.findByIdAndUpdate(id, productObj, { new: true })
		.then((data) => {
			if (data) {
				return data;
			} else {
				throw new Error("Product not found");
			}
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//delete product by id
export const deleteProductById = async (id) => {
	return await product
		.findByIdAndDelete(id)
		.then((data) => {
			if (data) {
				return data;
			} else {
				throw new Error("Product not found");
			}
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

module.exports = {
    insertProduct,
    getAllProduct,
    getProductById,
    updateProductById,
    deleteProductById
};
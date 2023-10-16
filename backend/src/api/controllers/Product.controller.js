import productService from "../services/Product.service";
import product from "../models/Product.model";

//insert product
export const insertProduct = async (req, res, next) => {
	//create product object
	const productObj = new product({
		name: req.body.name,
        price: req.body.price,
        description: req.body.description,
        supplier: req.body.supplier,
        image: req.body.image,
	});

	await productService
		.insertProduct(productObj)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//get all product
export const getAllProduct = async (req, res, next) => {
	await productService
		.getAllProduct()
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//get product by id
export const getProductById = async (req, res, next) => {
	await productService
		.getProductById(req.params.id)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//update product by id
export const updateProductById = async (req, res, next) => {
	await productService
		.updateProductById(req.params.id, req.body)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//delete product by id
export const deleteProductById = async (req, res, next) => {
	await productService
		.deleteProductById(req.params.id)
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
    insertProduct,
    getAllProduct,
    getProductById,
    updateProductById,
    deleteProductById
}

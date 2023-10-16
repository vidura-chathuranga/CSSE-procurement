import siteService from "../services/Site.service";
import site from "../models/Site.model";

//insert site
export const insertSite = async (req, res, next) => {
	//create site object
	const siteObj = new site({
		name: req.body.name,
        address: req.body.address,
        phone: req.body.phone,
		manager: req.body.manager,
	});

	await siteService
		.insertSite(siteObj)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//get all site
export const getAllSite = async (req, res, next) => {
	await siteService
		.getAllSite()
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//get site by id
export const getSiteById = async (req, res, next) => {
	await siteService
		.getSiteById(req.params.id)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//update site by id
export const updateSiteById = async (req, res, next) => {
	await siteService
		.updateSiteById(req.params.id, req.body)
		.then((data) => {
			req.handleResponse.successRespond(res)(data);
			next();
		})
		.catch((err) => {
			req.handleResponse.errorRespond(res)(err);
			next();
		});
};

//delete site by id
export const deleteSiteById = async (req, res, next) => {
	await siteService
		.deleteSiteById(req.params.id)
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
    insertSite,
    getAllSite,
    getSiteById,
    updateSiteById,
    deleteSiteById
}

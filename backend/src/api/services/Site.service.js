import site from "../models/Site.model";
import "dotenv/config";

//insert site
export const insertSite = async (siteObj) => {
	return await site
			.create(siteObj)
			.then(async (data) => {
				await data.save();
				return data;
			})
			.catch((err) => {
				throw new Error(err.message);
			});
};

//get all site
export const getAllSite = async () => {
	return await site
		.find()
		.then((data) => {
			return data;
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//get site by id
export const getSiteById = async (id) => {
	return await site
		.findById(id)
		.then((data) => {
			if (data) {
				return data;
			} else {
				throw new Error("Site not found");
			}
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//update site by id
export const updateSiteById = async (id, siteObj) => {
	return await site
		.findByIdAndUpdate(id, siteObj, { new: true })
		.then((data) => {
			if (data) {
				return data;
			} else {
				throw new Error("Site not found");
			}
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

//delete site by id
export const deleteSiteById = async (id) => {
	return await site
		.findByIdAndDelete(id)
		.then((data) => {
			if (data) {
				return data;
			} else {
				throw new Error("site not found");
			}
		})
		.catch((err) => {
			throw new Error(err.message);
		});
};

module.exports = {
    insertSite,
    getAllSite,
    getSiteById,
    updateSiteById,
    deleteSiteById
};
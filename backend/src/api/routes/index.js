import managerController from '../controllers/Manager.controller';
import supplierController from '../controllers/Supplier.controller';
import siteController from '../controllers/Site.controller';
import productController from '../controllers/Product.controller';
import orderController from '../controllers/Order.controller';
import protect from "../middleware/Auth.middleware";

const routes = (app) => {
  // Manager routes
  	app.post( "/manager/login", managerController.loginManager );
 	app.post("/manager", protect.managerProtect, managerController.insertManager);
	app.get("/manager", protect.managerProtect, managerController.getAllManager);
	app.get("/manager/:id", protect.managerProtect, managerController.getManagerById);
	app.put("/manager/:id", protect.managerProtect, managerController.updateManagerById);
	app.delete("/manager/:id", protect.managerProtect, managerController.deleteManagerById);

	// Supplier routes
	app.post("/supplier", protect.managerProtect, supplierController.insertSupplier);
	app.get("/supplier", protect.managerProtect, supplierController.getAllSupplier);
	app.get("/supplier/:id", protect.managerProtect, supplierController.getSupplierById);
	app.put("/supplier/:id", protect.managerProtect, supplierController.updateSupplierById);
	app.delete("/supplier/:id", protect.managerProtect, supplierController.deleteSupplierById);
	app.post("/supplier/login",supplierController.supplierLogin);

	// Site routes
	app.post("/site", protect.managerProtect, siteController.insertSite);
	app.get("/site", protect.managerProtect, siteController.getAllSite);
	app.get("/site/:id", protect.managerProtect, siteController.getSiteById);
	app.put("/site/:id", protect.managerProtect, siteController.updateSiteById);
	app.delete("/site/:id", protect.managerProtect, siteController.deleteSiteById);

	// Product routes
	app.post("/product", protect.managerProtect, productController.insertProduct);
	app.get("/product", protect.managerProtect, productController.getAllProduct);
	app.get("/product/:id", protect.managerProtect, productController.getProductById);
	app.put("/product/:id", protect.managerProtect, productController.updateProductById);
	app.delete("/product/:id", protect.managerProtect, productController.deleteProductById);

	// Order routes
	app.post("/order", protect.managerProtect, orderController.insertOrder);
	app.get("/order", protect.managerProtect, orderController.getAllOrders);
	app.get("/order/:id", protect.managerProtect, orderController.getOrderById);
	app.put("/order/:id", protect.managerProtect, orderController.updateOrderById);
	app.delete("/order/:id", protect.managerProtect, orderController.deleteOrderById);
	app.get("/orders/accepted",protect.supplierProtect,orderController.getApprovedOrders);
	app.put("/supplier/order/accept/:orderId",protect.supplierProtect,orderController.orderAcceptedBySupplier);
	app.put("/supplier/order/decline/:orderId",protect.supplierProtect,orderController.orderDeclinedBySupplier);
};

export default routes;
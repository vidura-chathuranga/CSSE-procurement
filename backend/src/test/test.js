import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";

// import { model, Schema } from "mongoose";

// const OrderSchema = new Schema(
//   {
//     id: {
//       type: Schema.Types.ObjectId,
//     },
//     products: [
//       {
//         product: {
//           type: Schema.Types.ObjectId,
//           ref: "Product",
//         },
//         quantity: {
//           type: Number,
//           required: true,
//         },
//       },
//     ],
//     deliveryDate: {
//       type: Date,
//       required: true,
//     },
//     site: {
//       type: Schema.Types.ObjectId,
//       ref: "Site",
//     },
//     status: {
//       type: String,
//       required: true,
//     },
//     specialNotes: {
//       type: String,
//       required: true,
//     },
//     updatedBy: {
//       type: Schema.Types.ObjectId,
//       ref: "Manager",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// export default model("Order", OrderSchema);

// Order routes
// app.post("/order", protect.managerProtect, orderController.insertOrder);
// app.get("/order", protect.managerProtect, orderController.getAllOrders);
// app.get("/order/:id", protect.managerProtect, orderController.getOrderById);
// app.put("/order/:id", protect.managerProtect, orderController.updateOrderById);
// app.delete("/order/:id", protect.managerProtect, orderController.deleteOrderById);
// login
// app.post( "/manager/login", managerController.loginManager );

// Configure chai
chai.use(chaiHttp);
const { expect } = chai;

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTJmZDY3Mzk0YmZkZjNjMWY0ODY4ZWUiLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTY5NzgyMjA0NSwiZXhwIjoxNjk3OTA4NDQ1fQ.h7u6N-TKpaUyiyFFHPdETtje6_neC9lSmzD0KJeDs6A";

describe("Orders", () => {
  //GET all orders
  describe("GET /order", () => {
    it("should get all orders record", (done) => {
      chai
        .request(app)
        .get("/order")
        .set("Authorization", token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  //create order
  let order = {};
  const orderObj = {
    products: [
      {
        product: "613c2b5a3d9e5a4e8c9d3d4b",
        quantity: 1,
      },
    ],
    deliveryDate: "2021-09-12",
    site: "613c2b5a3d9e5a4e8c9d3d4b",
    status: "PENDING",
    specialNotes: "none",
    updatedBy: "613c2b5a3d9e5a4e8c9d3d4b",
  };
  describe("POST /order", () => {
    it("should create an order", (done) => {
      chai
        .request(app)
        .post("/order")
        .send(orderObj)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          order = res.body;
          done();
        });
    });
  });

  //create order without token
  describe("POST /order", () => {
    it("should not create an order without token", (done) => {
      chai
        .request(app)
        .post("/order")
        .send(orderObj)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  //create order with invalid token
  describe("POST /order", () => {
    it("should not create an order with invalid token", (done) => {
      chai
        .request(app)
        .post("/order")
        .send(orderObj)
        .set("Authorization", `Bearer invalidtoken`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  //get order by id
  describe("GET /order/:id", () => {
    it("should get an order by ID", (done) => {
      const orderId = order._id;
      chai
        .request(app)
        .get(`/order/${orderId}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });

  //get order with invalid id
  describe("GET /order/:id", () => {
    it("should not get an order with invalid ID", (done) => {
      const orderId = "invalid_id";
      chai
        .request(app)
        .get(`/order/${orderId}`)
        .set("Authorization", `Bearer invalid_token_here`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  //get order by id without token
  describe("GET /order/:id", () => {
    it("should not get an order without token", (done) => {
      const orderId = order._id;
      chai
        .request(app)
        .get(`/order/${orderId}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  //update order by id
  describe("PUT /order/:id", () => {
    it("should update an order by ID", (done) => {
      const orderId = order._id;
      chai
        .request(app)
        .put(`/order/${orderId}`)
        .send(orderObj)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });

  //update order with invalid id
  describe("PUT /order/:id", () => {
    it("should not update an order with invalid ID", (done) => {
      const orderId = "invalid_id";
      chai
        .request(app)
        .put(`/order/${orderId}`)
        .send(orderObj)
        .set("Authorization", `Bearer invalid_token_here`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  //update order by id without token
  describe("PUT /order/:id", () => {
    it("should not update an order without token", (done) => {
      const orderId = order._id;
      chai
        .request(app)
        .put(`/order/${orderId}`)
        .send(orderObj)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  //delete order by id
  describe("DELETE /order/:id", () => {
    it("should delete an order by ID", (done) => {
      const orderId = order._id;
      chai
        .request(app)
        .delete(`/order/${orderId}`)
        .set("Authorization", token)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  //delete order with invalid id
  describe("DELETE /order/:id", () => {
    it("should not delete an order with invalid ID", (done) => {
      const orderId = "invalid_id";
      chai
        .request(app)
        .delete(`/order/${orderId}`)
        .set("Authorization", `Bearer invalid_token_here`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });

  //delete order by id without token
  describe("DELETE /order/:id", () => {
    it("should not delete an order without token", (done) => {
      const orderId = order._id;
      chai
        .request(app)
        .delete(`/order/${orderId}`)
        .end((err, res) => {
          expect(res).to.have.status(401);
          done();
        });
    });
  });
});

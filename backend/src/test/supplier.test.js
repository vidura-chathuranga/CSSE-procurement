import chai from "chai";
import chaiHttp from "chai-http";
import app from "../app";

chai.use(chaiHttp);
const { expect } = chai;

const validToken =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTJkMzI4ODBmNzc2YWNiZGEyNTA2NWEiLCJyb2xlIjoiTUFOQUdFUiIsImlhdCI6MTY5Nzg1Njg1NCwiZXhwIjoxNjk3OTQzMjU0fQ.IaQ_dSTrL3vqTQ3dzfdTDrvcV_pvQT4oqtu-HpAeJoQ";

describe("Supplier Routes", () => {
  // Test for creating a new supplier
  describe("POST /supplier", () => {
    it("should create a new supplier", (done) => {
      const newSupplier = {
        name: "Sample Supplier",
        phone: "123-456-7890",
        email: "sample@supplier.com",
        address: "123 Sample St",
        password: "123",
      };
      chai
        .request(app)
        .post("/supplier")
        .set("Authorization", validToken)
        .send(newSupplier)
        .end((err, res) => {
          expect(res).to.have.status(201);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });

  // Test for getting all suppliers
  describe("GET /supplier", () => {
    it("should get all suppliers", (done) => {
      chai
        .request(app)
        .get("/supplier")
        .set("Authorization", validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("array");
          done();
        });
    });
  });

  // Test for getting a supplier by ID
  describe("GET /supplier/:id", () => {
    it("should get a supplier by ID", (done) => {
      const supplierId = "6532ab052376a937ba912967"; 

      chai
        .request(app)
        .get(`/supplier/${supplierId}`)
        .set("Authorization", validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });

  // Test for updating a supplier by ID
  describe("PUT /supplier/:id", () => {
    it("should update a supplier by ID", (done) => {
      const supplierId = "6532ab052376a937ba912967"; // Replace with a valid supplier ID
      const updatedSupplierData = {
        name: "Updated Supplier Name",
        phone: "987-654-3210",
        address: "Updated Address",
      };

      chai
        .request(app)
        .put(`/supplier/${supplierId}`)
        .set("Authorization", validToken)
        .send(updatedSupplierData)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an("object");
          done();
        });
    });
  });

  // Test for deleting a supplier by ID
  describe("DELETE /supplier/:id", () => {
    it("should delete a supplier by ID", (done) => {
      const supplierId = "6532ab052376a937ba912967"; 

      chai
        .request(app)
        .delete(`/supplier/${supplierId}`)
        .set("Authorization", validToken)
        .end((err, res) => {
          expect(res).to.have.status(200);
          done();
        });
    });
  });

  // Test for supplier login
  describe("POST /supplier/login", () => {
    it("should log in a supplier and return a valid token", (done) => {
      const loginCredentials = {
        email: "sample@supplier.com",
        password: "password123", 
      };

      chai
        .request(app)
        .post("/supplier/login")
        .send(loginCredentials)
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.have.property("accessToken");
          done();
        });
    });
  });
});

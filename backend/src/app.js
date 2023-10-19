import express from "express";
import cors from "cors";
import logger from "./utils/logger";
import "dotenv/config";
import responseHandler from "./utils/response.handler";
import { connect } from "./utils/database.connection";
import routes from "./api/routes";

const app = express();
const PORT = process.env.PORT || "8090";

// Register Middleware Chain
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Inject Response Handler
app.use((req, res, next) => {
  req.handleResponse = responseHandler;
  next();
});

//Handle Root API Call
app.get("/", (req, res, next) => {
  res.send(
    "<title>Procurement System API</title><h2>Welcome to the Procurement System API</h2>"
  );
  next();
});

//Start the Server
app.listen(PORT, () => {
  logger.info(`Server started on port ${PORT}`);
  connect();
  routes(app);
});

export default app;

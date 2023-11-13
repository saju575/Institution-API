const express = require("express");
const createHttpError = require("http-errors");
const xssClean = require("xss-clean");
const cookies = require("cookie-parser");
const cors = require("cors");

const { errorResponse } = require("./controllers/response/response.controller");
const administratorRoute = require("./routers/administrator.route");
const newsRoute = require("./routers/news.route");
const adminRoute = require("./routers/admin.route");
const layoutRoute = require("./routers/layout.route");
const resultRoute = require("./routers/studentsResult.route");

/* 
    making app
*/
const app = express();

/* 
    middlewares
*/
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://institution-admin-panel.netlify.app",
      "https://institution-client.netlify.app",
    ],
    credentials: true,
  })
);
app.use(xssClean());
app.use(cookies());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* 
  end point using
*/

/* 
  administrator route
*/
app.use("/api/v1/administrator", administratorRoute);

/* 
  news route
*/
app.use("/api/v1/news", newsRoute);

/* 
  admin route
*/
app.use("/api/v1/admin", adminRoute);

/* 
  layout route
*/
app.use("/api/v1/layout", layoutRoute);

/* 
  result route
*/
app.use("/api/v1/students-result", resultRoute);

/*
    Client error handler
 */
app.use((req, res, next) => {
  next(createHttpError(404, "Route Not Found"));
});

/*
    Server error handler
    -> all the error comes here
*/
app.use((err, req, res, next) => {
  return errorResponse(res, { statusCode: err.status, message: err.message });
});

module.exports = app;

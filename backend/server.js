require("dotenv");
const express = require("express");
const configViewEngine = require("./config/viewEngine");
const apiRoutes = require("./routes/api");
const connection = require("./config/database");

const cors = require("cors");

const app = express();
const port = process.env.PORT || 3001;

const http = require("http");
const server = http.createServer(app);

const cookieParser = require('cookie-parser');
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:3002",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

configViewEngine(app);

const webAPI = express.Router();

app.use("/", webAPI);

app.use("/", apiRoutes);

connection();
server.listen(port, () =>
  console.log(`WebSocket server chạy tại http://localhost:${port}`)
);

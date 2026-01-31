import express from "express";
import "dotenv/config";

import swaggerUi from "swagger-ui-express";
import {swaggerSpec} from "./swaggerOptions.js"


const app = express();
const PORT = process.env.PORT || 5000;
import bodyParser from "body-parser";

import "./src/db/conn.mjs";

import {
  publicRouter,
  secureRouter,
  privateRouter,
  // commonRouter,
  // chatRouter,
} from "./src/routes/index.js";

import cors from "cors";

// Middleware
const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://vynko-adminpanel.vercel.app",
    "https://vynko-main.vercel.app",
    
  ],
  optionsSuccessStatus: 200,
  credentials: true // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/", publicRouter);
app.use("/private", privateRouter);
app.use("/secure", secureRouter);

// Routes
// const exampleRoute = require('./routes/exampleRoute');
// app.use('/api/example', exampleRoute);

app.get('/', (req, res) => {
  res.send('Vynko Backend is working 🚀');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

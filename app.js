import express from "express";
import "dotenv/config";


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

// Middleware
// app.use(cors());



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


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

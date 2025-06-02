import mongoose from "mongoose";
import Config from "../../config.js";

// Set the environment variable (default to development if not set)
const env = process.env.ENVIRONMENT || "development";

// Mongoose connection options
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true, // This option is no longer needed as of Mongoose 6.x
};

// Connect to MongoDB using the environment-specific configuration
mongoose.set("strictQuery", true);


try {
    await mongoose.connect(Config[env].db, options);
    console.info("MongoDB Connection Success");
  } catch (err) {
    console.error("MongoDB Connection Error:", err);
  }

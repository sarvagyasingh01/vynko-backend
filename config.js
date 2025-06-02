const Config = {
    // production: {
    //   // PRODUCTION DATABASE
    //   db: process.env.DATABASE_URL,
    //   jwt_secret:
    //     process.env.JWT_SECRET,
    //   port: process.env.PORT,
    //   frontend_BASE_URL: process.env.FRONT_BASE_URL,
    //   backend_BASE_URL: process.env.BACKEND_BASE_URL,
    //   mailsite: "nodemailer",
    // },
    development: {
      // DEVELOPMENT DATABASE
      db: process.env.DATABASE_URL,
      jwt_secret:
        process.env.JWT_SECRET,
      port: process.env.PORT,
    //   frontend_BASE_URL: process.env.FRONT_BASE_URL,
    //   backend_BASE_URL: process.env.BACKEND_BASE_URL,
    //   mailsite: "nodemailer",
    },
    // testing: {
    //   // TESTING DATABASE
    //   db: process.env.DATABASE_URL,
    //   jwt_secret:
    //     process.env.JWT_SECRET,
    //   port: process.env.PORT,
    //   frontend_BASE_URL: process.env.FRONT_BASE_URL,
    //   backend_BASE_URL: process.env.BACKEND_BASE_URL,
    //   mailsite: "nodemailer",
    // },
  };
  
  export default Config;
  
import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API documentation for my Node.js app",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT}`,
      },
    ],
    components: {
      securitySchemes: {
        XAuthToken: {
          type: "apiKey",
          in: "header",
          name: "X-Auth-Token",
          description: "Enter your X-Auth-Token here",
        },
      },
    },
    security: [
      {
        XAuthToken: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };

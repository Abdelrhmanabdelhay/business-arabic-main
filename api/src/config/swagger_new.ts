import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { config } from "./environment";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Business Arabic API",
      version: "1.0.0",
      description: "A comprehensive API for Business Arabic learning platform",
      contact: {
        name: "API Support",
        email: "support@businessarabic.com",
      },
    },
    servers: [
      {
        url: `http://localhost:${config.port}`,
        description: "Development server",
      },
      {
        url: "https://api.businessstorepro.com/",
        description: "Production server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
            },
            statusCode: {
              type: "number",
            },
            status: {
              type: "string",
            },
          },
        },
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            email: {
              type: "string",
              format: "email",
            },
            fullName: {
              type: "string",
            },
            role: {
              type: "string",
              enum: ["user", "admin"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Blog: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            title: {
              type: "string",
            },
            summary: {
              type: "string",
            },
            content: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
              },
              description: "Dynamic content structure",
            },
            image: {
              type: "string",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Post: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            title: {
              type: "string",
            },
            content: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
              },
              description: "Dynamic content structure",
            },
            image: {
              type: "string",
              nullable: true,
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        IdeaClub: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            content: {
              type: "array",
              items: {
                type: "object",
                additionalProperties: true,
              },
              description: "Dynamic content structure",
            },
            category: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        LaunchedProject: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            name: {
              type: "string",
            },
            description: {
              type: "string",
            },
            image: {
              type: "string",
            },
            price: {
              type: "string",
            },
            category: {
              type: "string",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        Plan: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64a3b2c4f91d2a001e5d1234",
            },
            title: {
              type: "string",
              example: "Basic Plan",
            },
            price: {
              type: "number",
              example: 29.99,
            },
            ideas: {
              type: "array",
              description: "List of ideas included in this plan",
              items: {
                type: "string",
              },
              example: ["Idea 1", "Idea 2", "Idea 3"],
            },
            image: {
              type: "string",
              nullable: true,
              example: "https://example.com/plan.jpg",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2023-07-01T12:00:00.000Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2023-07-10T15:30:00.000Z",
            },
          },
        },

        Pagination: {
          type: "object",
          properties: {
            currentPage: {
              type: "integer",
            },
            totalPages: {
              type: "integer",
            },
            totalItems: {
              type: "integer",
            },
            itemsPerPage: {
              type: "integer",
            },
          },
        },
      },
      responses: {
        BadRequest: {
          description: "Bad Request",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "error",
                  },
                  message: {
                    type: "string",
                    example: "Invalid request data",
                  },
                  statusCode: {
                    type: "number",
                    example: 400,
                  },
                },
              },
            },
          },
        },
        Unauthorized: {
          description: "Unauthorized",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "error",
                  },
                  message: {
                    type: "string",
                    example: "Access denied. No token provided.",
                  },
                  statusCode: {
                    type: "number",
                    example: 401,
                  },
                },
              },
            },
          },
        },
        Forbidden: {
          description: "Forbidden",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "error",
                  },
                  message: {
                    type: "string",
                    example: "Access denied. Insufficient permissions.",
                  },
                  statusCode: {
                    type: "number",
                    example: 403,
                  },
                },
              },
            },
          },
        },
        NotFound: {
          description: "Resource not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "error",
                  },
                  message: {
                    type: "string",
                    example: "Resource not found",
                  },
                  statusCode: {
                    type: "number",
                    example: 404,
                  },
                },
              },
            },
          },
        },
        InternalServerError: {
          description: "Internal Server Error",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  status: {
                    type: "string",
                    example: "error",
                  },
                  message: {
                    type: "string",
                    example: "Something went wrong!",
                  },
                  statusCode: {
                    type: "number",
                    example: 500,
                  },
                },
              },
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.ts"], // Path to the API routes
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express): void => {
  app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: ".swagger-ui .topbar { display: none }",
      customSiteTitle: "Business Arabic API Documentation",
    })
  );
};

export default specs;

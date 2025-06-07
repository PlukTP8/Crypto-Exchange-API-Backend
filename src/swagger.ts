// src/swagger.ts
import swaggerJSDoc from 'swagger-jsdoc';

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Crypto Exchange API',
      version: '1.0.0',
      description: 'API documentation for a crypto exchange backend system',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    tags: [
      {
        name: 'User',
        description: 'Endpoints for user authentication'
      },
      {
        name: 'Currency',
        description: 'Currency management'
      },
      {
        name: 'Wallet',
        description: 'Wallet operations'
      },
      {
        name: 'Orders',
        description: 'Order operations'
      },
    ],
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
});

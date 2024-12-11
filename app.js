// app.js

const express = require('express');
const connectDB = require('./config/database');
require('dotenv').config();

const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Initialize Express App
const app = express();

// Connect to MongoDB
connectDB();

// Middleware to parse JSON
app.use(express.json());

// Define Routes
app.use('/api/items', require('./routes/itemRoutes'));

// Swagger Configuration
const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Express MongoDB CRUD API',
      version: '1.0.0',
      description: 'A simple CRUD API application made with Express and MongoDB',
      contact: {
        name: 'Your Name',
      },
      servers: [
        {
          url: `http://localhost:${process.env.PORT || 3000}`,
        },
      ],
    },
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

// **Add Swagger Middleware**
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Home Route
app.get('/', (req, res) => {
  res.send('Welcome to the Express MongoDB CRUD API');
});

// Start the server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
// Import dependency
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
require('dotenv/config');

// Import Helpers
const connectDB = require('./configurations/db');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');

// Settings
const app = express();
const api = process.env.API_URL;
const PORT = process.env.PORT || 8000;

//swagger
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerSpec = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Node E-Commerce API',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: [`${path.join(__dirname, './routes/*.js')}`],
};

// Database Connections Configurations
connectDB();

// Import Routes
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

// Middlewares
app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '100mb' }));
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);
app.use(
    '/api-doc',
    swaggerUI.serve,
    swaggerUI.setup(swaggerJsDoc(swaggerSpec))
);

// Setup routes
app.use(`${api}/auth`, authRoutes);
app.use(`${api}/categories`, categoriesRoutes);
app.use(`${api}/products`, productsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/orders`, ordersRoutes);
app.use((req, res, next) => {
    res.status(404).json({
        msg: 'Not Found',
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

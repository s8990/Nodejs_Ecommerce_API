// Import dependency
require('dotenv/config');
const api = process.env.API_URL;
const PORT = process.env.PORT || 8000;
const express = require('express');
const app = express();
const connectDB = require('./configurations/db');
const morgan = require('morgan');
const cors = require('cors');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/errorHandler');

connectDB();

// Import routes
const authRoutes = require('./routes/auth');
const categoriesRoutes = require('./routes/categories');
const productsRoutes = require('./routes/products');
const usersRoutes = require('./routes/users');
const ordersRoutes = require('./routes/orders');

// Import middlewares into express
app.use(cors());
app.options('*', cors());
app.use(express.json({ limit: '100mb' }));
app.use(morgan('tiny'));
app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

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

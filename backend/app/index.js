import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bodyParser from 'body-parser';

import connectDB from './db/index.js';
import errorHandler from './middlewares/errorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import authorizeCustomer from './middlewares/authorizeCustomer.js';

import categoryRoute from './routes/categories.route.js';
import discountRoute from './routes/discounts.route.js';
import supplierRoute from './routes/suppliers.route.js';
import productRoute from './routes/products.route.js';
import staffRoute from './routes/staffs.route.js';
import customerRoute from './routes/customers.route.js';
import cartRoute from './routes/carts.route.js';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({
    extended: true,
}));
app.use(bodyParser.json());

// routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/discounts', discountRoute);
app.use('/api/v1/suppliers', supplierRoute);
app.use('/api/v1/products', productRoute);
app.use('/api/v1/staffs', staffRoute);
app.use('/api/v1/customers', customerRoute);
app.use('/api/v1/carts', authorizeCustomer, cartRoute);

app.use(errorHandler);
app.use(notFoundHandler);

const port = process.env.PORT || 3000;
const startServer = async () => {
    try {
        const connection = await connectDB();
        if(connection) {
            app.listen(port, () => {
                console.log(`Server is running at port ${port}`);
            });
        }
    }
    catch(error) {
        console.log(error);
    }
}

startServer();

import express from 'express';
import cors from 'cors';
import 'dotenv/config';
// import bodyParser from 'body-parser';

import connectDB from './db/index.js';
import { errorHandler, notFoundHandler } from './middlewares/index.js';
import {
    categoryRoutes,
    customerRoutes,
    discountRoutes,
    orderRoutes,
    productRoutes,
    staffRoutes,
    supplierRoutes,
    accountRoutes,
    paymentMethodRoutes,
    vnpayRoutes,
    statusRoutes,
    ratingsRoutes,
} from './routes/index.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// routes
app.use('/api/v1/accounts', accountRoutes);
app.use('/api/v1/categories', categoryRoutes);
app.use('/api/v1/discounts', discountRoutes);
app.use('/api/v1/suppliers', supplierRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/staffs', staffRoutes);
app.use('/api/v1/customers', customerRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/payment-methods', paymentMethodRoutes);
app.use('/api/v1/status', statusRoutes);
app.use('/api/v1/ratings', ratingsRoutes);

// not work
app.use('/api/v1/payment/vnpay', vnpayRoutes);

// error handlers
app.use(errorHandler);
app.use(notFoundHandler);

const port = process.env.PORT || 3000;
const startServer = async () => {
    try {
        const connection = await connectDB();
        if (connection) {
            app.listen(port, () => {
                console.log(`Server is running at port ${port}`);
            });
        }
    } catch (error) {
        console.log(error);
    }
};

startServer();

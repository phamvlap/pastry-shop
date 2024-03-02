import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import bodyParser from 'body-parser';

import connectDB from './db/index.js';
import errorHandler from './middlewares/errorHandler.js';
import categoryRoute from './routes/categories.route.js';
import discountRoute from './routes/discounts.route.js';
import supplierRoute from './routes/suppliers.route.js';
import productRoute from './routes/products.route.js';
import userRoute from './routes/users.route.js';

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
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);

app.use(errorHandler);

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

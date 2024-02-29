import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './db/index.js';
import categoryRoute from './routes/categories.route.js';
import userRoute from './routes/users.route.js';
import productRoute from './routes/products.route.js';

const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

// routes
app.use('/api/v1/categories', categoryRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/products', productRoute);

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

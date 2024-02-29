import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './db/index.js';

const app = express();

app.use(cors());
app.use(express.urlencoded());
app.use(express.json());

// routes

const port = process.env.PORT || 3000;
const startServer = async () => {
    try {
        const connection = connectDB();
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

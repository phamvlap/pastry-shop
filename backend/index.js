import express from 'express';
import cors from 'cors';
import 'dotenv/config';

const app = express();

app.use(cors());

app.use(express.urlencoded());
app.use(express.json());

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});

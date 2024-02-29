import mysql from 'mysql2/promise';

export default async () => {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME,
        });
        return connection;
    }   
    catch(error){
        console.log(error);
    }
}
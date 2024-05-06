# Pastry Shop

A Website for a Pastry Shop.

## Setup
* Clone this repository:
```
git clone https://github.com/phamvlap/pastry-shop.git
```
* Rename all `.env.example` files in backend, frontend/admin and frontend/client to `.env`
    > Note: Change the values of the environment variables in the `backend/.env` file to match your database configuration.
    ```
    DB_HOST=<your_database_host> (default: localhost)
    DB_USER=<your_database_user> (default: root)
    DB_PASSWORD=<your_database_password> (default: '')
    DB_NAME=pastry_shop
    ```
* Create database and add data
    > **Use MySQL Workbench or any other MySQL client to connect to your MySQL server.**
    * First, execute the SQL script in `data/init.sql` to create the database and tables.
    * Then, execute the SQL script in `data/data.sql` to add data to the database.

## Run
* Install dependencies:
```
cd pastry-shop/backend && npm run startup
```
* Start project:
```
npm start
```
* Open your browser and go to:
    * [http://localhost:4042](http://localhost:4042/) to see the website.
    * [http://localhost:4041/admin](http://localhost:4041/admin) to see the admin page.
    > Note: account to access the admin page: `email: admin@gmail.com, password: admin123`.
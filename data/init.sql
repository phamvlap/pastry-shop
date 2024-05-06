DROP DATABASE IF EXISTS pastry_shop;
CREATE DATABASE pastry_shop;

USE pastry_shop;

DROP TABLE IF EXISTS accounts;
CREATE TABLE accounts (
    account_id int NOT NULL AUTO_INCREMENT,
    account_email varchar(100),
    account_username varchar(100),
    account_password varchar(255) NOT NULL,
    account_role varchar(20),
    account_deleted_at datetime,
    account_code varchar(10),
    PRIMARY KEY (account_id)
) ENGINE=InnoDB AUTO_INCREMENT=1021 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS categories;
CREATE TABLE categories (
    category_id int NOT NULL AUTO_INCREMENT,
    category_name varchar(100),
    category_deleted_at datetime,
    PRIMARY KEY (category_id)
) ENGINE=InnoDB AUTO_INCREMENT=1021 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS discounts;
CREATE TABLE discounts (
    discount_id int NOT NULL AUTO_INCREMENT,
    discount_code varchar(20),
    discount_rate decimal(4,2),
    discount_limit int,
    discount_start datetime,
    discount_end datetime,
    PRIMARY KEY (discount_id)
) ENGINE=InnoDB AUTO_INCREMENT=1008 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS suppliers;
CREATE TABLE suppliers (
    supplier_id int NOT NULL AUTO_INCREMENT,
    supplier_name varchar(100),
    supplier_phone_number varchar(11),
    supplier_email varchar(100),
    supplier_address varchar(255),
    supplier_deleted_at datetime,
    PRIMARY KEY (supplier_id)
) ENGINE=InnoDB AUTO_INCREMENT=1010 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS products;
CREATE TABLE products (
    product_id int NOT NULL AUTO_INCREMENT,
    product_name varchar(100),
    product_stock_quantity int,
    product_sold_quantity int,
    product_description longtext,
    product_expire_date datetime,
    product_slug varchar(100),
    product_created_at datetime,
    product_updated_at datetime,
    product_deleted_at datetime,
    category_id int,
    discount_id int,
    supplier_id int,
    PRIMARY KEY (product_id),
    CONSTRAINT products_ibfk_1 FOREIGN KEY (category_id) REFERENCES categories (category_id),
    CONSTRAINT products_ibfk_2 FOREIGN KEY (discount_id) REFERENCES discounts (discount_id),
    CONSTRAINT products_ibfk_3 FOREIGN KEY (supplier_id) REFERENCES suppliers (supplier_id)
) ENGINE=InnoDB AUTO_INCREMENT=1034 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS prices;
CREATE TABLE prices (
    product_id int NOT NULL,
    price_applied_date datetime NOT NULL,
    price_value decimal(10,2),
    PRIMARY KEY (product_id,price_applied_date),
    CONSTRAINT prices_ibfk_1 FOREIGN KEY (product_id) REFERENCES products (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS customers;
CREATE TABLE customers (
    customer_id int NOT NULL AUTO_INCREMENT,
    customer_username varchar(100),
    customer_name varchar(100),
    customer_phone_number varchar(10),
    account_id int,
    PRIMARY KEY (customer_id)
) ENGINE=InnoDB AUTO_INCREMENT=1009 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS images;
CREATE TABLE images (
    image_id int NOT NULL AUTO_INCREMENT,
    image_url varchar(255),
    image_target varchar(20),
    belong_id int,
    PRIMARY KEY (image_id)
) ENGINE=InnoDB AUTO_INCREMENT=1132 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS addresses;
CREATE TABLE addresses (
    address_id int NOT NULL AUTO_INCREMENT,
    address_fullname varchar(100),
    address_phone_number varchar(10),
    address_detail varchar(255),
    address_deleted_at datetime,
    address_is_default int,
    customer_id int,
    PRIMARY KEY (address_id),
    CONSTRAINT addresses_ibfk_1 FOREIGN KEY (customer_id) REFERENCES customers (customer_id)
) ENGINE=InnoDB AUTO_INCREMENT=1038 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS carts;
CREATE TABLE carts (
    customer_id int NOT NULL,
    product_id int NOT NULL,
    cart_quantity int,
    cart_is_selected int,
    PRIMARY KEY (customer_id,product_id),
    CONSTRAINT carts_ibfk_1 FOREIGN KEY (customer_id) REFERENCES customers (customer_id),
    CONSTRAINT carts_ibfk_2 FOREIGN KEY (product_id) REFERENCES products (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS ratings;
CREATE TABLE ratings (
    customer_id int NOT NULL,
    product_id int NOT NULL,
    rating_created_at datetime NOT NULL,
    rating_content text,
    rating_star int,
    PRIMARY KEY (product_id,customer_id,rating_created_at),
    CONSTRAINT ratings_ibfk_1 FOREIGN KEY (customer_id) REFERENCES customers (customer_id),
    CONSTRAINT ratings_ibfk_2 FOREIGN KEY (product_id) REFERENCES products (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS payment_methods;
CREATE TABLE payment_methods (
    pm_id int NOT NULL AUTO_INCREMENT,
    pm_name varchar(100),
    vn_pm_name varchar(100),
    PRIMARY KEY (pm_id)
) ENGINE=InnoDB AUTO_INCREMENT=1003 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS status;
CREATE TABLE status (
    status_id int NOT NULL AUTO_INCREMENT,
    en_status_name varchar(50),
    vn_status_name varchar(50),
    PRIMARY KEY (status_id)
) ENGINE=InnoDB AUTO_INCREMENT=1007 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS staffs;
CREATE TABLE staffs (
    staff_id int NOT NULL AUTO_INCREMENT,
    staff_email varchar(100),
    staff_name varchar(100),
    staff_role varchar(50),
    staff_phone_number varchar(10),
    staff_address varchar(255),
    account_id int,
    PRIMARY KEY (staff_id)
) ENGINE=InnoDB AUTO_INCREMENT=1012 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS orders;
CREATE TABLE orders (
    order_id int NOT NULL AUTO_INCREMENT,
    order_date datetime,
    order_total decimal(10,2),
    order_note text,
    pm_id int,
    address_id int,
    PRIMARY KEY (order_id),
    CONSTRAINT orders_ibfk_1 FOREIGN KEY (address_id) REFERENCES addresses (address_id),
    CONSTRAINT orders_ibfk_2 FOREIGN KEY (pm_id) REFERENCES payment_methods (pm_id)
) ENGINE=InnoDB AUTO_INCREMENT=1023 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS order_details;
CREATE TABLE order_details (
    order_id int NOT NULL,
    product_id int NOT NULL,
    product_quantity int,
    PRIMARY KEY (order_id,product_id),
    CONSTRAINT order_details_ibfk_1 FOREIGN KEY (order_id) REFERENCES orders (order_id),
    CONSTRAINT order_details_ibfk_2 FOREIGN KEY (product_id) REFERENCES products (product_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS status_details;
CREATE TABLE status_details (
    status_id int NOT NULL,
    order_id int NOT NULL,
    status_updated_at datetime,
    status_updated_by varchar(50),
    PRIMARY KEY (status_id,order_id),
    CONSTRAINT status_details_ibfk_2 FOREIGN KEY (status_id) REFERENCES status (status_id),
    CONSTRAINT status_details_ibfk_3 FOREIGN KEY (order_id) REFERENCES orders (order_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

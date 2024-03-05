import connectDB from './../db/index.js';
import Validator from './validator.js';
import ProductModel from './product.model.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class CartModel {
    constructor() {
        this.table = process.env.TABLE_CARTS;
        this.schema = {
            customer_id: {
                required: true,
                toInt: true,
            },
            product_id: {
                required: true,
                toInt: true,
            },
            cart_quantity: {
                required: true,
                toInt: true,
            },
        };
    }
    extractCustomerData(payload) {
        const cart = {
            customer_id: payload.customer_id,
            product_id: payload.product_id,
            cart_quantity: payload.cart_quantity,
        };
        Object.keys(cart).forEach(key => {
            if(cart[key] === undefined) {
                delete cart[key];
            }
        });
        return cart;
    }
    validateCartData(data) {
        const cart = this.extractCustomerData(data);
        const validator = new Validator();
        let { result, errors } = validator.validate(cart, this.schema);
        return { result, errors };
    }
    async getOneFromCart(customerId, itemId) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id and product_id = :product_id`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: customerId,
            product_id: itemId,
        });
        return rows[0];
    }
    // get all products in cart of customer
    async get(customerId) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: customerId,
        });
        const productModel = new ProductModel();
        let products = [];
        for(const row of rows) {
            const item = await productModel.get(row.product_id);
            products.push({
                cart_quantity: row.cart_quantity,
                details: item,    
            });
        }
        return products;
    }
    // add product to cart
    async add(data) {
        const { result: cart, errors } = this.validateCartData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const oldItem = await this.getOneFromCart(cart.customer_id, cart.product_id);
        if(oldItem) {
            cart.cart_quantity += oldItem.cart_quantity;
            await this.update(cart.customer_id, cart.product_id, cart.cart_quantity);
        }
        else {
            const preparedStmt = `insert into ${this.table} (${Object.keys(cart).map(key => `${key}`).join(', ')}) values (${Object.keys(cart).map(key => `:${key}`)})`;
            await connection.execute(preparedStmt, cart);
        }
    }
    // update product quantity in cart
    async update(customerId, itemId, quantity) {
        const data = {
            customer_id: customerId,
            product_id: itemId,
            cart_quantity: quantity,
        };
        const { result: cart, errors } = this.validateCartData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        if(Object.keys(cart).length !== 3) {
            throw new Error('Please provide enough data to update cart.');
        }
        const oldItem = await this.getOneFromCart(cart.customer_id, cart.product_id);
        if(!oldItem) {
            await this.add(cart);
        }
        const preparedStmt = `update ${this.table} set cart_quantity = :cart_quantity where customer_id = :customer_id and product_id = :product_id`;
        await connection.execute(preparedStmt, cart);
    }
    // delete
    async delete(customerId, itemId) {
        const cartItem = await this.getOneFromCart(customerId, itemId);
        if(!cartItem) {
            throw new Error('Cart item not found.');
        }    
        const preparedStmt = `delete from ${this.table} where customer_id = :customer_id and product_id = :product_id`;
        await connection.execute(preparedStmt, {
            customer_id: customerId,
            product_id: itemId,
        });
    }
}

export default CartModel;
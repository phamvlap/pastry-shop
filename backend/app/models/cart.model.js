import connectDB from './../db/index.js';
import Validator from './validator.js';
import ProductModel from './product.model.js';
import extractData from './../utils/extractData.util.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class CartModel {
    constructor() {
        this.table = process.env.TABLE_CARTS;
        this.fields = ['customer_id', 'product_id', 'cart_quantity'];
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
    validateCartData(data) {
        const cart = extractData(data, this.fields);
        const validator = new Validator();
        return validator.validate(cart, this.schema);
    }
    async getOneFromCart(customerId, itemId) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id and product_id = :product_id`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: customerId,
            product_id: itemId,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    // get all products in cart of customer
    async get(customerId) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: customerId,
        });
        const productModel = new ProductModel();
        let products = [];
        if(rows.length > 0) {
            for(const row of rows) {
                const item = await productModel.get(row.product_id);
                products.push({
                    cart_quantity: row.cart_quantity,
                    details: item,    
                });
            }
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
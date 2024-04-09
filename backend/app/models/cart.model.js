import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { ProductModel } from './index.js';
import { extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class CartModel {
    constructor() {
        this.table = process.env.TABLE_CARTS;
        this.fields = ['customer_id', 'product_id', 'cart_quantity', 'cart_is_selected'];
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
                toInt: true,
            },
            cart_is_selected: {
                toInt: true, // 0 | 1
            },
        };
    }
    validateCartData(data) {
        const cart = extractData(data, this.fields);
        const validator = new Validator();
        return validator.validate(cart, this.schema);
    }
    // get one item from cart
    async getOneFromCart(customerId, itemId) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id and product_id = :product_id`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: customerId,
            product_id: itemId,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
    // get info of item in cart
    async getInfoCartItem(cartItem) {
        const productModel = new ProductModel();
        const item = await productModel.getById(cartItem.product_id);
        return {
            quantityInCart: cartItem.cart_quantity,
            statusItem: cartItem.cart_is_selected,
            detail: item,
        };
    }
    // get all products in cart of customer
    async get(customerId, isSelected) {
        let rows = [];
        if(!isSelected) {
            const preparedStmt = `select * from ${this.table} where customer_id = :customer_id`;
            [rows] = await connection.execute(preparedStmt, {
                customer_id: customerId,
            });

        }
        if(isSelected) {
            const preparedStmt = `select * from ${this.table} where customer_id = :customer_id and cart_is_selected = 1`;
            [rows] = await connection.execute(preparedStmt, {
                customer_id: customerId,
            });
        }
        let products = [];
        if(rows.length > 0) {
            for(const row of rows) {
                const item = await this.getInfoCartItem(row);
                products.push(item);
            }
        }
        return products;
    }
    // get all selected products in cart
    async getSelectedItems(customerId) {
        const preparedStmt = `select * from ${this.table} where customer_id = :customer_id and cart_is_selected = 1`;
        const [rows] = await connection.execute(preparedStmt, {
            customer_id: customerId,
        });
        let products = [];
        if(rows.length > 0) {
            for(const row of rows) {
                const item = await this.getInfoCartItem(row);
                products.push(item);
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
        if(!cart.cart_quantity) {
            throw new Error('Item quantity is required.');
        }
        const oldItem = await this.getOneFromCart(cart.customer_id, cart.product_id);
        if(oldItem) {
            cart.cart_quantity += oldItem.cart_quantity;
            await this.update(cart);
        }
        else {
            cart['cart_is_selected'] = 0;
            const preparedStmt = `insert into ${this.table} (${Object.keys(cart).map(key => `${key}`).join(', ')}) values (${Object.keys(cart).map(key => `:${key}`)})`;
            await connection.execute(preparedStmt, cart);
        }
    }
    // update product quantity in cart
    async update(data) {
        const { result: cart, errors } = this.validateCartData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        if(!(cart.cart_quantity || cart.cart_is_selected)) {
            throw new Error('Both cart quantity and status are empty.');
        }
        const oldItem = await this.getOneFromCart(cart.customer_id, cart.product_id);
        if(!oldItem) {
            await this.add(cart);
        }
        const updatedContent = {
            ...extractData(cart, ['cart_quantity', 'cart_is_selected']),
        };
        const preparedStmt = `
            update ${this.table}
            set ${Object.keys(updatedContent).map(key => `${key} = :${key}`).join(', ')}
            where customer_id = :customer_id
                and product_id = :product_id
        `;
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
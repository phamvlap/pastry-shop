import slugify from 'slugify';
import connectDB from './../db/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class Product {
    extractProductData(payload) {
        const product = {
            product_name: payload.name,
            product_stock_quantity: Number(payload.stock_quantity),
            product_description: payload.description,
            product_images: payload.images.join('|'),
            product_expire_date: payload.expire_date,
            category_id: Number(payload.category_id),
            discount_id: Number(payload.discount_id),
            supplier_id: Number(payload.supplier_id),
        };
        Object.keys(product).forEach(key => {
            if(product[key] === undefined) {
                delete product[key];
            }
        });
        // product.product_sold_quantity = 0;
        product.product_slug = slugify(product.product_name, {
            replacement: '_',
            lower: true,
            trim: true,
        });
        return product;
    }

    // create
    async create(data) {
        try {
            const product = this.extractProductData(data);
            const preparedStmt = `insert into products (${Object.keys(product).join(', ')}) values (${Object.keys(product).map(key => `:${key}`).join(', ')})`;
            connection.execute(preparedStmt, product, (error, rows) => {
                console.log(rows);
            });
            
            connection.execute('insert into test values(:age)', { age: 30 }, (error, rows) => {
                console.log(rows);
            });
        }
        catch(error) {
            console.log(error);
        }
    }
}

export default Product;
import connectDB from './../db/index.js';
import Validator from './validator.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class Category {
    constructor() {
        this.table = process.env.TABLE_CATEGORIES;
        this.schema = {
            category_name: {
                type: String,
                required: true,
                min: 3,
            },
        };
    }
    extractCategoryData(payload) {
        const category = {
            category_name: payload.name,
        };
        return category;
    }
    // validate
    validateCategoryData(data) {
        const category = this.extractCategoryData(data);
        const validator = new Validator();
        return validator.validate(category, this.schema);
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table}`;
        const [rows] = await connection.execute(preparedStmt);
        return rows;
    }
    // get
    async get(id) {
        const preparedStmt = `select * from ${this.table} where category_id = :category_id`;
        const [row] = await connection.execute(preparedStmt, {
            category_id: id,
        });
        return row;
    }
    // create
    async create(data) {
        const { result: category, errors } = this.validateCategoryData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(category).join(', ')}) values (${Object.keys(category).map(key => `:${key}`).join(', ')})`;
        await connection.execute(preparedStmt, category);
    }
    // update
    async update(id, data) {
        const { result: category, errors } = this.validateCategoryData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(category).map(key => `${key} = :${key}`).join(', ')} where category_id = :category_id`;
        await connection.execute(preparedStmt, {
                ...category,
                category_id: id,
            });
    }
    // delete
    async delete(id) {
        const preparedStmt = `delete from ${this.table} where category_id = :category_id`;
        await connection.execute(preparedStmt, {
            category_id: id,
        });
    }
}

export default Category;
import connectDB from './../db/index.js';
import Validator from './validator.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class Category {
    constructor() {
        this.table = 'categories';
    }
    extractCategoryData(payload) {
        const category = {
            category_name: payload.name,
        };
        return category;
    }
    // validate
    async validateData(data) {
        const category = this.extractCategoryData(data);
        const validator = new Validator();
        validator.isLeastLength('category_name', category.category_name, 3);
        const errors = validator.getErrors();
        return { category, errors };
    }
    // get all
    async getAll() {
        const preparedStmt = `select * from ${this.table}`;
        const [rows] = await connection.execute(preparedStmt);
        return rows;
    }
    // create
    async create(data) {
        const { category, errors } = await this.validateData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `insert into ${this.table} (${Object.keys(category).join(', ')}) values (${Object.keys(category).map(key => `:${key}`).join(', ')})`;
        connection.execute(preparedStmt, category);
    }
    // update
    async update(id, data) {
        const { category, errors } = await this.validateData(data);
        if(errors.length > 0) {
            const errorMessage = errors.map(error => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `update ${this.table} set ${Object.keys(category).map(key => `${key} = :${key}`).join(', ')} where category_id = :category_id`;
        connection.execute(preparedStmt, {
                ...category,
                category_id: id,
            });
    }
    // delete
    async delete(id) {
        const preparedStmt = `delete from ${this.table} where category_id = :category_id`;
        connection.execute(preparedStmt, {
            category_id: id,
        });
    }
}

export default Category;
import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { formatDateToString, extractData, escapeData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class Category {
    constructor() {
        this.table = process.env.TABLE_CATEGORIES;
        this.fields = ['category_name'];
        this.schema = {
            category_name: {
                type: String,
                required: true,
                min: 3,
            },
        };
    }
    // validate
    validateCategoryData(data, exceptions = []) {
        const category = extractData(data, this.fields);
        const schema = {};
        Object.keys(this.schema).map((key) => {
            if (!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        const validator = new Validator();
        let { result, errors } = validator.validate(category, schema);
        if (!data.category_id) {
            result['category_deleted_at'] = process.env.TIME_NOT_DELETED;
        }
        return { result, errors };
    }
    // get all
    async getAll() {
        const preparedStmt = `
            select * 
            from ${this.table} 
            where category_deleted_at = '${process.env.TIME_NOT_DELETED}';
        `;
        let [rows] = await connection.execute(preparedStmt);
        if (rows.length > 0) {
            rows = rows.map((row) => escapeData(row, ['category_deleted_at']));
        }
        return rows.length > 0 ? rows : [];
    }
    // get by id
    async get(id) {
        const preparedStmt = `
            select * 
            from ${this.table} 
            where category_id = :category_id 
                and category_deleted_at = '${process.env.TIME_NOT_DELETED}'
        `;
        const [rows] = await connection.execute(preparedStmt, {
            category_id: id,
        });
        return rows.length > 0 ? escapeData(rows[0], ['category_deleted_at']) : null;
    }
    // create
    async store(data) {
        const { result: category, errors } = this.validateCategoryData(data);
        if (errors.length > 0) {
            const errorMessage = errors.map((error) => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `
            insert into ${this.table} (${Object.keys(category).join(', ')})
                values (${Object.keys(category)
                    .map((key) => `:${key}`)
                    .join(', ')})
        `;
        await connection.execute(preparedStmt, category);
    }
    // update
    async update(id, payload) {
        const oldCategory = await this.get(id);
        if (!oldCategory) {
            throw new Error('Cateogry not found.');
        }
        let exceptions = [];
        Object.keys(this.schema).forEach((key) => {
            if (!payload.hasOwnProperty(key)) {
                exceptions.push(key);
            }
        });
        const { result: category, errors } = this.validateCategoryData(
            {
                ...payload,
                category_id: id,
            },
            exceptions,
        );
        if (errors.length > 0) {
            const errorMessage = errors.map((error) => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `
            update ${this.table}
            set ${Object.keys(category)
                .map((key) => `${key} = :${key}`)
                .join(', ')}
            where category_id = :category_id 
                and category_deleted_at = '${process.env.TIME_NOT_DELETED}'
        `;
        await connection.execute(preparedStmt, {
            ...category,
            category_id: id,
        });
    }
    // delete
    async delete(id) {
        const oldCategory = await this.get(id);
        if (!oldCategory) {
            throw new Error('Cateogry not found.');
        }
        const preparedStmt = `
            update ${this.table} 
            set category_deleted_at = :category_deleted_at 
            where category_id = :category_id 
                and category_deleted_at = '${process.env.TIME_NOT_DELETED}'
        `;
        await connection.execute(preparedStmt, {
            category_deleted_at: formatDateToString(),
            category_id: id,
        });
    }
}

export default Category;

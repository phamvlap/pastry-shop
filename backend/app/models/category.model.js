import connectDB from './../db/index.js';

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
    // get all
    async getAll() {
        try {
            const preparedStmt = `select * from ${this.table}`;
            const [rows] = await connection.execute(preparedStmt);
            return rows;
        }
        catch(error) {
            console.log(error);
        }
    }
    // create
    async create(data) {
        try {
            const category = this.extractCategoryData(data);
            const preparedStmt = `insert into ${this.table} (${Object.keys(category).join(', ')}) values (${Object.keys(category).map(key => `:${key}`).join(', ')})`;
            connection.execute(preparedStmt, category, (error, rows) => {
                console.log(rows);
            });
        }
        catch(error) {
            console.log(error);
        }
    }
    // update
    async update(id, data) {
        try {
            const category = this.extractCategoryData(data);
            const preparedStmt = `update ${this.table} set ${Object.keys(category).map(key => `${key} = :${key}`).join(', ')} where category_id = :category_id`;
            console.log(preparedStmt);
            connection.execute(preparedStmt, {
                    ...category,
                    category_id: id,
                }, (error, rows) => {
                        console.log(rows);
                });
        }
        catch(error) {
            console.log(error);
        }
    }
    // delete
    async delete(id) {
        try {
            const preparedStmt = `delete from ${this.table} where category_id = :category_id`;
            connection.execute(preparedStmt, {
                category_id: id,
            }, (err, rows) => {
                console.log(rows);
            });
        }
        catch(error) {
            console.log(error);
        }
    }
}

export default Category;
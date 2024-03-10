import connectDB from './../db/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class StatusModel {
    constructor() {
        this.table = process.env.TABLE_STATUS;
    }
    async get(id) {
        const [rows] = await connection.execute(`select * from ${this.table} where status_id = :status_id`, {
            status_id: id,
        });
        return (rows.length > 0) ? rows[0] : null;
    }
}

export default StatusModel;
import connectDB from './../db/index.js';
import Validator from './../helpers/validator.js';
import { formatDateToString, escapeData, extractData } from './../utils/index.js';

const connection = await connectDB();
connection.config.namedPlaceholders = true;

class ImageModel {
    constructor() {
        this.table = process.env.TABLE_IMAGES;
        this.fields = ['image_url', 'image_target', 'belong_id'];
        this.schema = {
            image_url: {
                type: String,
                required: true,
            },
            image_target: {
                type: String,
                required: true,
            },
            belong_id: {
                required: true,
                toInt: true,
            },
        };
    }
    validateImageData(data, exceptions = []) {
        const image = extractData(data, this.fields);
        const schema = {};
        Object.keys(this.schema).map((key) => {
            if (!exceptions.includes(key)) {
                schema[key] = this.schema[key];
            }
        });
        const validator = new Validator();
        let { result, errors } = validator.validate(image, schema);
        return { result, errors };
    }
    // get all images for target
    async getAll(target, belong_id) {
        try {
            if (!target || !belong_id) {
                return [];
            }
            if (target === 'product') {
                const preparedStmt = `
                    select *
                    from ${this.table}
                    where image_target = 'product'
                        and belong_id = :belong_id;
                `;
                const [rows] = await connection.execute(preparedStmt, {
                    belong_id: belong_id,
                });
                return rows.length > 0 ? rows : [];
            } else if (target === 'customer') {
                const preparedStmt = `
                    select *
                    from ${this.table}
                    where image_target = 'customer'
                        and belong_id = :belong_id;
                `;
                const [rows] = await connection.execute(preparedStmt, {
                    belong_id: belong_id,
                });
                return rows.length > 0 ? rows : [];
            }
        } catch (err) {
            console.log(err);
        }
    }
    // get image by id
    async getById(id) {
        try {
            const preparedStmt = `
                select *
                from ${this.table}
                where image_id = :image_id;
            `;
            const [rows] = await connection.execute(preparedStmt, {
                image_id: id,
            });
            return rows.length > 0 ? rows[0] : null;
        } catch (err) {
            console.log(err);
        }
    }
    // store image
    async store(data) {
        const { result: image, errors } = this.validateImageData(data);
        if (errors.length > 0) {
            const errorMessage = errors.map((error) => error.msg).join(' ');
            throw new Error(errorMessage);
        }
        const preparedStmt = `
            insert into ${this.table} (${Object.keys(image).join(', ')})
                values (${Object.keys(image)
                    .map((key) => `:${key}`)
                    .join(', ')})
        `;
        await connection.execute(preparedStmt, image);
    }
    // udpate image
    async update(id, data) {
        try {
            const oldImage = await this.getById(id);
            if (!oldImage) {
                throw new Error('Image not found.');
            }
            const { result: image, errors } = this.validateImageData({
                image_url: data.image_url,
                image_target: oldImage.image_target,
                belong_id: oldImage.belong_id,
            });
            if (errors.length > 0) {
                const errorMessage = errors.map((error) => error.msg).join(' ');
                throw new Error(errorMessage);
            }
            const preparedStmt = `
                update ${this.table}
                set ${Object.keys(image)
                    .map((key) => `${key} = :${key}`)
                    .join(', ')}
                where image_id = :image_id;
            `;
            await connection.execute(preparedStmt, {
                image_id: id,
                ...image,
            });
        } catch (err) {
            console.log(err);
        }
    }
    // delete image
    async delete(id) {
        try {
            const oldImage = this.getById(id);
            if (!oldImage) {
                throw new Error('Image not found.');
            }
            const preparedStmt = `
                delete from ${this.table}
                where image_id = :image_id;
            `;
            await connection.execute(preparedStmt, {
                image_id: id,
            });
        } catch (err) {
            console.log(err);
        }
    }
}

export default ImageModel;

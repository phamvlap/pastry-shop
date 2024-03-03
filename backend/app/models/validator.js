import slugify from 'slugify';
import formatDateToString from './../utils/formatDateToString.util.js';

class Validator {
    constructor() {
        this.errors = [];
    }
    formatFieldName(fieldName) {
        const lowerfieldName = fieldName.toLowerCase().replace('_', ' ');
        return lowerfieldName.charAt(0).toUpperCase() + lowerfieldName.slice(1);
    }
    isRequired(fieldName, value) {
        if(value === undefined || value === null || value === '') {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} is required.`,
            });
        }
    }
    checkValidType(fieldName, value, type) {
        let result = value;
        const stringType = (typeof type === 'string') ? type : type.toString().split(' ')[1].replace('()', '').toLowerCase();
        if(stringType === 'date') {
            if(!(new Date(value) instanceof Date)) {
                this.errors.push({
                    fieldName,
                    msg: `${this.formatFieldName(fieldName)} must be a date.`,
                });
            }
            else {
                this.checkValidDate(fieldName, value);
                result = formatDateToString(value);
            }
        }
        else {
            if(!(typeof value === stringType) && !(value instanceof type)) {
                this.errors.push({
                    fieldName,
                    msg: `${this.formatFieldName(fieldName)} must be a ${stringType}.`,
                });
            }
        }
        return result;
    }
    convertToUpperCase(value) {
        if(value) {
            return value.toUpperCase();
        }
    }
    fixDecimal(value, decimal = 2) {
        if(value) {
            return Number(parseFloat(value).toFixed(decimal));
        }
    }
    isLeastLength(fieldName, value, min = 3) {
        if(!(value.length >= min)) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} must be at least ${min} characters.`,
            });
        }
    }
    between(fieldName, value, min = 0, max = 255) {
        if(!(value.length >= min && value.length <= max)) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} must be between ${min} and ${max} characters.`,
            });
        }
    }
    isEmail(fieldName, email) {
        if(!(typeof email === 'string' && email.length > 0 && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} is invalid.`,
            });
        }
    }
    isPhoneNumber(fieldName, phoneNumber) {
        if(!(typeof phoneNumber === 'string' && phoneNumber.length > 0 && /((09|03|07|08|05)+([0-9]{8})\b)/g.test(phoneNumber))) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} is invalid.`,
            });
        }
    }
    checkPeriod(startFieldName, endFieldName, startDate, endDate) {
        if(startDate > endDate) {
            this.errors.push({
                fieldName: startFieldName + endFieldName,
                msg: `${this.formatFieldName(startFieldName)} must be less than ${this.formatFieldName(endFieldName)}.`,
            });
        }
    }
    checkUploadImages(fieldName, imageList) {
        let stringImages = '';
        if(imageList.length === 0 ) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} are required.`,
            });
        }
        else {
            stringImages = imageList.map(image => image.filename).join(';');
        }
        return stringImages;
    }
    checkValidDate(fieldName, stringDate) {
        const currentDate = new Date();
        const date = new Date(stringDate);
        if(date < currentDate) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} must be greater than current date.`,
            });
        }
    }
    checkPassword(fieldName, password) {
        if(!/^(?=.*?[a-zA-Z])(?=.*?[0-9]).{8,}$/.test(password)) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} have minimum 8 characters that includes least at one letter and least at one digit.`,
            });
            return false;
        }
        return true;
    }
    validate(data, schema) {
        const result = { ...data };
        Object.keys(schema).forEach(key => {
            if(data.hasOwnProperty(key)) {
                const rules = schema[key];
                if(rules.type !== undefined) {
                    result[key] = this.checkValidType(key, data[key], rules.type);
                }
                if(rules.required !== undefined) {
                    this.isRequired(key, data[key]);
                }
                if(rules.between !== undefined) {
                    this.between(key, data[key], rules.between[0], rules.between[1]);
                }
                if(rules.uppercase !== undefined) {
                    result[key] = this.convertToUpperCase(result[key]);
                }
                if(rules.toFixed !== undefined) {
                    result[key] = this.fixDecimal(result[key], rules.toFixed);
                }
                if(rules.toInt !== undefined) {
                    result[key] = parseInt(result[key]);
                }
                if(rules.previousDate !== undefined) {
                    this.checkPeriod(rules.previousDate, key, data[rules.previousDate], data[key]);
                }
                if(rules.min !== undefined) {
                    this.isLeastLength(key, data[key], rules.min);
                }
                if(rules.email !== undefined) {
                    this.isEmail(key, data[key]);
                }
                if(rules.phoneNumber !== undefined) {
                    this.isPhoneNumber(key, data[key]);
                }
                if(rules.slug !== undefined) {
                    const slugFieldName = key.replace('name', 'slug');
                    result[slugFieldName] = slugify(result[key], {
                        replacement: '_',
                        lower: true,
                        trim: true,
                    });
                }
                if(rules.password !== undefined) {
                    this.checkPassword(key, data[key]);
                }
            }
        });
        return {
            result,
            errors: this.getErrors(),
        }
    }
    getErrors() {
        return this.errors;
    }
    validateUpdatePassword(fieldName, newPassword, confirmPassword) {
        // new_password, confirm_password
        if(this.checkPassword(fieldName, newPassword)) {
            if(newPassword !== confirmPassword) {
                this.errors.push({
                    fieldName,
                    msg: `Confirm password must be matched with new password.`,
                });
            }
        }
    }
}

export default Validator;
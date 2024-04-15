import slugify from 'slugify';
import { formatDateToString } from './../utils/index.js';

const regexEmail = new RegExp(process.env.REGEX_EMAIL);
const regexPassword = new RegExp(process.env.REGEX_PASSWORD);
const regexPhoneNumber = new RegExp(process.env.REGEX_PHONE_NUMBER);

class Validator {
    constructor() {
        this.errors = [];
    }
    formatFieldName(fieldName) {
        const lowerfieldName = fieldName.toLowerCase().replace('_', ' ');
        return lowerfieldName.charAt(0).toUpperCase() + lowerfieldName.slice(1);
    }
    isRequired(fieldName, value) {
        if (value === undefined || value === null || value === '') {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} is required.`,
            });
        }
    }
    checkValidType(fieldName, value, type) {
        let result = value;
        const stringType =
            typeof type === 'string' ? type : type.toString().split(' ')[1].replace('()', '').toLowerCase();
        if (stringType === 'date') {
            if (!(new Date(value) instanceof Date)) {
                this.errors.push({
                    fieldName,
                    msg: `${this.formatFieldName(fieldName)} must be a date.`,
                });
            } else {
                this.checkValidDate(fieldName, value);
                result = formatDateToString(value);
            }
        } else {
            if (!(typeof value === stringType) && !(value instanceof type)) {
                this.errors.push({
                    fieldName,
                    msg: `${this.formatFieldName(fieldName)} must be a ${stringType}.`,
                });
            }
        }
        return result;
    }
    convertToUpperCase(value) {
        if (value) {
            return value.toUpperCase();
        }
    }
    fixDecimal(value, decimal = 2) {
        if (value) {
            return Number(parseFloat(value).toFixed(decimal));
        }
    }
    isLeastLength(fieldName, value, min = 3) {
        if (!(value.length >= min)) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} must be at least ${min} characters.`,
            });
        }
    }
    between(fieldName, value, min = 0, max = 255) {
        if (!(value.length >= min && value.length <= max)) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} must be between ${min} and ${max} characters.`,
            });
        }
    }
    isEmail(fieldName, email) {
        if (!(typeof email === 'string' && email.length > 0 && regexEmail.test(email))) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} is invalid.`,
            });
        }
    }
    isPhoneNumber(fieldName, phoneNumber) {
        if (!(typeof phoneNumber === 'string' && phoneNumber.length > 0 && regexPhoneNumber.test(phoneNumber))) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} is invalid.`,
            });
        }
    }
    checkPeriod(startFieldName, endFieldName, startDate, endDate) {
        if (startDate > endDate) {
            this.errors.push({
                fieldName: startFieldName + endFieldName,
                msg: `${this.formatFieldName(startFieldName)} must be less than ${this.formatFieldName(endFieldName)}.`,
            });
        }
    }
    convertToImagesString(fieldName, imageList) {
        let stringImages = '';
        if (imageList === undefined || imageList?.length === 0) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} are required.`,
            });
        } else {
            stringImages = imageList.map((image) => image.filename).join(';');
        }
        return stringImages;
    }
    checkValidDate(fieldName, stringDate) {
        const currentDate = formatDateToString(new Date());
        const date = formatDateToString(new Date(stringDate));
        if (new Date(date) < new Date(currentDate)) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} must be greater than current date.`,
            });
        }
    }
    checkPassword(fieldName, password) {
        if (!regexPassword.test(password)) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(
                    fieldName,
                )} have minimum 8 characters that includes least at one letter and least at one digit.`,
            });
            return false;
        }
        return true;
    }
    validate(data, schema) {
        const result = { ...data };
        Object.keys(schema).forEach((key) => {
            if (schema[key].required) {
                this.isRequired(key, data[key]);
            }
            if (data.hasOwnProperty(key)) {
                const rules = schema[key];
                if (rules.type) {
                    result[key] = this.checkValidType(key, data[key], rules.type);
                }
                if (rules.between) {
                    this.between(key, data[key], rules.between[0], rules.between[1]);
                }
                if (rules.uppercase) {
                    result[key] = this.convertToUpperCase(result[key]);
                }
                if (rules.toFixed) {
                    result[key] = this.fixDecimal(result[key], rules.toFixed);
                }
                if (rules.toInt) {
                    result[key] = parseInt(result[key]);
                }
                if (rules.previousDate) {
                    this.checkPeriod(rules.previousDate, key, data[rules.previousDate], data[key]);
                }
                if (rules.min) {
                    this.isLeastLength(key, data[key], rules.min);
                }
                if (rules.email) {
                    this.isEmail(key, data[key]);
                }
                if (rules.phoneNumber) {
                    this.isPhoneNumber(key, data[key]);
                }
                if (rules.slug) {
                    const slugFieldName = key.replace('name', 'slug');
                    result[slugFieldName] = slugify(result[key], {
                        replacement: '_',
                        lower: true,
                        trim: true,
                    });
                }
                if (rules.password) {
                    this.checkPassword(key, data[key]);
                }
            }
        });
        return {
            result,
            errors: this.getErrors(),
        };
    }
    getErrors() {
        return this.errors;
    }
    validateUpdatePassword(fieldName, newPassword, confirmPassword) {
        // new_password, confirm_password
        if (this.checkPassword(fieldName, newPassword)) {
            if (newPassword !== confirmPassword) {
                this.errors.push({
                    fieldName,
                    msg: `Confirm password must be matched with new password.`,
                });
            }
        }
    }
}

export default Validator;

import validator from 'validator';

class Validator {
    constructor(rules) {
        this.rules = rules;
    }
    init() {
        this.isValid = true;
        this.errors = {};
    }
    validate(state) {
        this.init();
        this.rules.forEach((rule) => {
            if (this.errors[rule.field]) {
                return;
            }
            const fieldValue = state[rule.field] ? state[rule.field].toString() : '';
            const args = rule.args || [];
            const validationMethod = typeof rule.method === 'string' ? validator[rule.method] : rule.method;

            if (validationMethod(fieldValue, ...args, state) !== rule.validWhen) {
                this.isValid = false;
                this.errors[rule.field] = rule.message;
            }
        });
        return this.errors;
    }
    static isInRange(value, range, state) {
        return value > range.min && value < range.max;
    }
    static isNumber(value, state) {
        if (isNaN(value)) {
            return false;
        }
        return Number(value) > 0;
    }
    static checkPeriod(endDate, startDateField, state) {
        return new Date(endDate) > new Date(state[startDateField]);
    }
    static checkValidDate(value) {
        const currentDate = new Date();
        const objectDate = new Date(value);
        return !isNaN(objectDate) && objectDate > currentDate;
    }
    static isSelected(value) {
        return value && value !== 'none';
    }
    static isUploaded(value) {
        return value.length > 0;
    }
    static isPassword(value) {
        const regex = new RegExp(import.meta.env.VITE_REGEX_PASSWORD);
        return regex.test(value);
    }
    static isPhoneNumber(value) {
        const regex = new RegExp(import.meta.env.VITE_REGEX_PHONE_NUMBER);
        return regex.test(value);
    }
}

export default Validator;

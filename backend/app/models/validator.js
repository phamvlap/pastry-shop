class Validator {
    constructor() {
        this.errors = [];
    }
    formatFieldName(fieldName) {
        const lowerfieldName = fieldName.toLowerCase().replace('_', ' ');
        return lowerfieldName.charAt(0).toUpperCase() + lowerfieldName.slice(1);
    }
    isLeastLength(fieldName, string, min = 3) {
        if(!(string.length >= min)) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} must be at least ${min} characters.`,
            });
        }
    }
    length(fieldName, string, min = 0, max = 255) {
        if(!(string.length >= min && string.length <= max)) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} must be between ${min} and ${max} characters.`,
            });
        }
    }
    isEmail(email) {
        if(!(typeof email === 'string' && email.length > 0 && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
            this.errors.push({
                fieldName: 'email',
                msg: 'Invalid email.',
            });
        }
    }
    isPhoneNumber(phoneNumber) {
        if(typeof phoneNumber !== 'string' || phoneNumber.length === 0 || /((09|03|07|08|05)+([0-9]{8})\b)/g.test(phoneNumber)) {
            this.errors.push({
                fieldName: 'phone_number',
                msg: 'Invalid phone number.',
            });
        }
    }
    getErrors() {
        return this.errors;
    }
}

export default Validator;
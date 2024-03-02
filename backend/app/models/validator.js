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
    isEmail(fieldName, email) {
        if(!(typeof email === 'string' && email.length > 0 && /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email))) {
            this.errors.push({
                fieldName,
                msg: 'Invalid email.',
            });
        }
    }
    isPhoneNumber(fieldName, phoneNumber) {
        if(typeof phoneNumber !== 'string' || phoneNumber.length === 0 || /((09|03|07|08|05)+([0-9]{8})\b)/g.test(phoneNumber)) {
            this.errors.push({
                fieldName,
                msg: 'Invalid phone number.',
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
        if(imageList.length === 0 ) {
            this.errors.push({
                fieldName,
                msg: `${this.formatFieldName(fieldName)} are required.`,
            });
        }
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
    getErrors() {
        return this.errors;
    }
}

export default Validator;
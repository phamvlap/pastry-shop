class Helper {
    // 10000000 => 10.000.000
    static formatMoney(value) {
        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    }
    static averageRating(ratings) {
        let sum = 0;
        if (ratings && ratings.length > 0) {
            for (const rating of ratings) {
                sum += Number(rating.rating_star);
            }
            return sum / ratings.length;
        }
        return sum;
    }
    // filter unnnecessary column of the object
    static filterObject(object, discardKeys) {
        const filteredObject = {};
        for (const key in object) {
            if (!discardKeys.includes(key)) {
                filteredObject[key] = object[key];
            }
        }
        return filteredObject;
    }
    static formatImageUrl(imageUrl) {
        return `${import.meta.env.VITE_UPLOADED_DIR}${imageUrl.split('/uploads/')[1]}`;
    }
    // format date time to string
    static formatDateTime(dateTime) {
        const date = new Date(dateTime);
        return `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${
            date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()
        } ${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${
            date.getMonth() < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        }-${date.getFullYear()}`;
    }
    // extract object with exceptions
    static extractObject(object, keys) {
        const extractedObject = {};
        for (const key in object) {
            if (keys.includes(key)) {
                extractedObject[key] = object[key];
            }
        }
        return extractedObject;
    }
    // to yyyy-mm-dd
    static convertToStandardFormat(stringDate) {
        if (!stringDate) {
            return '';
        }
        let date = new Date();
        if (stringDate.length > 0) {
            date = new Date(stringDate);
        }
        return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${
            date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        }`;
    }

    // validat udpated order status
    static validateOrderStatus(currentStatusId, updatedStatusId) {
        switch (currentStatusId) {
            case 1001:
                return updatedStatusId === 1002 || updatedStatusId === 1005;
            case 1002:
                return updatedStatusId === 1003;
            case 1003:
                return updatedStatusId === 1004;
            default:
                return false;
        }
    }

    // generate random string
    static generateRandomString(length = 0) {
        let alphabet = '';
        for (let i = 'a'.charCodeAt(); i <= 'z'.charCodeAt(); ++i) {
            alphabet += String.fromCharCode(i);
        }
        for (let i = 'A'.charCodeAt(); i <= 'Z'.charCodeAt(); ++i) {
            alphabet += String.fromCharCode(i);
        }
        for (let i = '0'.charCodeAt(); i <= '9'.charCodeAt(); ++i) {
            alphabet += String.fromCharCode(i);
        }
        const alphabetLength = alphabet.length;
        let result = '';
        for (let i = 0; i < length; ++i) {
            result += alphabet[Math.floor(Math.random() * alphabetLength)];
        }
        return result;
    }

    // get days in month
    static getDaysInMonth(month, year) {
        return new Date(year, month, 0).getDate();
    }
}
export default Helper;

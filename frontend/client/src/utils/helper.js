class Helper {
    static formatMoney(value) {
        // split value into parts, each part contains 3 digits
        // 10000000 => 10.000.000
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
}
export default Helper;

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
}

export default Helper;

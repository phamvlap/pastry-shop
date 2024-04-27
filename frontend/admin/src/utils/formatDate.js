const formatDate = {
    // to yyyy-mm-dd
    convertToStandardFormat: (stringDate) => {
        let date = new Date();
        if (stringDate.length > 0) {
            date = new Date(stringDate);
        }
        return `${date.getFullYear()}-${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${
            date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        }`;
    },
    // to dd-mm-yyyy
    convertToViewFormat: (stringDate) => {
        let date = new Date();
        if (stringDate.length > 0) {
            date = new Date(stringDate);
        }
        return `${date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()}-${
            date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
        }-${date.getFullYear()}`;
    },
    // to mm-dd-yyyy
    convertToUSFormat: (stringDate) => {
        let date = new Date();
        if (stringDate.length > 0) {
            date = new Date(stringDate);
        }
        return `${date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1}-${
            date.getDate() < 10 ? `0${date.getDate()}` : date.getDate()
        }-${date.getFullYear()}`;
    },
};

export default formatDate;

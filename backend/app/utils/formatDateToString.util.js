export default (stringDate = '') => {
    let date = new Date();
    if(stringDate.length > 0) {
        date = new Date(stringDate);
    }
    return date.toISOString().split('T')[0] + ` ${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()}`;
}
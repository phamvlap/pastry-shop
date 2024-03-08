export default (data, exceptions = []) => {
    const escapedData = {};
    if(data) {
        Object.keys(data).forEach(key => {
            if(!exceptions.includes(key)) {
                escapedData[key] = data[key];
            }
        });
    }
    return escapedData;
}
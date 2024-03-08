export default (payload, fields) => {
    const data = {};
    fields.forEach(field => {
        if(payload[field] !== undefined){
            data[field] = payload[field];
        }
    });
    return data;
}
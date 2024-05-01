class Helper {
	static sortObject(object) {
        const sortedObject = {};
        const key = Object.keys(object).sort();
        for (let i = 0; i < key.length; i++) {
            sortedObject[key[i]] = object[key[i]];
        }
        return sortedObject;
    }
}

export default Helper;
const generateRandomString = (length = 0) => {
    let alphabet = '';
    for(let i = 'a'.charCodeAt(); i <= 'z'.charCodeAt(); ++i){
        alphabet += String.fromCharCode(i);
    }
    for(let i = 'A'.charCodeAt(); i <= 'Z'.charCodeAt(); ++i){
        alphabet += String.fromCharCode(i);
    }
    for(let i = '0'.charCodeAt(); i <= '9'.charCodeAt(); ++i){
        alphabet += String.fromCharCode(i);
    }
    const alphabetLength = alphabet.length;
    let result = '';
    for(let i = 0; i < length; ++i) {
        result += alphabet[Math.floor(Math.random() * alphabetLength)];
    }
    return result;
}

export default generateRandomString;
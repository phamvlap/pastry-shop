import config from 'config';
import dateFormat from 'dateformat';
import queryString from 'qs';
import crypto from 'crypto-js';
import { StatusCodes } from 'http-status-codes';

class VNPAYController {
    // sortObject(object) {
    // 	console.log('check');
    // 	console.log(object);
    // 	const sortedObject = {};
    // 	const key = Object.keys(object).sort();
    // 	for (let i = 0; i < key.length; i++) {
    // 		sortedObject[key[i]] = object[key[i]];
    // 	}
    // 	return sortedObject;
    // }
    // [POST]
    buildUrl(req, res, next) {
        function sortObject(object) {
            const sortedObject = {};
            const key = Object.keys(object).sort();
            for (let i = 0; i < key.length; i++) {
                sortedObject[key[i]] = object[key[i]];
            }
            return sortedObject;
        }

        const ipAddr =
            req.headers['x-forwared-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const tmnCode = config.get('vnpay_TmnCode');
        const secretKey = config.get('vnpay_HashSecret');
        let vnpUrl = config.get('vnpay_Url');
        const returnUrl = config.get('vnpay_ReturnUrl');

        const date = new Date();
        const createDate = dateFormat(date, 'YYYYMMDDHHmmss');
        const orderId = dateFormat(date, 'HHmmss');

        const amount = req.body.amount;
        const orderInfo = req.body.orderInfo;
        const orderType = req.body.orderType;
        let locale = req.body.language;
        if (locale === null || locale === '') {
            locale = 'vn';
        }
        const currCode = 'VND';

        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_CreateDate'] = createDate;
        vnp_Params['vnp_Locale'] = locale;
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId;
        vnp_Params['vnp_OrderInfo'] = orderInfo;
        vnp_Params['vnp_OrderType'] = orderType;
        vnp_Params['vnp_Amount'] = Number(amount) * 100;
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        // if(bankCode !== null && bankCode !== ''){
        // 	vnp_Params['vnp_BankCode'] = bankCode;
        // }

        vnp_Params = {
            ...sortObject(vnp_Params),
        };

        const signData = queryString.stringify(vnp_Params, {
            encode: false,
        });
        const secureHash = crypto.HmacSHA512(secretKey, signData).toString();
        vnp_Params['vnp_SecureHashType'] = 'SHA512';
        vnp_Params['vnp_SecureHash'] = secureHash;
        vnpUrl +=
            '?' +
            queryString.stringify(vnp_Params, {
                encode: false,
            });
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: {
                vnpUrl: vnpUrl,
            },
        });
    }
    // [GET]
    getIpnUrl(req, res, next) {
        const vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = this.sortObject(vnp_Params);
        const secretKey = config.get('vnpay_HashSecret');
        const signData = queryString.stringify(vnp_Params, {
            encode: false,
        });
        const checkSum = crypto.HmacSHA512(secretKey, signData).toString();

        if (secureHash === checkSum) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const rspCode = vnp_Params['vnp_ResponseCode'];
            const rspDesc = vnp_Params['vnp_Message'];
            if (rspCode === '00') {
                // Payment success
            } else {
                // Payment fail
            }
        }
    }
    // [GET]
    returnUrl(req, res, next) {
        const vnp_Params = req.query;
        const secureHash = vnp_Params['vnp_SecureHash'];

        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        vnp_Params = this.sortObject(vnp_Params);
        const secretKey = config.get('vnpay_HashSecret');
        const signData = queryString.stringify(vnp_Params, {
            encode: false,
        });
        const checkSum = crypto.HmacSHA512(secretKey, signData).toString();

        if (secureHash === checkSum) {
            const orderId = vnp_Params['vnp_TxnRef'];
            const rspCode = vnp_Params['vnp_ResponseCode'];
            const rspDesc = vnp_Params['vnp_Message'];
            if (rspCode === '00') {
                // Payment success
            } else {
                // Payment fail
            }
        }
    }
}

export default new VNPAYController();

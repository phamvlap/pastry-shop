import config from 'config';
import queryString from 'qs';
import crypto from 'crypto-js';
import { StatusCodes } from 'http-status-codes';
import moment from 'moment';
import Helper from './../utils/helper.js';

class VNPAYController {
    // [POST]
    buildUrl(req, res, next) {
        const ipAddr =
            req.headers['x-forwared-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;
        const tmnCode = config.get('vnp_TmnCode');
        const secretKey = config.get('vnp_HashSecret');
        let vnpUrl = config.get('vnp_Url');
        const returnUrl = config.get('vnp_ReturnUrl');

        const date = new Date();
        const createDate = moment(date).format('YYYYMMDDHHmmss');
        const orderId = moment(date).format('HHmmss');

        const amount = req.body.amount;
        // const orderInfo = req.body.orderInfo;
        // const orderType = req.body.orderType;
        const orderInfo = 'Test';
        const orderType = 'Other';
        let locale = req.body.language;
        if (locale === null || locale === '' || locale === undefined) {
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
        vnp_Params = {
            ...Helper.sortObject(vnp_Params),
        };

        const redirectUrl = new URL(vnpUrl);
        
        Object.keys(vnp_Params).forEach((key) => {
            if(!vnp_Params[key] || vnp_Params[key] === '' || vnp_Params[key] === undefined || vnp_Params[key] === null) {
                return;
            }
            redirectUrl.searchParams.append(key, vnp_Params[key].toString());
        })

        let hmac = crypto.algo.HMAC.create(crypto.algo.SHA512, secretKey);
        hmac.update(new Buffer(redirectUrl.search.slice(1).toString(), 'utf-8'));
        const signed = hmac.finalize().toString(crypto.enc.Hex);

        // vnp_Params['vnp_SecureHashType'] = 'SHA512';
        vnp_Params['vnp_SecureHash'] = signed;
        redirectUrl.searchParams.append('vnp_SecureHash', signed);
        return res.status(StatusCodes.OK).json({
            status: 'success',
            data: {
                vnpUrl: redirectUrl.toString(),
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

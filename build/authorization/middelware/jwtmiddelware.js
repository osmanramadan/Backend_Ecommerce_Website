"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAdmin = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;
// verify user
const verify = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
        req.body.userid = decoded.userid;
        if (req.params.userid &&
            Number(req.params.userid) !== Number(req.body.userid)) {
            res.status(403);
            res.json({
                access: 'forbidden',
                msg: 'User only access his/her data'
            });
            return;
        }
        next();
    }
    catch (e) {
        res.status(401);
        res.json({
            access: 'forbidden',
            msg: 'Invalid token or token is not provided'
        });
        return;
    }
};
// verify admin
const verifyAdmin = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;
        const token = authorizationHeader.split(' ')[1];
        const decoded = jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
        req.body.userid = decoded.userid;
        req.body.role = decoded.role;
        if (decoded.role !== 'admin_1/id=80226753244') {
            res.status(403);
            res.json({
                access: 'forbidden',
                msg: 'Admin access only'
            });
            return;
        }
        next();
    }
    catch (e) {
        res.status(401);
        res.json({
            access: 'forbidden',
            msg: 'Invalid token or token is not provided'
        });
        return;
    }
};
exports.verifyAdmin = verifyAdmin;
exports.default = verify;

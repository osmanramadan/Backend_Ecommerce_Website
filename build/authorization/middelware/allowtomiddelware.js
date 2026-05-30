"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const allowTo = (...roles) => async (req, res, next) => {
    if (!roles.includes(req.body.role)) {
        res.status(401);
        res.json({ access: 'forbidden' });
    }
    next();
};
exports.default = allowTo;

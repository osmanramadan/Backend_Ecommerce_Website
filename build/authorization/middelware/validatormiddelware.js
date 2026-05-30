"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatorMiddleware = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware = (req, res, next) => {
    // Finds the validation errors in this request and
    // wraps them in an object with handy functions
    const errors = (0, express_validator_1.validationResult)(req);
    // Check if there are any validation errors
    if (!errors.isEmpty()) {
        // If there are errors, respond with a 400 status code
        // and send the validation error messages as a JSON object
        return res.status(400).json({ validationError: errors.array()[0].msg });
    }
    // If there are no validation errors, call the 'next' middleware
    // function in the chain to proceed to the next step of request processing
    next();
};
exports.validatorMiddleware = validatorMiddleware;

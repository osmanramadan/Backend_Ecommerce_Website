"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mailgen_1 = __importDefault(require("mailgen"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const sendEmail = async (options) => {
    const config = {
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_HOST,
            pass: process.env.EMAIL_PASSWORD
        }
    };
    const transporter = nodemailer_1.default.createTransport(config);
    const MailGenerator = new mailgen_1.default({
        theme: 'default',
        product: {
            name: ' ',
            link: ' '
        }
    });
    const response = {
        body: {
            name: options.email,
            intro: 'Your reset code has arrived!',
            table: {
                data: [
                    {
                        '*****************************': 'Password Reset Code',
                        code: options.resetCode
                    }
                ]
            },
            outro: options.message
        }
    };
    const mail = MailGenerator.generate(response);
    const message = {
        from: 'dev.osmanramadan@gmail.com',
        to: options.email,
        subject: options.subject,
        html: mail
    };
    await transporter.sendMail(message);
};
exports.default = sendEmail;

"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const port = 3005;
const corsoptions = {
    origin: process.env.FRONTEND_LINK,
    optionsSuccessStatus: 200
};
app.use((0, cors_1.default)(corsoptions));
// this part is responsible for recieving data from frontend forms (data-form) and save it in the req.body
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.use(body_parser_1.default.json());
app.use(routes_1.default);
app.listen(port, async () => {
    const url = `http://localhost:${port}`;
    console.log(` open ${url} to review the project ...`);
});
exports.default = app;

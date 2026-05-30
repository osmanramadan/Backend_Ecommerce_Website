"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const brand_1 = __importDefault(require("../../controller/brand"));
const imageupload_1 = __importDefault(require("../../authorization/middelware/imageupload"));
const jwtmiddelware_1 = require("../../authorization/middelware/jwtmiddelware");
const brandValidator_1 = require("../../utils/validator/brandValidator");
const MarkController = new brand_1.default();
const mark = express_1.default.Router();
const UploadImageController = new imageupload_1.default();
mark.get('/', MarkController.index);
// Note ✨ : Image is uploaded to same server (src/uploads) and this not profassional forproduction , later , we will use external server to save image
mark.post('/', jwtmiddelware_1.verifyAdmin, UploadImageController.uploadimage, brandValidator_1.addBrandValidator, UploadImageController.resizeimage, MarkController.addmark);
mark.delete('/', jwtmiddelware_1.verifyAdmin, MarkController.deletemark);
exports.default = mark;

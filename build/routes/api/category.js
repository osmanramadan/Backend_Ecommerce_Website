"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_1 = __importDefault(require("../../controller/category"));
const imageupload_1 = __importDefault(require("../../authorization/middelware/imageupload"));
const jwtmiddelware_1 = require("../../authorization/middelware/jwtmiddelware");
const catValidator_1 = require("../../utils/validator/catValidator");
const CategoryController = new category_1.default();
const UploadImageController = new imageupload_1.default();
const category = express_1.default.Router();
category.get('/', CategoryController.index);
// Note ✨ : Image is uploaded to same server (src/uploads) and this not profassional forproduction , later , we will use external server to save image
category.post('/', jwtmiddelware_1.verifyAdmin, UploadImageController.uploadimage, catValidator_1.addCategoryValidator, UploadImageController.resizeimage, CategoryController.addcategory);
category.delete('/', jwtmiddelware_1.verifyAdmin, catValidator_1.deleteCategoryValidator, CategoryController.deletecategory);
exports.default = category;

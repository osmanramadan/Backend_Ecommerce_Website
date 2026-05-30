"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const subcategory_1 = __importDefault(require("../../controller/subcategory"));
const jwtmiddelware_1 = require("../../authorization/middelware/jwtmiddelware");
const SubCategoryController = new subcategory_1.default();
const subcategory = express_1.default.Router();
subcategory.get('/', SubCategoryController.viewsubcategories);
// To Do : add middleware to upload image for subcategory and add validation for the image (optional) , but for now , I will not add image for subcategory to make it simple
subcategory.post('/', jwtmiddelware_1.verifyAdmin, SubCategoryController.addsubcategory);
subcategory.delete('/', jwtmiddelware_1.verifyAdmin, SubCategoryController.deletesubcategory);
exports.default = subcategory;

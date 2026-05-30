"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_1 = __importDefault(require("../../controller/product"));
const product_2 = __importDefault(require("../../controller/services/product"));
const imageupload_1 = __importDefault(require("../../authorization/middelware/imageupload"));
const productcontroller = new product_1.default();
const productcontrollerservices = new product_2.default();
const products = express_1.default.Router();
const UploadImageController = new imageupload_1.default();
const productValidator_1 = require("../../utils/validator/productValidator");
const jwtmiddelware_1 = __importStar(require("../../authorization/middelware/jwtmiddelware"));
products.get('/', productcontroller.index);
products.post('/', jwtmiddelware_1.verifyAdmin, UploadImageController.uploadMultimages, productValidator_1.createProductValidator, UploadImageController.resizeimage, productcontroller.create);
products.get('/newclothes', productcontroller.newclothes);
products.get('/mostpopular', productcontrollerservices.mostpopular);
products.get('/productcate/:cate', productValidator_1.getProductsByCateValidator, productcontrollerservices.getproductsbycate);
products.get('/:id', productValidator_1.showProductValidator, productcontroller.show);
products.delete('/:id', jwtmiddelware_1.verifyAdmin, productValidator_1.deleteProductValidator, productcontroller.delete);
products.put('/', jwtmiddelware_1.verifyAdmin, UploadImageController.uploadMultimages, productValidator_1.updateProductValidator, UploadImageController.resizeimage, productcontroller.update);
products.post('/comments', jwtmiddelware_1.default, productValidator_1.createCommentValidator, productcontroller.createcomment);
products.get('/comments/:id', productValidator_1.getProductCommentsValidator, productcontroller.getproductcomments);
products.get('/showstars/:id', productValidator_1.getProductStarsValidator, productcontroller.getproductstars);
exports.default = products;

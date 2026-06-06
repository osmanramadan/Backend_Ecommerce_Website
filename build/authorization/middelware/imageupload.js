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
const multer_1 = __importStar(require("multer"));
const sharp_1 = __importDefault(require("sharp"));
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
class uploadImageController {
    constructor() {
        this.uploadimage = this.uploadSingleImage('image');
        this.uploadMultimages = this.uploadMultiImage();
        this.resizeimage = async (req, res, next) => {
            try {
                const type = req.baseUrl.split('/').pop();
                const folders = {
                    category: 'categories',
                    brand: 'brands',
                    products: 'products'
                };
                if (!type || !folders[type]) {
                    return res.status(400).json({
                        status: 'error',
                        msg: 'Invalid upload route'
                    });
                }
                // to be suitable in production render server
                //const pathimg = path.resolve(__dirname, `../../uploads/${folders[type]}`);
                const pathimg = path_1.default.join(process.cwd(), 'uploads', folders[type]);
                if (req.file) {
                    const ext = req.file.mimetype.split('/')[1];
                    const filename = `${folders[type]}-${(0, uuid_1.v4)()}-${Date.now()}.${ext}`;
                    await (0, sharp_1.default)(req.file.buffer).toFile(path_1.default.resolve(pathimg, `${filename}`));
                    req.body.filename = filename;
                    next();
                    return;
                }
                const files = req.files;
                if (files.coverimage) {
                    const ext = files.coverimage[0].mimetype.split('/')[1];
                    const imageCoverFilename = `products-${(0, uuid_1.v4)()}-${Date.now()}-cover.${ext}`;
                    await (0, sharp_1.default)(files.coverimage[0].buffer).toFile(path_1.default.resolve(pathimg, `${imageCoverFilename}`));
                    req.body.coverimage = imageCoverFilename;
                }
                req.body.images = [];
                if (files.images) {
                    await Promise.all(files.images.map(async (img, index) => {
                        const ext = img.mimetype.split('/')[1];
                        const filename = `products-${(0, uuid_1.v4)()}-${Date.now()}-${index + 1}.${ext}`;
                        await (0, sharp_1.default)(img.buffer).toFile(path_1.default.resolve(pathimg, `${filename}`));
                        req.body.images.push(filename);
                    }));
                }
                next();
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'fail',
                    msg: 'Failed to upload image from validator part',
                    error: err
                });
                return;
            }
        };
    }
    uploadSingleImage(fieldName) {
        const multerStorage = (0, multer_1.memoryStorage)();
        const multerFilter = (_req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image files are allowed'));
            }
        };
        const upload = (0, multer_1.default)({
            storage: multerStorage,
            fileFilter: multerFilter
        }).single(fieldName);
        return (req, res, next) => {
            upload(req, res, err => {
                if (err instanceof multer_1.default.MulterError) {
                    return res.status(400).json({
                        status: 'error',
                        message: 'Only one image is allowed'
                    });
                }
                if (err) {
                    return res.status(400).json({
                        status: 'error',
                        message: err.message
                    });
                }
                next();
            });
        };
    }
    // ___________________________________(0-----------0-------------0)______________________________________
    uploadMultiImage() {
        const multerStorage = (0, multer_1.memoryStorage)();
        const multerFilter = (_req, file, cb) => {
            if (file.mimetype.startsWith('image')) {
                cb(null, true);
            }
            else {
                cb(new Error('Only image files are allowed'));
            }
        };
        const upload = (0, multer_1.default)({
            storage: multerStorage,
            fileFilter: multerFilter
        }).fields([
            { name: 'images', maxCount: 3 },
            { name: 'coverimage', maxCount: 1 }
        ]);
        return (req, res, next) => {
            upload(req, res, err => {
                if (err instanceof multer_1.default.MulterError) {
                    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                        return res.status(400).json({
                            status: 'error',
                            message: 'Maximum 3 images are allowed'
                        });
                    }
                }
                if (err) {
                    return res.status(400).json({
                        status: 'error',
                        message: err.message
                    });
                }
                next();
            });
        };
    }
}
exports.default = uploadImageController;

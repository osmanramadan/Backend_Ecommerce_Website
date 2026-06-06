"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../model/services/user");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const userservices = new user_1.Userservices();
class UserServicesController {
    constructor() {
        this.userpurchases = async (req, res) => {
            try {
                const purchases = await userservices.userpurchases(req.params.userid);
                if (purchases.length > 0) {
                    const data = [];
                    for (const value of purchases) {
                        //const imagePath = path.join(
                        //__dirname,
                        //'../../uploads/products',
                        //value.coverimage
                        //);
                        const imagePath = path_1.default.join(process.cwd(), 'uploads', 'products', value.coverimage);
                        try {
                            const imageData = await fs_1.default.promises.readFile(imagePath);
                            const imgCover = imageData.toString('base64');
                            value.imageCoverData = imgCover;
                        }
                        catch (err) {
                            res.json({
                                status: 'fail',
                                msg: 'Failed to read product image' + value.id,
                                error: err
                            });
                            return;
                        }
                        data.push(value);
                    }
                    res.json({
                        status: 'success',
                        purchasesCount: data.length,
                        data: data
                    });
                    return;
                }
                res.status(404);
                res.json({
                    status: 'success',
                    msg: 'No purchases found',
                    purchasesCount: 0,
                    data: []
                });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'error',
                    error: `Failed to retrieve user purchases: ${err}`
                });
                return;
            }
        };
    }
}
exports.default = UserServicesController;

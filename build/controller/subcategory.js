"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const subcategory_1 = require("../model/subcategory");
const subcategoryobject = new subcategory_1.SubCategory();
class SubCategorycontroller {
    constructor() {
        this.addsubcategory = async (req, res) => {
            try {
                const subcategory = {
                    name: req.body.name,
                    maincat: req.body.maincat
                };
                const result = await subcategoryobject.create(subcategory);
                if (result && typeof result === 'object') {
                    res.json({ status: 'success', msg: 'subcategory added successfully', data: result });
                    return;
                }
                else {
                    res.status(400);
                    res.json({ status: 'error', msg: 'An error occurred while adding the subcategory' });
                    return;
                }
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'error',
                    msg: 'An error occurred while adding the subcategory'
                });
                return;
            }
        };
        this.index = async (_req, res) => {
            try {
                const result = await subcategoryobject.index();
                if (result.length > 0) {
                    res.json({ status: 'success', subcategoriesCount: result.length, msg: 'subcategories retrieved successfully', data: result });
                    return;
                }
                res.status(404);
                res.json({ status: 'success', subcategoriesCount: 0, msg: 'No subcategories found', data: [] });
                return;
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'error',
                    msg: 'An error occurred while retrieving subcategories'
                });
                return;
            }
        };
        this.deletesubcategory = async (req, res) => {
            try {
                const result = await subcategoryobject.deletesubcategory(req.body.name);
                if (result) {
                    res.json({
                        status: 'success',
                        msg: 'subcategory deleted successfully'
                    });
                    return;
                }
                else {
                    res.status(404);
                    res.json({
                        status: 'fail',
                        msg: 'subcategory not found , it may be deleted or name isnt true'
                    });
                    return;
                }
            }
            catch (err) {
                res.status(400);
                res.json({
                    status: 'error',
                    msg: 'An error occurred while deleting the subcategory'
                });
                return;
            }
        };
    }
}
exports.default = SubCategorycontroller;

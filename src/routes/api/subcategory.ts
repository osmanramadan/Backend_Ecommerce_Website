import express from 'express';
import SubCategorycontroller from '../../controller/subcategory';
import { verifyAdmin } from '../../authorization/middelware/jwtmiddelware';
import { addSubCategoryValidator, deleteSubCategoryValidator } from '../../utils/validator/subcatValidator';

const SubCategoryController = new SubCategorycontroller();
const subcategory: express.Router = express.Router();

subcategory.get('/', SubCategoryController.index);
// To Do : add middleware to upload image for subcategory and add validation for the image (optional) , but for now , I will not add image for subcategory to make it simple
subcategory.post('/', verifyAdmin, addSubCategoryValidator, SubCategoryController.addsubcategory);

subcategory.delete('/', verifyAdmin, deleteSubCategoryValidator, SubCategoryController.deletesubcategory);

export default subcategory;

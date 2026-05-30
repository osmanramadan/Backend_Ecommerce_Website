import express from 'express';
import SubCategorycontroller from '../../controller/subcategory';
import { verifyAdmin } from '../../authorization/middelware/jwtmiddelware';

const SubCategoryController = new SubCategorycontroller();
const subcategory: express.Router = express.Router();

subcategory.get('/', SubCategoryController.viewsubcategories);
// To Do : add middleware to upload image for subcategory and add validation for the image (optional) , but for now , I will not add image for subcategory to make it simple
subcategory.post('/', verifyAdmin, SubCategoryController.addsubcategory);

subcategory.delete('/', verifyAdmin, SubCategoryController.deletesubcategory);

export default subcategory;

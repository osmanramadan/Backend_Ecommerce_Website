import express from 'express';
import Categorycontroller from '../../controller/category';
import uploadImageController from '../../authorization/middelware/imageupload';
import { verifyAdmin } from '../../authorization/middelware/jwtmiddelware';
import { addCategoryValidator } from '../../utils/validator/catValidator';

const CategoryController = new Categorycontroller();
const UploadImageController = new uploadImageController();
const category: express.Router = express.Router();

category.get('/', CategoryController.index);

// Note ✨ : Image is uploaded to same server (src/uploads) and this not profassional forproduction , later , we will use external server to save image
category.post(
  '/',
  verifyAdmin,
  UploadImageController.uploadimage,
  addCategoryValidator,
  UploadImageController.resizeimage,
  CategoryController.addcategory
);

category.delete('/', verifyAdmin, CategoryController.deletecategory);

export default category;

import express from 'express';
import Productcontroller from '../../controller/product';
import ProductServicesController from '../../controller/services/product';
import uploadImageController from '../../authorization/middelware/imageupload';

const productcontroller = new Productcontroller();
const productcontrollerservices = new ProductServicesController();
const products: express.Router = express.Router();
const UploadImageController = new uploadImageController();
import {
  createCommentValidator,
  createProductValidator,
  deleteProductValidator,
  getProductCommentsValidator,
  getProductsByCateValidator,
  getProductStarsValidator,
  showProductValidator,
  updateProductValidator
} from '../../utils/validator/productValidator';
import verify, {
  verifyAdmin
} from '../../authorization/middelware/jwtmiddelware';

products.get('/', productcontroller.index);
products.post(
  '/',
  verifyAdmin,
  UploadImageController.uploadMultimages,
  createProductValidator,
  UploadImageController.resizeimage,
  productcontroller.create
);
products.get('/newclothes', productcontroller.newclothes);
products.get('/mostpopular', productcontrollerservices.mostpopular);
products.get(
  '/productcate/:cate',
  getProductsByCateValidator,
  productcontrollerservices.getproductsbycate
);
products.get('/:id', showProductValidator, productcontroller.show);

products.delete(
  '/:id',
  verifyAdmin,
  deleteProductValidator,
  productcontroller.delete
);
products.put(
  '/',
  verifyAdmin,
  UploadImageController.uploadMultimages,
  updateProductValidator,
  UploadImageController.resizeimage,
  productcontroller.update
);

products.post(
  '/comments',
  verify,
  createCommentValidator,
  productcontroller.createcomment
);
products.get(
  '/comments/:id',
  getProductCommentsValidator,
  productcontroller.getproductcomments
);
products.get(
  '/showstars/:id',
  getProductStarsValidator,
  productcontroller.getproductstars
);

export default products;

import express from 'express';
import Markcontroller from '../../controller/brand';
import uploadImageController from '../../authorization/middelware/imageupload';
import { verifyAdmin } from '../../authorization/middelware/jwtmiddelware';
import { addBrandValidator } from '../../utils/validator/brandValidator';

const MarkController = new Markcontroller();
const mark: express.Router = express.Router();
const UploadImageController = new uploadImageController();

mark.get('/', MarkController.index);
// Note ✨ : Image is uploaded to same server (src/uploads) and this not profassional forproduction , later , we will use external server to save image

mark.post(
  '/',
  verifyAdmin,
  UploadImageController.uploadimage,
  addBrandValidator,
  UploadImageController.resizeimage,
  MarkController.addmark
);

mark.delete('/', verifyAdmin, MarkController.deletemark);

export default mark;

import multer, { memoryStorage, FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import ProductFiles from '../../types/express';

export default class uploadImageController {
  uploadSingleImage(fieldName: string) {
    const multerStorage = memoryStorage();

    const multerFilter = (
      _req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    };

    const upload = multer({
      storage: multerStorage,
      fileFilter: multerFilter
    }).single(fieldName);

    return (req: Request, res: Response, next: NextFunction) => {
      upload(req, res, err => {
        if (err instanceof multer.MulterError) {
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
  uploadimage = this.uploadSingleImage('image');

  // ___________________________________(0-----------0-------------0)______________________________________

  uploadMultiImage() {
    const multerStorage = memoryStorage();

    const multerFilter = (
      _req: Request,
      file: Express.Multer.File,
      cb: FileFilterCallback
    ) => {
      if (file.mimetype.startsWith('image')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed'));
      }
    };

    const upload = multer({
      storage: multerStorage,
      fileFilter: multerFilter
    }).fields([
      { name: 'images', maxCount: 3 },
      { name: 'coverimage', maxCount: 1 }
    ]);

    return (req: Request, res: Response, next: NextFunction) => {
      upload(req, res, err => {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_UNEXPECTED_FILE') {
            return res.status(400).json({
              status: 'error',
              message:
                'Maximum 3 images are allowed for images and 1 for coverimage'
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
  uploadMultimages = this.uploadMultiImage();

  resizeimage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const type = req.baseUrl.split('/').pop();

      const folders: Record<string, string> = {
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
      const pathimg = path.join(process.cwd(), 'uploads', folders[type]);

      if (req.file) {
        const ext = req.file.mimetype.split('/')[1];
        const filename = `${folders[type]}-${uuidv4()}-${Date.now()}.${ext}`;

        await sharp(req.file.buffer).toFile(
          path.resolve(pathimg, `${filename}`)
        );

        req.body.filename = filename;
        next();
        return;
      }
      const files = req.files as ProductFiles;
      if (files.coverimage) {
        const ext = files.coverimage[0].mimetype.split('/')[1];
        const imageCoverFilename = `products-${uuidv4()}-${Date.now()}-cover.${ext}`;

        await sharp(files.coverimage[0].buffer).toFile(
          path.resolve(pathimg, `${imageCoverFilename}`)
        );

        req.body.coverimage = imageCoverFilename;
      }

      req.body.images = [];

      if (files.images) {
        await Promise.all(
          files.images.map(async (img, index) => {
            const ext = img.mimetype.split('/')[1];
            const filename = `products-${uuidv4()}-${Date.now()}-${
              index + 1
            }.${ext}`;

            await sharp(img.buffer).toFile(
              path.resolve(pathimg, `${filename}`)
            );

            req.body.images.push(filename);
          })
        );
      }

      next();
    } catch (err: unknown) {
      res.status(400);
      res.json({
        status: 'error',
        msg: 'Failed to upload image from validator part',
        error: err instanceof Error ? err.message : 'Unknown error'
      });
      return;
    }
  };
}

import { Request, Response } from 'express';
import { Product } from '../model/product';
import { product, prodComment } from '../types/product';
import fs from 'fs';
import path from 'path';

const productobject = new Product();

export default class Productcontroller {
  index = async (_req: Request, res: Response) => {
    try {
      const allproducts: product[] | [] = await productobject.index();
      if (allproducts.length > 0) {
        const data: product[] = [];

        for (const value of allproducts) {
          // const imagePath = path.join(
          // __dirname,
          //'../uploads/products',
          //value.coverimage
          //);
          const imagePath = path.join(
            process.cwd(),
            'uploads',
            'products',
            value.coverimage
          );

          try {
            const imageData = await fs.promises.readFile(imagePath);
            const imgCover = { imageCoverData: imageData.toString('base64') };
            const imagesData = [];
            let rate = 0;

            if (value.images && value.images.length > 0) {
              for (const img of value.images) {
                // const imagePath = path.join(
                // __dirname,
                //'../uploads/products',
                //img
                //);
                const imagePath = path.join(
                  process.cwd(),
                  'uploads',
                  'products',
                  value.coverimage
                );
                const imageData = await fs.promises.readFile(imagePath);
                imagesData.push(imageData.toString('base64'));
              }
            }

            const imgsData = { imagesData: imagesData };

            const stars: prodComment = await productobject.getproductstars(
              value.id as unknown as string
            );

            if (stars.sumstar && stars.numstar) {
              rate = stars.sumstar / stars.numstar;
            }

            const rateProduct = { rate: rate };
            data.push({ ...value, ...rateProduct, ...imgsData, ...imgCover });
          } catch (err) {
            res.json({
              status: 'fail',
              msg:
                'Failed to load image for product with id ' +
                value.id +
                ' or rate for product '
            });
            return;
          }
        }

        res.json({
          status: 'success',
          productsCount: data.length,
          msg: 'Products loaded successfully',
          data: data
        });
        return;
      }
      res.status(404);
      res.json({ status: 'success', data: [] });
      return;
    } catch (e) {
      res.status(400);
      res.json({ status: 'fail', msg: 'Failed to load products' });
    }
  };

  show = async (req: Request, res: Response) => {
    try {
      const productbyid: product | boolean = await productobject.show(
        req.params.id
      );

      if (productbyid && typeof productbyid === 'object') {
        const data = [];
        const imagePath = path.join(
          __dirname,
          '../uploads/products',
          productbyid.coverimage as string
        );

        try {
          const imageData = await fs.promises.readFile(imagePath);

          const imgCover = { imageCoverData: imageData.toString('base64') };
          const imagesData = [];
          let rate = 0;
          if (productbyid.images && productbyid.images.length > 0) {
            for (const img of productbyid.images) {
              const imagePath = path.join(
                __dirname,
                '../uploads/products',
                img
              );
              const imageData = await fs.promises.readFile(imagePath);
              imagesData.push(imageData.toString('base64'));
            }
          }

          const imgsData = { imagesData: imagesData };
          const stars: prodComment = await productobject.getproductstars(
            productbyid.id as unknown as string
          );

          if (stars.sumstar && stars.numstar) {
            rate = stars.sumstar / stars.numstar;
          }
          const rateProduct = { rate: rate };

          data.push({
            ...productbyid,
            ...rateProduct,
            ...imgCover,
            ...imgsData
          });
        } catch (err) {
          res.json({
            status: 'fail',
            msg:
              'Failed to load image or stars for product ' + productbyid.ptitle
          });
          return;
        }

        res.json({ status: 'success', data: data[0] });
        return;
      }
      res.status(404);
      res.json({
        status: 'fail',
        msg: 'No product found with id ' + req.params.id
      });
      return;
    } catch (e) {
      res.status(404);
      return res.json({
        status: 'fail',
        msg: 'No product found with id ' + req.params.id
      });
    }
  };

  newclothes = async (_req: Request, res: Response) => {
    try {
      const items: product[] | [] = await productobject.newclothes('ملابس');

      if (items.length > 0) {
        const data: product[] = [];

        for (const value of items) {
          const imagePath = path.join(
            __dirname,
            '../uploads/products',
            value.coverimage
          );

          try {
            const imageData = await fs.promises.readFile(imagePath);

            const imgCover = { imageCoverData: imageData.toString('base64') };
            const imagesData = [];
            let rate = 0;

            if (value.images && value.images.length > 0) {
              for (const img of value.images) {
                const imagePath = path.join(
                  __dirname,
                  '../uploads/products',
                  img
                );
                const imageData = await fs.promises.readFile(imagePath);
                imagesData.push(imageData.toString('base64'));
              }
            }
            const imgsData = { imagesData: imagesData };

            const stars: prodComment = await productobject.getproductstars(
              value.id as unknown as string
            );

            if (stars.sumstar && stars.numstar) {
              rate = stars.sumstar / stars.numstar;
            }
            const rateProduct = { rate: rate };
            data.push({ ...value, ...rateProduct, ...imgCover, ...imgsData });
          } catch (err) {
            res.json({
              status: 'fail',
              msg: 'Failed to load image for product with id ' + value.id
            });
            return;
          }
        }

        res.json({ status: 'success', productCount: data.length, data: data });
        return;
      }
      res.status(404);
      res.json({ status: 'success', msg: 'No products found', data: [] });
      return;
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail', msg: 'Failed to load products' });
      return;
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const deleted = await productobject.deleteproduct(req.params.id);

      if (deleted) {
        res.json({ status: 'success', msg: 'Product deleted successfully' });
        return;
      } else {
        res.json({ status: 'fail', msg: 'Failed to delete product' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail', msg: 'Failed to delete product' });
      return;
    }
  };

  update = async (req: Request, res: Response) => {
    const subcategory = req.body.subcategory.split(',');
    const colors = req.body.colors.split(',');

    //🍳 There is a problem here if  user want to update field , he should provide all other fields .

    const data: product = {
      id: req.body.id,
      ptitle: req.body.ptitle,
      pdesc: req.body.pdesc,
      price: req.body.price,
      discount: req.body.discount,
      priceafterdiscount: req.body.priceafterdiscount,
      category: req.body.category,
      subcategory: subcategory,
      brand: req.body.brand,
      colors: colors,
      images: req.body.images,
      coverimage: req.body.coverimage
    };

    try {
      const updated = await productobject.updateproduct(data);

      if (updated) {
        res.json({ status: 'success', msg: 'Product updated successfully' });
        return;
      } else {
        res.json({ status: 'fail', msg: 'Failed to update product' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({
        status: 'fail',
        msg: 'Failed to update product',
        error: err
      });
      return;
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const subcategory = req.body.subcategory.split(',');
      const colors = req.body.colors.split(',');

      const data: product = {
        ptitle: req.body.ptitle,
        pdesc: req.body.pdesc,
        price: req.body.price,
        discount: req.body.discount,
        priceafterdiscount: req.body.priceafterdiscount,
        category: req.body.category,
        subcategory: subcategory,
        brand: req.body.brand,
        colors: colors,
        images: req.body.images,
        coverimage: req.body.coverimage
      };

      const newproduct = await productobject.create(data);
      if (newproduct) {
        res.json({
          status: 'success',
          message: 'Product created successfully',
          data: newproduct
        });
        return;
      } else {
        res.json({ status: 'fail', msg: 'Failed to create product' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({
        status: 'fail',
        msg: 'Failed to create product',
        error: err
      });
      return;
    }
  };

  createcomment = async (req: Request, res: Response) => {
    try {
      const comment: prodComment = {
        prodid: req.body.productId,
        username: req.body.username,
        text: req.body.text,
        stars: req.body.stars
      };

      const newcomment = await productobject.addComment(comment);
      if (newcomment) {
        res.json({
          status: 'success',
          Message: 'Comment added successfully',
          data: newcomment
        });
        return;
      } else {
        res.json({ status: 'fail', msg: 'Failed to add comment' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({ status: 'fail', msg: 'Failed to add comment' });
      return;
    }
  };

  getproductcomments = async (req: Request, res: Response) => {
    try {
      const comments = await productobject.showcomments(req.params.id);
      if (comments) {
        res.json({
          status: 'success',
          msg: 'Comments retrieved successfully',
          data: comments
        });
        return;
      } else {
        res.status(404);
        res.json({
          status: 'fail',
          msg: 'Comments not found for the product',
          data: []
        });
        return;
      }
    } catch (e) {
      res.status(400);
      res.json({ status: 'fail', msg: 'Failed to get comments' });
      return;
    }
  };

  getproductstars = async (req: Request, res: Response) => {
    try {
      const proStars: prodComment = await productobject.getproductstars(
        req.params.id
      );

      if (proStars.numstar && proStars.sumstar) {
        res.json({
          status: 'success',
          message: 'Stars retrieved successfully',
          data: proStars,
          rate: proStars.sumstar / proStars.numstar
        });
        return;
      } else {
        res.status(404);
        res.json({ status: 'No stars', msg: 'No stars found for the product' });
        return;
      }
    } catch (e) {
      res.status(400);
      res.json({ status: 'fail', msg: 'Failed to get stars' });
      return;
    }
  };
}

import { Request, Response } from 'express';
import { subcategory } from '../types/subcategory';
import { SubCategory } from '../model/subcategory';

const subcategoryobject = new SubCategory();

export default class SubCategorycontroller {

  addsubcategory = async (req: Request, res: Response) => {
    try {
      
      const subcategory: subcategory = {
        name: req.body.name,
        maincat: req.body.maincat
      };


      const result : subcategory | boolean = await subcategoryobject.create(subcategory);

      if (result && typeof result === 'object') {
        res.json({ status: 'success', msg: 'subcategory added successfully', data: result });
        return;
      } else {
        res.status(400);
        res.json({ status: 'error', msg: 'An error occurred while adding the subcategory' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({
        status: 'error',
        msg: 'An error occurred while adding the subcategory'
      });
      return;
    }
  };

  index = async (_req: Request, res: Response) => {
    try {

      const result = await subcategoryobject.index();

      if (result.length > 0) {
        res.json({ status: 'success',subcategoriesCount: result.length , msg: 'subcategories retrieved successfully', data: result });
        return;
      }
      res.status(404);
      res.json({ status: 'success', subcategoriesCount: 0, msg: 'No subcategories found', data: [] });
      return;
    } catch (err) {
      res.status(400);
      res.json({
        status: 'error',
        msg: 'An error occurred while retrieving subcategories'
      });
      return;
    }
  };

  deletesubcategory = async (req: Request, res: Response) => {
    try {

      const result = await subcategoryobject.deletesubcategory(req.body.name);

      if (result) {
        res.json({
          status: 'success',
          msg: 'subcategory deleted successfully'
        });
        return;
      } else {
        res.status(404);
        res.json({
          status: 'fail',
          msg: 'subcategory not found , it may be deleted or name isnt true'
        });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({
        status: 'error',
        msg: 'An error occurred while deleting the subcategory'
      });
      return;
    }
  };
}

import { Request, Response } from 'express';
import { subcategory } from '../types/subcategory';
import { SubCategory } from '../model/subcategory';

const subcategoryobject = new SubCategory();

export default class SubCategorycontroller {
  addsubcategory = async (req: Request, res: Response) => {
    try {
      if (!req.body.name) {
        res.json({ error: 'Name of subcategory should be provided (name)' });
        return;
      }

      if (!req.body.maincat) {
        res.json({ error: 'Main category should be provided (maincat)' });
        return;
      }

      const subcategory: subcategory = {
        name: req.body.name,
        maincat: req.body.maincat
      };

      const subexist = await subcategoryobject.checksubcategoryexist(
        req.body.name
      );

      if (subexist) {
        res.json({ status: 'exist', msg: 'subcategory already exist' });
        return;
      }

      const exist = await subcategoryobject.checkcategoryexist(
        req.body.maincat
      );

      if (!exist) {
        res.status(404);
        res.json({
          status: 'main_category_not_found',
          msg: 'main category does not exist'
        });
        return;
      }

      const result = await subcategoryobject.create(subcategory);
      if (result) {
        res.json({ status: 'success', msg: 'subcategory added successfully' });
        return;
      } else {
        res.json({ status: 'fail', msg: 'failed to add subcategory' });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({
        status: 'fail',
        msg: 'An error occurred while adding the subcategory'
      });
      return;
    }
  };

  viewsubcategories = async (_req: Request, res: Response) => {
    try {
      const result = await subcategoryobject.index();
      if (result) {
        res.json({ status: 'success', data: result });
        return;
      }
      res.json({ status: 'fail', msg: 'Failed to retrieve subcategories' });
      return;
    } catch (err) {
      res.status(400);
      res.json({
        status: 'fail',
        msg: 'An error occurred while retrieving subcategories'
      });
      return;
    }
  };

  deletesubcategory = async (req: Request, res: Response) => {
    try {
      if (!req.body.name) {
        res.json({ error: 'Name of subcategory should be provided (name)' });
        return;
      }

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
          msg: 'Subcategory not found or its name is false'
        });
        return;
      }
    } catch (err) {
      res.status(400);
      res.json({
        status: 'fail',
        msg: 'An error occurred while deleting the subcategory'
      });
      return;
    }
  };
}

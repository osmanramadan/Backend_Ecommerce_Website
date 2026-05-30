import express from 'express';
import Ordercontroller from '../../controller/order';
import OrderServicesController from '../../controller/services/order';
import verify, {
  verifyAdmin
} from '../../authorization/middelware/jwtmiddelware';
import {
  addproductTOorderValidator,
  createorderValidator,
  deleteorderValidator,
  checkforuseridValidator,
  updateorderstatusValidator
} from '../../utils/validator/orderValidator';

const ordercontroller = new Ordercontroller();
const ordercontrollerservices = new OrderServicesController();
const orders: express.Router = express.Router();

orders.get('/:userid', verify, checkforuseridValidator, ordercontroller.show);
orders.get('/', verifyAdmin, ordercontroller.index);
// here may exist update when connect to frontend
orders.post('/', verify, createorderValidator, ordercontroller.create);
orders.put(
  '/status',
  verifyAdmin,
  updateorderstatusValidator,
  ordercontroller.updateorderstatus
);
orders.delete(
  '/:orderId',
  verifyAdmin,
  deleteorderValidator,
  ordercontroller.delete
);
// here may exist update when connect to frontend
orders.post(
  '/addproductTOorder',
  verify,
  addproductTOorderValidator,
  ordercontroller.addproductTOorder
);
orders.get(
  '/active/:userid',
  verify,
  checkforuseridValidator,
  ordercontrollerservices.useractiveorders
);
orders.get(
  '/complete/:userid',
  verify,
  checkforuseridValidator,
  ordercontrollerservices.usercompleteorders
);

export default orders;

import express from 'express';
import Addresscontroller from '../../controller/address';
import {
  addAddressValidator,
  deleteAddressValidator,
  getUserAddressValidator,
  updateAddressValidator
} from '../../utils/validator/addressValidator';
import verify from '../../authorization/middelware/jwtmiddelware';

const AddressController = new Addresscontroller();
const addresses: express.Router = express.Router();

addresses.get(
  '/:email',
  verify,
  getUserAddressValidator,
  AddressController.viewuseraddress
);
addresses.post('/', verify, addAddressValidator, AddressController.addaddress);
addresses.delete(
  '/:email',
  verify,
  deleteAddressValidator,
  AddressController.deleteuseraddress
);
addresses.put(
  '/:email',
  verify,
  updateAddressValidator, 
  AddressController.updateuseraddress
);

export default addresses;

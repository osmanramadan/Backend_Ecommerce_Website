"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const address_1 = require("../model/address");
const addressobject = new address_1.Address();
class Addresscontroller {
    constructor() {
        this.addaddress = async (req, res) => {
            try {
                const result = await addressobject.adduseraddress(req.body.email, req.body.addrtitle, req.body.addrdetails, req.body.phone);
                if (result) {
                    res.json({
                        status: 'success',
                        msg: 'Address added successfully'
                    });
                    return;
                }
                else {
                    res.status(400);
                    res.json({ status: 'fail', msg: 'Failed to add address' });
                    return;
                }
            }
            catch (err) {
                res.status(400);
                res.json({ status: 'error', msg: 'Error occurred while adding address' });
            }
        };
        this.viewuseraddress = async (req, res) => {
            try {
                const result = await addressobject.viewuseraddress(req.params.email);
                if (result && Array.isArray(result)) {
                    res.json({
                        status: 'success',
                        addressCount: result.length,
                        data: result
                    });
                    return;
                }
                else {
                    res.status(404);
                    res.json({
                        status: 'No address',
                        msg: 'No address found for this user'
                    });
                    return;
                }
            }
            catch (err) {
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to retrieve addresses' });
                return;
            }
        };
        this.deleteuseraddress = async (req, res) => {
            try {
                const result = await addressobject.deleteuseraddress(req.body.addressId);
                if (result) {
                    res.json({ status: 'success', msg: 'Address deleted successfully' });
                    return;
                }
                else {
                    res.status(404);
                    res.json({
                        status: 'No address',
                        msg: 'No address found with the provided ID'
                    });
                    return;
                }
            }
            catch (err) {
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to delete address' });
                return;
            }
        };
        this.updateuseraddress = async (req, res) => {
            try {
                const result = await addressobject.updateuseraddress(req.body.addrtitle, req.body.addrdetails, req.body.phone, req.body.addressId);
                if (result) {
                    res.json({ status: 'success', msg: 'Address updated successfully' });
                    return;
                }
                else {
                    res.status(404);
                    res.json({
                        status: 'fail',
                        msg: 'No address found with the provided ID'
                    });
                    return;
                }
            }
            catch (err) {
                res.status(400);
                res.json({ status: 'error', msg: 'Failed to update address' });
                return;
            }
        };
    }
}
exports.default = Addresscontroller;

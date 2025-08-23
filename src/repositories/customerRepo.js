import CustomerModel from '../models/CustomerModel.js';

export function create(data) {
    const customer = new CustomerModel(data);
    return customer.save();
}

export function getAllCustomers(options) {
    const { offset, limit } = options;
    return CustomerModel
        .find()
        .skip(offset)
        .limit(limit)
}

export function countCustomers() {
    return CustomerModel.countDocuments();
}

export function getCustomerById(id) {
    return CustomerModel.findById(id);
}

export function updateCustomer(id, data) {
    return CustomerModel.findByIdAndUpdate(id, data, { new: true, upsert: false });
}


export default {
    updateCustomer,
}

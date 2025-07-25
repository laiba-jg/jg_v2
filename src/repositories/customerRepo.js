import CustomerModel from '../models/CustomerModel.js';

export async function create(data) {
    const customer = new CustomerModel(data);
    return await customer.save();
}

export async function getById(id) {
    return await CustomerModel.findById(id);
}

export async function updateCustomer(id, data) {
    return await CustomerModel.findByIdAndUpdate(id, data, { new: false });
}

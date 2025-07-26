import Transaction from '../models/TransactionModel.js';

export const getAllTransactions = (options) => {
    const { offset, limit, order, transactionType } = options;
    const where = transactionType ? { transactionType } : {};

    return Transaction.findAndCountAll({
        where,
        attributes: {
            exclude: ['costPrice', 'updatedAt']
        },
        offset,
        limit,
        order
    }, {});
}
export const getTransactionById = (id) => Transaction.findByPk(id);

export const createTransaction = (data) => Transaction.create(data);


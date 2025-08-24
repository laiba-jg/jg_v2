import Transaction from '../models/TransactionModel.js';
import settings from '../config/defaults.js';
import mongoose from 'mongoose';


export const getAllTransactions = (options) => {
    const { offset, limit, transactionType, from, to } = options;
    const where = {};
    if (transactionType) where.transactionType = transactionType;
    if (from) where.createdAt = { $gte: new Date(from), $lte: new Date(to) };

    const promiseData = Transaction
        .find(where)
        .sort({ createdAt: -1 })
        .skip(offset)
        .limit(limit);

    const promiseCount = Transaction.countDocuments(where);

    return [promiseData, promiseCount];
}
export const getTransactionById = (id) => Transaction.findByPk(id);

export const createTransaction = (data) => Transaction.create(data);

export const getTransactionsByCustomerId = (customerId, options) => {
    const { offset, limit, order } = options;

    return Transaction.findAndCountAll({
        where: { customerId },
        attributes: {
            exclude: ['costPrice', 'updatedAt']
        },
        offset,
        limit,
        order
    }, {});
}

export const getCustomerTransactionSummary = (customerId) => {
    // 72hrs
    const cooldownCutoff = new Date(Date.now() - settings.coolDownHours * 60 * 60 * 1000);
    const objectId = new mongoose.Types.ObjectId(customerId);
    const stages = [
        { $match: { customerId: objectId } },
        {
            $facet: {
                totalBuys: [
                    { $match: { transactionType: "Buy" } },
                    { $group: { _id: null, total: { $sum: '$quantity' } } }
                ],
                totalSells: [
                    { $match: { transactionType: "Sell" } },
                    { $group: { _id: null, total: { $sum: '$quantity' } } }
                ],
                totalRedeems: [
                    { $match: { transactionType: "Redeem" } },
                    { $group: { _id: null, total: { $sum: '$quantity' } } }
                ],
                eligibleToSell: [
                    { $match: { transactionType: "Buy", createdAt: { $lt: cooldownCutoff } } },
                    { $group: { _id: null, total: { $sum: '$quantity' } } }
                ]
            }
        },
        {
            $project: {
                buyQty: { $ifNull: [{ $arrayElemAt: ['$totalBuys.total', 0] }, 0] },
                sellQty: { $ifNull: [{ $arrayElemAt: ['$totalSells.total', 0] }, 0] },
                redeemQty: { $ifNull: [{ $arrayElemAt: ['$totalRedeems.total', 0] }, 0] },
                eligibleQty: { $ifNull: [{ $arrayElemAt: ['$eligibleToSell.total', 0] }, 0] }
            }
        },
        {
            $addFields: {
                availableInVault: {
                    $subtract: [
                        '$buyQty',
                        { $add: ['$sellQty', '$redeemQty'] }
                    ]
                },
                availableToSell: {
                    $subtract: [
                        '$eligibleQty',
                        { $add: ['$sellQty', '$redeemQty'] }
                    ]
                }
            }
        }
    ];
    return Transaction.aggregate(stages);
}

export const aggregateTransactionsByType = () => Transaction.aggregate([
    {
        $group: {
            _id: "$transactionType",
            count: { $sum: 1 },
        }
    },
    {
        $project: {
            _id: 0,
            type: "$_id",
            count: 1
        }
    }
]);

export const aggregateTransactionQuantityByType = (options) => {
    const { from, to } = options;
    if (!from)
        return Transaction.aggregate([
            {
                $group: {
                    _id: "$transactionType",
                    totalQuantity: { $sum: "$quantity" }
                }
            }, {
                $project: {
                    _id: 0,
                    type: "$_id",
                    count: '$totalQuantity'
                }
            }
        ]);
    const fromDt = new Date(from);
    const toDt = new Date(to);
    return Transaction.aggregate([
        {
            $match: { createdAt: { $gte: fromDt, $lte: toDt } }
        },
        {
            $group: {
                _id: "$transactionType",
                totalQuantity: { $sum: "$quantity" }
            }
        }, {
            $project: {
                _id: 0,
                type: "$_id",
                count: '$totalQuantity'
            }
        }
    ]);
}

export const getTransactionByCustomerId = (customerId) => {
    return Transaction.find({ customerId });
};
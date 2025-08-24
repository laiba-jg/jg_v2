import { TransactionType } from "./enums.js";

function getCurrentBuyAndAvgBuyPrice(transactions) {
    let lots = [];   // each lot = { qty, price }

    for (const tx of transactions) {
        const { quantity, transactionType, retailPrice } = tx;

        if (transactionType === TransactionType.BUY)
            lots.push({ quantity, retailPrice });

        else if (transactionType === TransactionType.SELL || transactionType === TransactionType.REDEEM) {
            let qtyToSell = quantity;

            while (qtyToSell > 0 && lots.length > 0) {
                const lot = lots[0];

                if (lot.quantity <= qtyToSell) {
                    // Entire lot consumed
                    qtyToSell -= lot.qty;

                    lots.shift();
                } else {
                    lot.quantity -= qtyToSell;
                    qtyToSell = 0;
                }
            }
        }
    }

    // Remaining holdings
    const totalQty = lots.reduce((sum, l) => sum + l.quantity, 0);
    const totalCost = lots.reduce((sum, l) => sum + l.quantity * l.retailPrice, 0);
    const avgPrice = totalQty > 0 ? totalCost / totalQty : 0;

    return {
        avgBuyPrice: avgPrice,
        currentQuantity: totalQty,
        investedAmount: totalCost,
    };
}

function getCustomerTransactionSummary(transactions) {
    return getCurrentBuyAndAvgBuyPrice(transactions);
    // TODO: add available to sell and locked in 
}

export default {
    getCustomerTransactionSummary,
}
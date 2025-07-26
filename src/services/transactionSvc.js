import { getLatestGoldPrice } from "../repositories/goldPriceRepo.js";
import { createTransaction } from "../repositories/transactionRepo.js";
import { getCustomerById } from "../repositories/customerRepo.js";
import CustomerNotFoundError from "../errors/CustomerNotFound.js";
import KYCPendingError from "../errors/KYCPendingError.js";
import KYCRejectedError from "../errors/KYCRejectedError.js";
import NoKYCError from "../errors/NoKYCError.js";
import NoGoldPriceError from "../errors/NoGoldPriceError.js";
import InvalidTransactionError from "../errors/InvalidTransactionError.js";
import InvalidQuantityError from "../errors/InvalidQuantity.js";
import { KYCStatus, PaymentMode, TransactionType } from "../util/enums.js";
import Decimal from "decimal.js";
import InvalidAmountError from "../errors/InvalidAmountError.js";


const hasKYC = (customer) => {
    return customer.kyc.status === KYCStatus.APPROVED ||
        (customer.kyc?.manualApproved === true && customer.kyc?.manualApprovalStatus === KYCStatus.APPROVED);
};

const getTransferCharges = (paymentMode, totalAmount) => {
    let percent = 0;
    switch (paymentMode) {
        case PaymentMode.BANK_TRANSFER:
            percent = 0;
            break;
        case PaymentMode.DEBIT_CARD:
        case PaymentMode.CREDIT_CARD:
        case PaymentMode.GOOGLE_PAY:
        case PaymentMode.APPLE_PAY:
            percent = 0.03; // 3% for card payments
            break;
    }
    return new Decimal(totalAmount * percent).toDecimalPlaces(2);
};

const getQty = (amount, pricePerGram) => {
    return new Decimal(amount).dividedBy(new Decimal(pricePerGram)).toDecimalPlaces(5);
};

const buyGoldByQuantity = async (customerId, data) => {
    const { quantity, paymentMode, paymentGateway, paymentTransactionId } = data;
    if (quantity <= 0) throw new InvalidQuantityError();
    const latestGoldPrice = await getLatestGoldPrice();
    if (!latestGoldPrice) throw new NoGoldPriceError();

    const pricePerGram = new Decimal(latestGoldPrice.price24K);
    const totalAmount = pricePerGram.mul(quantity).toDecimalPlaces(2);
    // 97% of the price is the cost price
    const costPrice = new Decimal(latestGoldPrice.price24K).mul(0.97).toDecimalPlaces(2);
    const costAmount = new Decimal(costPrice).mul(quantity).toDecimalPlaces(2);

    const transaction = {
        transactionType: TransactionType.BUY,
        customerId: customerId,
        details: `Buy ${quantity} grams of gold`,
        retailPrice: pricePerGram,
        amount: totalAmount,
        costPrice: costPrice,
        costAmount: costAmount,
        quantity,
        paymentMode,
        transferCharges: getTransferCharges(paymentMode, totalAmount),
        paymentGateway,
        paymentTransactionId,
    };
    return createTransaction(transaction);
};

const buyGoldByAmt = async (customerId, data) => {
    const { amount, paymentMode, paymentGateway, paymentTransactionId } = data;

    console.log({ data });

    if (amount < 10) throw new InvalidAmountError();


    const amountAavilableAfterTransferCharges = new Decimal(amount).sub(getTransferCharges(paymentMode, amount));
    if (amountAavilableAfterTransferCharges.value <= 0) throw new InvalidAmountError();

    const latestGoldPrice = await getLatestGoldPrice();
    if (!latestGoldPrice) throw new NoGoldPriceError();
    const pricePerGram = new Decimal(latestGoldPrice.price24K);
    const qty = getQty(amountAavilableAfterTransferCharges, pricePerGram);
    const costPrice = new Decimal(latestGoldPrice.price24K).mul(0.97).toDecimalPlaces(2);
    const costAmount = new Decimal(costPrice).mul(qty).toDecimalPlaces(2);

    const transaction = {
        transactionType: TransactionType.BUY,
        customerId: customerId,
        details: `Buy ${qty} grams of gold`,
        retailPrice: pricePerGram,
        amount: amountAavilableAfterTransferCharges,
        costPrice: costPrice,
        costAmount: costAmount,
        quantity: qty,
        paymentMode,
        transferCharges: getTransferCharges(paymentMode, amount),
        paymentGateway,
        paymentTransactionId,
    };
    return createTransaction(transaction);
};

export const buyTransaction = async (customerId, data) => {
    const customer = await getCustomerById(customerId);
    console.log('Customer:', customer.kyc.kycStatus);
    if (!customer) throw new CustomerNotFoundError();
    if (!customer.kyc || !customer.kyc.kycStatus) throw new NoKYCError();
    if (customer.kyc.kycStatus === KYCStatus.PENDING) throw new KYCPendingError();
    if (customer.kyc.kycStatus === KYCStatus.REJECTED) throw new KYCRejectedError();

    if (hasKYC(customer)) {
        const { quantity, amount } = data;
        if (quantity) return buyGoldByQuantity(customerId, data);
        if (amount) return buyGoldByAmt(customerId, data);

        throw new InvalidTransactionError('Invalid transaction data');
    }

    throw new NoKYCError('Customer does not have KYC approved');
}
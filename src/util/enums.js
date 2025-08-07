export const UserType = {
    CONSUMER: "Consumer",
    BUSINESS: "Business",
};

export const PaymentMode = {
    CREDIT_CARD: "CreditCard",
    DEBIT_CARD: "DebitCard",
    BANK_TRANSFER: "BankTransfer",
    GOOGLE_PAY: "GooglePay",
    APPLE_PAY: "ApplePay",
}

export const KYCStatus = {
    PENDING: "Pending",
    APPROVED: "Approved",
    DEFERRED: "Deferred",
    REJECTED: "Rejected",
};

export const TransactionStatus = {
    PENDING: "Pending",
    COMPLETED: "Completed",
    FAILED: "Failed",
    CANCELLED: "Cancelled",
};

export const TransactionType = {
    BUY: "Buy",
    SELL: "Sell",
    REDEEM: "Redeem",
    BUY_FOR_DELIVERY: "BuyForDelivery",
};

export const PaymentGateway = {
    MY_FATOORAH: "MyFatoorah",
    LEAN_TECH: "LeanTech",
};

export const AuthTokenType = {
    CUSTOMER: "Customer",
    TEMPORARY: "Temp",
};
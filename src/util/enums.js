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
    NOT_STARTED: "NotStarted",
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
    PAY10: "Pay10",
};

export const AuthTokenType = {
    CUSTOMER: "Customer",
    TEMPORARY: "Temp",
    USER: "User",
    SERVICE: "Service",
    KYC_SERVICE: "KYC",
    PAYMENT_GATEWAY_SERVICE: "PaymentGateway",
};

export const ExternalServices = {
    ID_WISE: "IDWise",
    LEAN_TECH: "LeanTech",
    MY_FATOORAH: "MyFatoorah",
};

export const GoldType = {
    TWENTY_FOUR_KARAT: '24K',
    TWENTY_TWO_KARAT: '22K',
    EIGHTEEN_KARAT: '18K',
}

export const MessageType = {
    PUSH_NOTIFICATION: 'pushNotification',
    EMAIL: 'email',
    KYC: 'kyc',
    PAYMENT: 'payment',
    MY_FATOORAH: "myFatoorah",
};

export const MyFatoorahEvents = {
    TRANSACTION_STATUS_CHANGED: 'TransactionsStatusChanged',
};

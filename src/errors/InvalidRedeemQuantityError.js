export default class InvalidRedeemQuantityError extends Error {
    constructor(message = 'Invalid Redeem Qantity. Should multiples of 1gram') {
        super(message);
        this.name = 'InvalidRedeemQuantity';
        this.status = 400;
    }
}

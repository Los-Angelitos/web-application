export class PaymentOwner {
    constructor(ownerId = 0, description = '', finalAmount = 0.0) {
        this.ownerId = ownerId;
        this.description = description;
        this.finalAmount = finalAmount;
    }
}
export class ContractOwner {
    constructor(ownerId, startDate, finalDate, subscriptionId) {
        this.ownerId = ownerId;
        this.startDate = startDate;
        this.finalDate = finalDate;
        this.subscriptionId = subscriptionId;
        this.status = "ACTIVE"; // Default status
    }
}
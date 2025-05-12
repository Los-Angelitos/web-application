export class Supply {
    constructor(providerId, hotelId, name, price, stock, state) {
        this.providerId = providerId;
        this.hotelId = hotelId;
        this.name = name;
        this.price = price;
        this.stock = stock;
        this.state = state;
    }

    static fromDisplayableSupply(displayableSupply) {
        return new Supply(
            displayableSupply.providerId,
            displayableSupply.hotelId,
            displayableSupply.name,
            displayableSupply.price,
            displayableSupply.stock,
            displayableSupply.state
        )
    }

    static toDisplayableSupply(displayableSupply) {
        return {
            providerId: displayableSupply.providerId,
            hotelId: displayableSupply.hotelId,
            name: displayableSupply.name,
            price: displayableSupply.price,
            stock: displayableSupply.stock,
            state: displayableSupply.state
        }
    }
}
export class TypeRoom {
    constructor(description, price) {
        this.description = description;
        this.price = price;
    }

    static fromDisplayableTypeRoom(displayableTypeRoom) {
        return new TypeRoom(
            displayableTypeRoom.description,
            displayableTypeRoom.price
        );
    }

    static toDisplayableTypeRoom(typeRoom) {
        return {
            description: typeRoom.description,
            price: typeRoom.price
        };
    }
}

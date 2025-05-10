export class Hotel {
    constructor(id, ownerId, name, description, email, address, phone) {
        this.id = id;
        this.ownerId = ownerId;
        this.name = name;
        this.description = description;
        this.email = email;
        this.address = address;
        this.phone = phone;
    }

    static fromDisplayableHotel(displayableHotel) {
        return new Hotel(
            displayableHotel.id,
            displayableHotel.ownerId,
            displayableHotel.name,
            displayableHotel.description,
            displayableHotel.email,
            displayableHotel.address,
            displayableHotel.phone
        );
    }

    static toDisplayableHotel(hotel) {
        return {
            id: hotel.id,
            ownerId: hotel.ownerId,
            name: hotel.name,
            description: hotel.description,
            email: hotel.email,
            address: hotel.address,
            phone: hotel.phone
        };
    }

    getHotelName() {
        return this.name;
    }
}
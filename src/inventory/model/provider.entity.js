export class Provider {
    constructor(id, name, email, phone, state, hotelId) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.phone = phone;
        this.state = state;
        this.hotelId = hotelId;
    }

    static fromDisplayableProvider(displayableProvider) {
        return new Provider(
            //displayableProvider.id,
            displayableProvider.name,
            displayableProvider.email,
            displayableProvider.phone,
            displayableProvider.state,
            displayableProvider.hotelId
        );
    }

    static toDisplayableProvider(displayableProvider) {
        return {
            id: displayableProvider.id,
            name: displayableProvider.name,
            email: displayableProvider.email,
            phone: displayableProvider.phone,
            state: displayableProvider.state,
            hotelId: displayableProvider.hotelId
        };
    }
}

export class Reservation {
    constructor(
        paymentCustomerId,
        roomId,
        description,
        startDate,
        finalDate,
        priceRoom,
        nightCount,
        amount,
        state,
        preferenceId
    ) {
        this.paymentCustomerId = paymentCustomerId;
        this.roomId = roomId;
        this.description = description;
        this.startDate = new Date(startDate);
        this.finalDate = new Date(finalDate);
        this.priceRoom = priceRoom;
        this.nightCount = nightCount;
        this.amount = amount;
        this.state = state;
        this.preferenceId = preferenceId;
    }

    static fromDisplayableReservation(displayableReservation) {
        return new Reservation(
            displayableReservation.paymentCustomerId,
            displayableReservation.roomId,
            displayableReservation.description,
            displayableReservation.startDate,
            displayableReservation.finalDate,
            displayableReservation.priceRoom,
            displayableReservation.nightCount,
            displayableReservation.amount,
            displayableReservation.state,
            displayableReservation.preferenceId
        );
    }

    static toDisplayableReservation(displayableReservation) {
        return {
            paymentCustomerId: displayableReservation.paymentCustomerId,
            roomId: displayableReservation.roomId,
            description: displayableReservation.description,
            startDate: displayableReservation.startDate.toISOString(),
            finalDate: displayableReservation.finalDate.toISOString(),
            priceRoom: displayableReservation.priceRoom,
            nightCount: displayableReservation.nightCount,
            amount: displayableReservation.amount,
            state: displayableReservation.state,
            preferenceId: displayableReservation.preferenceId
        };
    }
}

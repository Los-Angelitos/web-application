export class Booking {
    constructor(id, paymentCustomerId, roomId, description, startDate, finalDate, priceRoom, nightCount, amount, state, preferenceId) {
        this.id = id;
        this.paymentCustomerId = paymentCustomerId;
        this.roomId = roomId;
        this.description = description;
        this.startDate = startDate;
        this.finalDate = finalDate;
        this.priceRoom = priceRoom;
        this.nightCount = nightCount;
        this.amount = amount;
        this.state = state;
        this.preferenceId = preferenceId;
    }

    static fromDisplayableBooking(displayableBooking) {
        return new Booking(
            displayableBooking.id,
            displayableBooking.paymentCustomerId,
            displayableBooking.roomId,
            displayableBooking.description,
            displayableBooking.startDate,
            displayableBooking.finalDate,
            displayableBooking.priceRoom,
            displayableBooking.nightCount,
            displayableBooking.amount,
            displayableBooking.state,
            displayableBooking.preferenceId
        );
    }

    static toDisplayableBooking(booking) {
        return {
            paymentCustomerId: booking.paymentCustomerId,
            roomId: booking.roomId,
            description: booking.description,
            startDate: booking.startDate,
            finalDate: booking.finalDate,
            priceRoom: booking.priceRoom,
            nightCount: booking.nightCount,
            amount: booking.amount,
            state: booking.state,
            preferenceId: booking.preferenceId
        };
    }
}
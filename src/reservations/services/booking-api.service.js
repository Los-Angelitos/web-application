import {Booking} from "../model/booking.entity.js";
import http from "../../shared/services/http-common.js";

export class BookingApiService {
    createBooking(booking) {
        return http.post('/booking/create-booking', Booking.toDisplayableBooking(booking));
    }

    getBookings(hotelId) {
        return http.get('/booking/get-all-bookings?hotelId=${hotelId}');
    }

    updateBooking(bookingId, state) {
        return http.post('/booking/update-booking-state', {
            id: bookingId,
            state: state
        });
    }
}
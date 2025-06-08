import {Booking} from "../model/booking.entity.js";
import http from "../../shared/services/http-common.js";

export class BookingApiService {
    createBooking(booking) {
        return http.post('/booking/create-booking', Booking.toDisplayableBooking(booking));
    }

    getBookings(hotelId) {
        return http.get(`/booking/get-all-bookings?hotelId=${hotelId}`);
    }

    getBookingsByCustomer(customerId) {
        return http.get(`/booking/get-booking-by-customer-id?customerId=${customerId}`);
    }

    // Método corregido para cancelar reservas según la API
    updateBooking(bookingId, state) {
        return http.put('/booking/update-booking-state', {
            id: bookingId,
            state: state
        });
    }

    // Método corregido para obtener información del hotel usando la API correcta
    getHotelById(hotelId) {
        return http.get(`/hotels/${hotelId}`);
    }
}
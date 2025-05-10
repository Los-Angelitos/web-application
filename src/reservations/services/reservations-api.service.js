import http from "../../shared/services/http-common.js";
import {Reservation} from "../model/reservations.entity.js";

export class ReservationsApiService {
    createReservation(guestId, reservation) {
        return http.post(
            `booking/create-booking`,
            Reservation.toDisplayableReservation(reservation)
        );
    }
}

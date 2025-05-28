import http from "../../shared/services/http-common.js";
import {Room} from "../model/room.entity.js";

export class RoomApiService {
    createRoom(room) {
        return http.post('/room/create-room', Room.toDisplayableRoom(room));
    }

    updateRoomState(roomId, state) {
        return http.put('/room/update-room-state', {
            id: roomId,
            state: state
        });
    }

    getRoomById(roomId) {
        return http.get(`/room/get-room-by-id?id=${roomId}`);
    }

    getRoomByState(state) {
        return http.get(`/room/get-room-by-state?state=${state}`);
    }

    getAllRooms(hotelId) {
        return http.get(`/room/get-all-rooms?hotelId=${hotelId}`);
    }

    getRoomByTypeRoom(typeRoomId) {
        return http.get(`/room/get-room-by-type-room??typeRoomId=${typeRoomId}`);
    }

    getRoomByBookingAvailability(startDate,finalDate, hotelId)  {
        return http.get(`/room/get-room-by-booking-availability?startDate=${startDate}&finalDate=${finalDate}&hotelId=${hotelId}`);
    }
}

import http from "../../shared/services/http-common.js";
import {TypeRoom} from "../model/typeroom.entity.js";

export class TypeRoomApiService {
    createTypeRoom(typeRoom) {
        return http.post('/type-room/create-type-room', TypeRoom.toDisplayableTypeRoom(typeRoom));
    }

    getTypeRoomById(typeRoomId) {
        return http.get(`/type-room/get-type-room-by-id?id=${typeRoomId}`);
    }

    getAllTypeRooms(hotelId) {
        return http.get(`type-room/get-all-type-rooms?hotelid=${hotelId}`);
    }
}

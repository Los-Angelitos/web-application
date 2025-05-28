export class Room {
    constructor(typeRoomId, hotelId, state) {
        this.typeRoomId = typeRoomId;
        this.hotelId = hotelId;
        this.state = state;
    }

    static fromDisplayableRoom(displayableRoom) {
        return new Room(
            displayableRoom.typeRoomId,
            displayableRoom.hotelId,
            displayableRoom.state
        );
    }

    static toDisplayableRoom(Room) {
        return {
            typeRoomId: Room.typeRoomId,
            hotelId: Room.hotelId,
            state: Room.state
        };
    }
}

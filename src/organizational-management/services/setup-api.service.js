import http from "../../shared/services/http-common.js";

export class SetupApiService {

    async setUpRoomsByTypeRoom(setup) {
        try {
            let hotelId = localStorage.getItem("hotelId");
            let result = await http.post("/type-room/create-type-room", {"description": setup.description, "price": setup.price})
                .then(response => response.data)
                .catch(error => {
                    console.error("Error creating setup:", error);
                    throw error;
                });

            await http.post("/room/set-up", {"count": setup.count, "typeRoomId": result["id"], "hotelId": hotelId})
                .then(response => response.data)
                .catch(error => {
                    console.error("Error creating rooms by type room:", error);
                    throw error;
                });
        }catch (e) {
            console.error("Error setting up rooms:", e);
            throw e;
        }
    }
}
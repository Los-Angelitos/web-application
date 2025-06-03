import http from "../../shared/services/http-common.js";

export class MultimediaApiService {
    createMultimedia(multimedia) {
        return http.post("/multimedia", multimedia)
            .then(response => response.data) // Assuming the response contains the created multimedia
            .catch(error => {
                console.error("Error creating multimedia:", error);
                throw error;
            });
    }

    getMainMultimediaByHotelId(hotelId) {
        return http.get(`/multimedia/main?hotelId=${hotelId}`)
            .then(response => response.data) // Assuming the response contains the main multimedia
            .catch(error => {
                console.error("Error fetching main multimedia by hotel ID:", error);
                throw error;
            });
    }

    getDetailsMultimediaByHotelId(hotelId) {
        return http.get(`/multimedia/details?hotelId=${hotelId}`)
            .then(response => response.data) // Assuming the response contains the details multimedia
            .catch(error => {
                console.error("Error fetching details multimedia by hotel ID:", error);
                throw error;
            });
    }
}
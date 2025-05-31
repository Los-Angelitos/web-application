import http from "../../shared/services/http-common.js";

export class HotelsApiService {

    getHotelsById(hotelId) {
        return http.get(`/hotels/${hotelId}`).then(response => response.data);
    }

    static getHotelByOwnerId(userId) {
        console.log(`Fetching hotels for owner with ID: ${userId}`);
        return http.get(`/hotels/owner/${userId}`).then(response => response.data[0]);
    }

    UpdateHotel(hotel, id) {
        return http.put(`/hotels/${id}`, hotel).then(response => response.data);
    }



}
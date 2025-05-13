import http from "../../shared/services/http-common.js";
import hotelMocked from "../../mocks/inventory/hotel.json";

export class HotelsApiService {

    getHotelsById(hotelId) {
        return hotelMocked; // For testing purposes, replace with the line below when ready for production
        return http.get(`/v1/hotels/${hotelId}`);
    }
}
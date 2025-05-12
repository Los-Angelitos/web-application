import http from "../../shared/services/http-common.js";

export class HotelsApiService {

    getHotelsById(hotelId) {
        return http.get(`/hotels/${hotelId}`);
    }
}
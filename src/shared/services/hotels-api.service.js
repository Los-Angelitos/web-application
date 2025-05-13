import http from "../../shared/services/http-common.js";

export class HotelsApiService {

    getHotelsById(hotelId) {
        return http.get(`/v1/hotels/${hotelId}`);
    }
}
import http from "../../shared/services/http-common"

export class HotelApiService {
    getHotels() {
        return http.get(`/hotels`);
    }

    getHotelById(hotelId) {
        return http.get(`/hotels/${hotelId}`);
    }

    getHotelByCategory(category) {
        return http.get(`/hotels/category/${category}`);
    }

    getHotelMainMultimedia(hotelId) {
        return http.get(`/multimedia/main?hotelId=${hotelId}`);
    }

    getHotelLogoMultimedia(hotelId) {
        return http.get(`/multimedia/logo?hotelId=${hotelId}`);
    }
}
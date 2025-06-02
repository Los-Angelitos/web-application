import http from "../../shared/services/http-common"

export class HotelApiService {
    getHotels() {
        return http.get(`/hotels`);
    }

    async getHotelById(hotelId) {
        return http.get(`/hotels/${hotelId}`);
    }

    getHotelByCategory(category) {
        return http.get(`/hotels/category/${category}`);
    }

    async getHotelMainMultimedia(hotelId) {
        return http.get(`/multimedia/main?hotelId=${hotelId}`);
    }

    async getHotelDetailMultimedia(hotelId) {
        return http.get(`/multimedia/details?hotelId=${hotelId}`);
    }

    async getHotelLogoMultimedia(hotelId) {
        return http.get(`/multimedia/logo?hotel=${hotelId}`);
    }
}
import http from "../../shared/services/http-common.js"

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

    async getHotelPrice(hotelId) {
        return http.get(`/type-room/get-minimum-price-type-room-by-hotel-id?hotelId=${hotelId}`);
    }

    async getHotelAllRooms(hotelId) {
        return http.get(`/room/get-all-rooms?hotelId=${hotelId}`);
    }

    async processPayment(paymentData) {
        return http.post(`/payment-customer`, paymentData);
    }

    async createBooking(bookingData) {
        return http.post(`/booking/create-booking`, bookingData);
    }

    async getRoomById(roomId) {
        return http.get(`/room/get-room-by-id?id=${roomId}`);
    } 

    createHotel(hotel){
        return http.post("/hotels", hotel)
            .then(response => {
                if(response.status === 201) {
                    return response.data;
                }
                else {
                    return null;
                }
            })
            .catch(error => {
                console.error("Error creating hotel:", error);
                throw error;
            });
    }

    updateHotel(hotel) {
        return http.put(`/hotels/${hotel.hotelId}`, hotel)
            .then(response => {
                if(response.status === 200) {
                    return response.data;
                }
                else {
                    return null;
                }
            })
            .catch(error => {
                console.error("Error updating hotel:", error);
                throw error;
            });
    }

}
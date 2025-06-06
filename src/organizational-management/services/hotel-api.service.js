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
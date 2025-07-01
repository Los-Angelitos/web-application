import axios from "axios";
import http from "../../shared/services/http-common.js"
import { authenticationInterceptor } from "../../iam/services/authentication.interceptor.js";

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

    async createHotel(hotel){
        return http.post("/hotels", hotel);
    }
    
    async createFogServer(data) {
        return http.post("/fog-servers", data);
    }

    async getFogServerByHotel(hotelId) {
        return http.get(`/fog-servers?hotelId=${hotelId}`);
    }

    async updateFogServer(fogServerId, data) {
        return http.put(`/fog-servers/${fogServerId}`, data);
    }

    async createThermostat(thermostat) {
        return http.post("/thermostat/create-thermostat", thermostat);
    }

    async createSmokeSensor(smokeSensor) {
         const http = axios.create({
            baseURL: `https://sweet-manager-api.runasp.net/api`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
        
        http.interceptors.request.use(authenticationInterceptor);

        return http.post("/smokesensor/create-smoke-sensor", smokeSensor);
    }

    async createRfidCard(rfidCard) {
        return http.post("/rfid-card", rfidCard);
    }

    async getThermostats(hotelId) {
        return http.get(`/thermostat/get-all-thermostats?hotelId=${hotelId}`);
    }

    async getSmokeSensors(hotelId) {
        const http = axios.create({
            baseURL: `https://sweet-manager-api.runasp.net/api`,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        });
        
        http.interceptors.request.use(authenticationInterceptor);

        return http.get(`/smokesensor/get-all-smoke-sensors?hotelId=${hotelId}`);
    }

    async getRfidCards(hotelId) {
        return http.get(`/rfid-card/hotel/${hotelId}`);
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
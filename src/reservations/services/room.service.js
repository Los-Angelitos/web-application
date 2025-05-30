// services/roomService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

class RoomService {
    constructor() {
        this.apiClient = axios.create({
            baseURL: API_BASE_URL,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        this.apiClient.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );
    }

    getHotelIdFromToken() {
        try {
            const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
            if (!token) return null;

            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality"];
        } catch (error) {
            console.error('Error extracting hotel ID from token:', error);
            return null;
        }
    }

    async createRoom(roomData) {
        try {
            const hotelId = this.getHotelIdFromToken();
            if (!hotelId) {
                throw new Error('Hotel ID not found in token');
            }

            const requestData = {
                typeRoomId: roomData.typeRoomId || 0,
                hotelId: parseInt(hotelId),
                state: roomData.state || "String"
            };

            const response = await this.apiClient.post('/api/room/create-room', requestData);
            return response.data;
        } catch (error) {
            console.error('Error creating room:', error);
            throw error;
        }
    }

    async getRoomsByHotel() {
        try {
            const hotelId = this.getHotelIdFromToken();
            if (!hotelId) {
                throw new Error('Hotel ID not found in token');
            }

            const response = await this.apiClient.get(`/api/room/get-all-rooms?hotelId=${hotelId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching rooms:', error);
            throw error;
        }
    }

    async getRoomById(roomId) {
        try {
            const response = await this.apiClient.get(`/api/room/get-room-by-id?id=${roomId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching room:', error);
            throw error;
        }
    }

    async updateRoomState(roomId, state) {
        try {
            const requestData = {
                id: roomId,
                state: state
            };

            const response = await this.apiClient.put('/api/room/update-room-state', requestData);
            return response.data;
        } catch (error) {
            console.error('Error updating room state:', error);
            throw error;
        }
    }

    async getRoomsByState(state) {
        try {
            const hotelId = this.getHotelIdFromToken();
            if (!hotelId) {
                throw new Error('Hotel ID not found in token');
            }

            const response = await this.apiClient.get(`/api/room/get-room-by-state?hotelId=${hotelId}&state=${state}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching rooms by state:', error);
            throw error;
        }
    }

    async getRoomsByType(typeRoomId) {
        try {
            const hotelId = this.getHotelIdFromToken();
            if (!hotelId) {
                throw new Error('Hotel ID not found in token');
            }

            const response = await this.apiClient.get(`/api/room/get-room-by-type-room?hotelId=${hotelId}&typeRoomId=${typeRoomId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching rooms by type:', error);
            throw error;
        }
    }

    async getBookingAvailability(params) {
        try {
            const queryParams = new URLSearchParams(params);
            const response = await this.apiClient.get(`/api/room/get-room-by-booking-availability?${queryParams}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching booking availability:', error);
            throw error;
        }
    }
}

export default new RoomService();
// services/room.service.js - VERSIÓN ACTUALIZADA CON NOMBRE DINÁMICO DEL HOTEL
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
                const token = this.getValidToken();

                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                    config.headers['X-Auth-Token'] = token;
                    console.log('🔐 Token agregado a la solicitud');
                    console.log('🔗 URL completa:', config.baseURL + config.url);
                } else {
                    console.error('❌ No se encontró token válido');
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        this.apiClient.interceptors.response.use(
            (response) => response,
            (error) => {
                console.error('Error en respuesta:', {
                    status: error.response?.status,
                    statusText: error.response?.statusText,
                    data: error.response?.data,
                    url: error.config?.url
                });

                if (error.response?.status === 401) {
                    console.error('🔐 Token inválido o expirado');
                }
                return Promise.reject(error);
            }
        );
    }

    getValidToken() {
        // Buscar primero en localStorage.token
        const mainToken = localStorage.getItem('token');
        if (mainToken && this.isValidJWT(mainToken)) {
            console.log('🔐 Token principal encontrado en localStorage.token');
            return mainToken;
        }

        // Lista extendida de posibles nombres de token
        const possibleTokenNames = [
            'authToken', 'access_token', 'jwt',
            'accessToken', 'auth_token', 'bearerToken',
            'Authorization', 'AUTH_TOKEN'
        ];

        // Buscar en localStorage
        for (const tokenName of possibleTokenNames) {
            const token = localStorage.getItem(tokenName);
            if (token && this.isValidJWT(token)) {
                console.log(`🔐 Token válido encontrado en localStorage.${tokenName}`);
                return token;
            }
        }

        // Buscar en sessionStorage
        for (const tokenName of possibleTokenNames) {
            const token = sessionStorage.getItem(tokenName);
            if (token && this.isValidJWT(token)) {
                console.log(`🔐 Token válido encontrado en sessionStorage.${tokenName}`);
                return token;
            }
        }

        console.error('❌ No se encontró ningún token JWT válido');
        return null;
    }

    isValidJWT(token) {
        if (!token || typeof token !== 'string') return false;

        const parts = token.split('.');
        if (parts.length !== 3) return false;

        try {
            JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            if (payload.exp) {
                const now = Date.now() / 1000;
                if (now > payload.exp) {
                    console.warn('⏰ Token expirado');
                    return false;
                }
            }

            return true;
        } catch {
            return false;
        }
    }

    getHotelIdFromToken() {
        try {
            const token = this.getValidToken();
            if (!token) {
                console.error('❌ No hay token disponible para extraer Hotel ID');
                return null;
            }

            const parts = token.split('.');
            let base64Payload = parts[1];

            while (base64Payload.length % 4) {
                base64Payload += '=';
            }

            const payload = JSON.parse(atob(base64Payload));
            console.log('🔍 Payload del token:', payload);

            // Según el diagnóstico, el hotelId está en este claim específico
            const hotelIdClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality";

            if (payload[hotelIdClaim] !== undefined) {
                const hotelId = parseInt(payload[hotelIdClaim]);
                if (!isNaN(hotelId)) {
                    console.log('🏨 Hotel ID encontrado:', hotelId);
                    return hotelId;
                }
            }

            // Fallback a otros posibles claims
            const possibleHotelClaims = [
                "hotelId", "hotel_id", "hotel", "HotelId", "HOTEL_ID"
            ];

            for (const claim of possibleHotelClaims) {
                if (payload[claim] !== undefined && payload[claim] !== null && payload[claim] !== '') {
                    const hotelId = parseInt(payload[claim]);
                    if (!isNaN(hotelId)) {
                        console.log(`🏨 Hotel ID encontrado en claim '${claim}':`, hotelId);
                        return hotelId;
                    }
                }
            }

            console.error('❌ No se encontró Hotel ID en ningún claim conocido');
            return null;

        } catch (error) {
            console.error('❌ Error extrayendo Hotel ID del token:', error);
            return null;
        }
    }

    // NUEVO MÉTODO: Obtener información del hotel por ID
    async getHotelById(hotelId = null) {
        try {
            const token = this.getValidToken();
            if (!token) {
                throw new Error('No se encontró token de autenticación válido');
            }

            const targetHotelId = hotelId || this.getHotelIdFromToken();
            if (!targetHotelId) {
                throw new Error('No se pudo obtener el ID del hotel');
            }

            console.log('🏨 Obteniendo información del hotel ID:', targetHotelId);

            const endpoint = `/hotels/${targetHotelId}`;
            console.log('🔗 Endpoint hotel:', endpoint);
            console.log('🔗 URL completa:', `${API_BASE_URL}${endpoint}`);

            const response = await this.apiClient.get(endpoint);

            console.log('✅ Información del hotel obtenida:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Error obteniendo información del hotel:', error);

            if (error.response?.status === 401) {
                throw new Error('Token de autenticación inválido. Por favor, inicia sesión nuevamente.');
            } else if (error.response?.status === 403) {
                throw new Error('No tienes permisos para acceder a esta información del hotel.');
            } else if (error.response?.status === 404) {
                throw new Error('Hotel no encontrado.');
            } else {
                throw new Error(error.response?.data?.message || error.message || 'Error desconocido obteniendo información del hotel');
            }
        }
    }

    async getRoomsByHotel() {
        try {
            const token = this.getValidToken();
            if (!token) {
                throw new Error('No se encontró token de autenticación válido');
            }

            const hotelId = this.getHotelIdFromToken();
            if (!hotelId) {
                throw new Error('No se pudo obtener el ID del hotel del token');
            }

            console.log('🏠 Obteniendo habitaciones para hotel ID:', hotelId);

            const endpoint = '/room/get-all-rooms';
            console.log('🔗 Endpoint:', endpoint);
            console.log('🔗 URL completa:', `${API_BASE_URL}${endpoint}`);

            const response = await this.apiClient.get(endpoint, {
                params: { hotelId }
            });

            console.log('✅ Respuesta exitosa:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Error obteniendo habitaciones:', error);

            if (error.response?.status === 401) {
                throw new Error('Token de autenticación inválido. Por favor, inicia sesión nuevamente.');
            } else if (error.response?.status === 403) {
                throw new Error('No tienes permisos para acceder a esta información.');
            } else if (error.response?.status === 404) {
                throw new Error('Endpoint no encontrado. Verifica la URL de la API.');
            } else {
                throw new Error(error.response?.data?.message || error.message || 'Error desconocido');
            }
        }
    }

    async getRoomTypes() {
        try {
            const token = this.getValidToken();
            if (!token) {
                throw new Error('No se encontró token de autenticación válido');
            }

            const hotelId = this.getHotelIdFromToken();
            if (!hotelId) {
                throw new Error('No se pudo obtener el ID del hotel del token');
            }

            console.log('🏷️ Obteniendo tipos de habitación para hotel ID:', hotelId);

            const endpoint = '/type-room/get-all-type-rooms';
            console.log('🔗 Endpoint tipos de habitación:', endpoint);
            console.log('🔗 URL completa:', `${API_BASE_URL}${endpoint}`);

            const response = await this.apiClient.get(endpoint, {
                params: { hotelId }
            });

            console.log('✅ Respuesta tipos de habitación exitosa:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Error obteniendo tipos de habitación:', error);

            if (error.response?.status === 401) {
                throw new Error('Token de autenticación inválido. Por favor, inicia sesión nuevamente.');
            } else if (error.response?.status === 403) {
                throw new Error('No tienes permisos para acceder a los tipos de habitación.');
            } else if (error.response?.status === 404) {
                throw new Error('Endpoint de tipos de habitación no encontrado.');
            } else {
                throw new Error(error.response?.data?.message || error.message || 'Error desconocido obteniendo tipos de habitación');
            }
        }
    }

    async getAllBookings() {
        try {
            const token = this.getValidToken();
            if (!token) {
                throw new Error('No se encontró token de autenticación válido');
            }

            const hotelId = this.getHotelIdFromToken();
            if (!hotelId) {
                throw new Error('No se pudo obtener el ID del hotel del token');
            }

            console.log('📅 Obteniendo reservas para hotel ID:', hotelId);

            const endpoint = '/booking/get-all-bookings';
            console.log('🔗 Endpoint reservas:', endpoint);
            console.log('🔗 URL completa:', `${API_BASE_URL}${endpoint}`);

            const response = await this.apiClient.get(endpoint, {
                params: { hotelId }
            });

            console.log('✅ Respuesta reservas exitosa:', response.data);
            return response.data;

        } catch (error) {
            console.error('❌ Error obteniendo reservas:', error);

            if (error.response?.status === 401) {
                throw new Error('Token de autenticación inválido. Por favor, inicia sesión nuevamente.');
            } else if (error.response?.status === 403) {
                throw new Error('No tienes permisos para acceder a las reservas.');
            } else if (error.response?.status === 404) {
                throw new Error('Endpoint de reservas no encontrado.');
            } else {
                throw new Error(error.response?.data?.message || error.message || 'Error desconocido obteniendo reservas');
            }
        }
    }

    // MÉTODO MEJORADO: Obtener habitaciones con información completa
    async getRoomsWithCompleteInfo() {
        try {
            console.log('🔄 Obteniendo habitaciones con información completa...');

            // Obtener toda la información en paralelo incluyendo el hotel
            const [roomsResponse, bookingsResponse, hotelResponse] = await Promise.all([
                this.getRoomsByHotel(),
                this.getAllBookings(),
                this.getHotelById()
            ]);

            const rooms = Array.isArray(roomsResponse) ? roomsResponse : roomsResponse?.data || [];
            const bookings = Array.isArray(bookingsResponse) ? bookingsResponse : bookingsResponse?.data || [];
            const hotelInfo = hotelResponse || {};

            console.log('🏠 Habitaciones obtenidas:', rooms.length);
            console.log('📅 Reservas obtenidas:', bookings.length);
            console.log('🏨 Hotel info:', hotelInfo);

            // Crear mapa de reservas activas por habitación
            const activeBookingsMap = this.createActiveBookingsMap(bookings);

            console.log('📋 Reservas activas mapeadas:', activeBookingsMap.size);

            // Combinar información de habitaciones con reservas
            const roomsWithCompleteInfo = rooms.map(room => {
                const booking = activeBookingsMap.get(room.id);

                // Determinar disponibilidad basada en:
                // 1. Estado de la habitación
                // 2. Existencia de reserva activa
                const isRoomStateAvailable = room.state === 'Disponible' || room.state === 'Available';
                const hasActiveBooking = !!booking;
                const isAvailable = isRoomStateAvailable && !hasActiveBooking;

                return {
                    ...room,
                    hasActiveBooking,
                    bookingInfo: booking || null,
                    guest: booking?.guest || room.guest || '',
                    checkIn: booking?.checkIn || room.checkIn || '',
                    checkOut: booking?.checkOut || room.checkOut || '',
                    available: isAvailable,
                    // Información adicional para debugging
                    availabilityReason: !isAvailable ?
                        (hasActiveBooking ? 'Con reserva activa' : 'Estado no disponible') :
                        'Disponible'
                };
            });

            console.log('✅ Habitaciones con información completa procesadas:', roomsWithCompleteInfo.length);

            return {
                rooms: roomsWithCompleteInfo,
                hotelInfo: hotelInfo,
                totalRooms: roomsWithCompleteInfo.length,
                availableRooms: roomsWithCompleteInfo.filter(r => r.available).length,
                occupiedRooms: roomsWithCompleteInfo.filter(r => r.hasActiveBooking).length
            };

        } catch (error) {
            console.error('❌ Error obteniendo habitaciones con información completa:', error);
            throw error;
        }
    }

    // MÉTODO AUXILIAR: Crear mapa de reservas activas
    createActiveBookingsMap(bookings) {
        const activeBookingsMap = new Map();
        const now = new Date();

        bookings.forEach(booking => {
            if (!booking.roomId || !booking.startDate || !booking.finalDate) {
                return; // Saltar reservas incompletas
            }

            try {
                const startDate = new Date(booking.startDate);
                const endDate = new Date(booking.finalDate);

                // Verificar si la reserva está activa (dentro del rango de fechas y estado ACTIVE)
                const isDateActive = startDate <= now && endDate >= now;
                const isStateActive = booking.state === 'ACTIVE';
                const isActive = isDateActive && isStateActive;

                console.log(`📅 Reserva ${booking.id} - Room ${booking.roomId}:`, {
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                    now: now.toISOString(),
                    isDateActive,
                    isStateActive,
                    isActive,
                    state: booking.state
                });

                if (isActive) {
                    activeBookingsMap.set(booking.roomId, {
                        id: booking.id,
                        checkIn: booking.startDate,
                        checkOut: booking.finalDate,
                        guest: booking.paymentCustomer || booking.customer || 'Cliente',
                        state: booking.state,
                        description: booking.description || '',
                        bookingDate: booking.createdAt || booking.bookingDate
                    });
                }
            } catch (error) {
                console.warn(`⚠️ Error procesando reserva ${booking.id}:`, error);
            }
        });

        return activeBookingsMap;
    }

    async createRoom(roomData) {
        try {
            const hotelId = this.getHotelIdFromToken();
            if (!hotelId) {
                throw new Error('Hotel ID not found in token');
            }

            const requestData = {
                typeRoomId: roomData.typeRoomId || 0,
                hotelId: hotelId,
                state: roomData.state || "Disponible"
            };

            console.log('📤 Creating room with data:', requestData);
            const response = await this.apiClient.post('/room/create-room', requestData);
            return response.data;
        } catch (error) {
            console.error('❌ Error creating room:', error);
            throw error;
        }
    }

    async updateRoomState(roomId, state) {
        try {
            const requestData = {
                id: roomId,
                state: state
            };

            const response = await this.apiClient.put('/room/update-room-state', requestData);
            return response.data;
        } catch (error) {
            console.error('❌ Error updating room state:', error);
            throw error;
        }
    }

    // MÉTODO DE COMPATIBILIDAD: Mantener la funcionalidad anterior
    async getRoomsWithBookings() {
        const result = await this.getRoomsWithCompleteInfo();
        return result.rooms;
    }

    debugAuth() {
        console.log('\n🔧 === DIAGNÓSTICO COMPLETO DE AUTENTICACIÓN ===');

        const token = this.getValidToken();
        console.log('🔐 Token encontrado:', !!token);

        if (token) {
            console.log('🔐 Token (primeros 50 chars):', token.substring(0, 50) + '...');

            try {
                const parts = token.split('.');
                const header = JSON.parse(atob(parts[0]));
                const payload = JSON.parse(atob(parts[1]));

                console.log('📋 Header:', header);
                console.log('📋 Payload:', payload);

                const hotelId = this.getHotelIdFromToken();
                console.log('🏨 Hotel ID extraído:', hotelId);

                if (payload.exp) {
                    const expirationDate = new Date(payload.exp * 1000);
                    console.log('⏰ Token expira:', expirationDate);
                    console.log('❓ ¿Expirado?', Date.now() > payload.exp * 1000);
                }

            } catch (error) {
                console.error('❌ Error analizando token:', error);
            }
        }

        console.log('🔗 API Base URL:', API_BASE_URL);
        console.log('📋 localStorage keys:', Object.keys(localStorage));
        console.log('📋 sessionStorage keys:', Object.keys(sessionStorage));
    }
}

export default new RoomService();
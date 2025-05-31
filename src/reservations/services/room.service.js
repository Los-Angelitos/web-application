// services/room.service.js - VERSIÓN CORREGIDA
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
                    // Probar diferentes formatos de autorización
                    config.headers.Authorization = `Bearer ${token}`;
                    // También agregar como header personalizado por si acaso
                    config.headers['X-Auth-Token'] = token;
                    console.log(' Token agregado a la solicitud');
                    console.log(' URL completa:', config.baseURL + config.url);
                } else {
                    console.error(' No se encontró token válido');
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
                    console.error(' Token inválido o expirado');
                }
                return Promise.reject(error);
            }
        );
    }

    getValidToken() {
        // Buscar primero en localStorage.token (que es donde está según el diagnóstico)
        const mainToken = localStorage.getItem('token');
        if (mainToken && this.isValidJWT(mainToken)) {
            console.log(' Token principal encontrado en localStorage.token');
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
                console.log(` Token válido encontrado en localStorage.${tokenName}`);
                return token;
            }
        }

        // Buscar en sessionStorage
        for (const tokenName of possibleTokenNames) {
            const token = sessionStorage.getItem(tokenName);
            if (token && this.isValidJWT(token)) {
                console.log(` Token válido encontrado en sessionStorage.${tokenName}`);
                return token;
            }
        }

        console.error(' No se encontró ningún token JWT válido');
        return null;
    }

    isValidJWT(token) {
        if (!token || typeof token !== 'string') return false;

        const parts = token.split('.');
        if (parts.length !== 3) return false;

        try {
            JSON.parse(atob(parts[0]));
            const payload = JSON.parse(atob(parts[1]));

            // Verificar si no está expirado
            if (payload.exp) {
                const now = Date.now() / 1000;
                if (now > payload.exp) {
                    console.warn(' Token expirado');
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
                console.error(' No hay token disponible para extraer Hotel ID');
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
                    console.log(` Hotel ID encontrado:`, hotelId);
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
                        console.log(` Hotel ID encontrado en claim '${claim}':`, hotelId);
                        return hotelId;
                    }
                }
            }

            console.error(' No se encontró Hotel ID en ningún claim conocido');
            return null;

        } catch (error) {
            console.error(' Error extrayendo Hotel ID del token:', error);
            return null;
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

            console.log(' Obteniendo habitaciones para hotel ID:', hotelId);

            // CORRECCIÓN: Usar la URL correcta sin duplicar /api/v1
            const endpoint = '/room/get-all-rooms'; // Sin /api/v1 al inicio
            console.log('🔗 Endpoint:', endpoint);
            console.log('🔗 URL completa:', `${API_BASE_URL}${endpoint}`);

            const response = await this.apiClient.get(endpoint, {
                params: { hotelId }
            });

            console.log(' Respuesta exitosa:', response.data);
            return response.data;

        } catch (error) {
            console.error(' Error obteniendo habitaciones:', error);

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

    // Método para probar diferentes endpoints si falla el principal
    async getRoomsByHotelAlternative() {
        const possibleEndpoints = [
            '/room/get-all-rooms',
            '/api/room/get-all-rooms',
            '/rooms',
            '/api/rooms',
            '/room/by-hotel'
        ];

        const hotelId = this.getHotelIdFromToken();

        for (const endpoint of possibleEndpoints) {
            try {
                console.log(` Probando endpoint: ${endpoint}`);
                const response = await this.apiClient.get(endpoint, {
                    params: { hotelId }
                });
                console.log(` Endpoint exitoso: ${endpoint}`, response.data);
                return response.data;
            } catch (error) {
                console.log(` Endpoint falló: ${endpoint}`, error.response?.status);
                continue;
            }
        }

        throw new Error('Ningún endpoint de habitaciones funcionó');
    }

    debugAuth() {
        console.log('\n === DIAGNÓSTICO COMPLETO DE AUTENTICACIÓN ===');

        const token = this.getValidToken();
        console.log(' Token encontrado:', !!token);

        if (token) {
            console.log(' Token (primeros 50 chars):', token.substring(0, 50) + '...');

            try {
                const parts = token.split('.');
                const header = JSON.parse(atob(parts[0]));
                const payload = JSON.parse(atob(parts[1]));

                console.log(' Header:', header);
                console.log(' Payload:', payload);

                const hotelId = this.getHotelIdFromToken();
                console.log(' Hotel ID extraído:', hotelId);

                if (payload.exp) {
                    const expirationDate = new Date(payload.exp * 1000);
                    console.log(' Token expira:', expirationDate);
                    console.log(' ¿Expirado?', Date.now() > payload.exp * 1000);
                }

            } catch (error) {
                console.error(' Error analizando token:', error);
            }
        }

        console.log('🔗 API Base URL:', API_BASE_URL);

        console.log('📋 localStorage keys:', Object.keys(localStorage));
        console.log('📋 sessionStorage keys:', Object.keys(sessionStorage));
    }

    async testConnection() {
        try {
            console.log(' Probando conexión a la API...');
            const response = await this.apiClient.get('/health'); // endpoint común de health check
            console.log(' API conectada correctamente');
            return true;
        } catch (error) {
            console.log(' Error conectando a la API:', error.response?.status);
            return false;
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
                hotelId: hotelId,
                state: roomData.state || "Disponible"
            };

            console.log('Creating room with data:', requestData);
            const response = await this.apiClient.post('/room/create-room', requestData);
            return response.data;
        } catch (error) {
            console.error('Error creating room:', error);
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
            console.error('Error updating room state:', error);
            throw error;
        }
    }
}

export default new RoomService();

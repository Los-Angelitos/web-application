<template>
  <BreadCrumb :path="breadcrumbPath" class="breadcrumb"/>
  <div class="reservations-page">

    <h1 class="page-title">{{ $t('user-reservations.title') }}</h1>
    <p class="page-subtitle">
      {{ $t('user-reservations.subtitle') }}
    </p>

    <!-- Loading state -->
    <div v-if="loading" class="loading-container">
      <p>{{ $t('user-reservations.loading') || 'Cargando reservas...' }}</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="loadReservations" class="retry-button">
        {{ $t('user-reservations.retry') || 'Reintentar' }}
      </button>
    </div>

    <!-- Reservations content -->
    <div v-else class="reservations-container">
      <div v-if="reservations.length === 0" class="no-reservations">
        <p>{{ $t('user-reservations.noReservations') || 'No tienes reservas actualmente.' }}</p>
      </div>

      <BasicCardComponent
          v-for="(reservation, index) in reservations"
          :key="reservation.id"
          :title="reservation.hotelName || 'Hotel'"
          class="reservation-card"
      >
        <template #image>
          <div class="hotel-logo-container">
            <img :src="reservation.hotelLogo || defaultHotelImage"
                 :alt="`${reservation.hotelName} Logo`"
                 class="hotel-logo" />
          </div>
        </template>
        <template #header-content>
          <div class="reservation-info">
            <div class="reservation-dates">
              <span class="date-label">Check-in:</span>
              <span>{{ formatDate(reservation.startDate) }}</span>
            </div>
            <div class="reservation-dates">
              <span class="date-label">Check-out:</span>
              <span>{{ formatDate(reservation.finishDate) }}</span>
            </div>
            <div class="reservation-description" v-if="reservation.description">
              <span>{{ reservation.description }}</span>
            </div>
            <!-- Mostrar información adicional del hotel -->
            <div class="hotel-additional-info" v-if="reservation.hotelAddress">
              <div class="hotel-address">
                <span class="info-label">Dirección:</span>
                <span>{{ reservation.hotelAddress }}</span>
              </div>
            </div>
            <div class="hotel-contact" v-if="reservation.hotelPhone">
              <span class="info-label">Teléfono:</span>
              <span>{{ reservation.hotelPhone }}</span>
            </div>
          </div>
        </template>
        <div class="hotel-status">
          <div :class="['status-badge', getStatusClass(reservation.state)]">
            {{ getStatusText(reservation.state) }}
          </div>
          <button
              v-if="canCancelReservation(reservation.state)"
              class="cancel-button"
              @click="cancelReservation(reservation)"
          >
            {{ $t('user-reservations.cancelButton') || 'Cancelar Reserva' }}
          </button>
        </div>
      </BasicCardComponent>
    </div>

    <div class="actions">
      <button class="back-button" @click="backToPreviousPage">
        {{ $t('user-reservations.backButton') || 'Volver' }}
      </button>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "../../shared/components/breadcrumb.component.vue";
import BasicCardComponent from "../../shared/components/basic-card.component.vue";
import { BookingApiService } from "../services/booking-api.service.js";
import userMock from "../../mocks/iam/user-profile-account.json";

export default {
  name: "MyReservationsPage",
  components: {
    BreadCrumb,
    BasicCardComponent
  },
  data() {
    return {
      userData: null,
      reservations: [],
      loading: false,
      error: null,
      bookingService: new BookingApiService(),
      defaultHotelImage: new URL('../../assets/images/hotel-image-4.png', import.meta.url).href,
      breadcrumbPath: [
        { name: "Account", route: "" },
        { name: "My Reservations", route: "" }
      ]
    };
  },
  mounted() {
    this.fetchUserData();
    this.loadReservations();
  },
  methods: {
    fetchUserData() {
      setTimeout(() => {
        this.userData = userMock;
        this.breadcrumbPath[0].route = `/home/profile/${this.userData.id}`;
        this.breadcrumbPath[1].route = `/home/profile/${this.userData.id}/reservations`;
      }, 300);
    },

    // Obtener el customer ID del token JWT
    getCustomerIdFromToken() {
      try {
        const token = this.getValidToken();
        if (!token) {
          throw new Error('No token found');
        }

        const parts = token.split('.');
        let base64Payload = parts[1];

        while (base64Payload.length % 4) {
          base64Payload += '=';
        }

        const payload = JSON.parse(atob(base64Payload));
        console.log('🔍 Payload del token:', payload);

        const customerIdClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/sid";
        const customerId = payload[customerIdClaim];

        if (!customerId) {
          console.error('❌ Customer ID no encontrado en el claim:', customerIdClaim);
          console.log('📋 Claims disponibles:', Object.keys(payload));
          throw new Error('Customer ID not found in token');
        }

        console.log('✅ Customer ID encontrado:', customerId);
        return customerId;
      } catch (error) {
        console.error('❌ Error getting customer ID from token:', error);
        return null;
      }
    },

    // 🏨 NUEVO: Obtener el hotel ID del token JWT
    getHotelIdFromToken() {
      try {
        const token = this.getValidToken();
        if (!token) {
          throw new Error('No token found');
        }

        const parts = token.split('.');
        let base64Payload = parts[1];

        while (base64Payload.length % 4) {
          base64Payload += '=';
        }

        const payload = JSON.parse(atob(base64Payload));
        console.log('🔍 Payload del token:', payload);

        // Obtener el hotel ID del claim específico
        const hotelIdClaim = "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/locality";
        const hotelId = payload[hotelIdClaim];

        if (!hotelId) {
          console.error('❌ Hotel ID no encontrado en el claim:', hotelIdClaim);
          console.log('📋 Claims disponibles:', Object.keys(payload));
          throw new Error('Hotel ID not found in token');
        }

        console.log('✅ Hotel ID encontrado:', hotelId);
        return hotelId;
      } catch (error) {
        console.error('❌ Error getting hotel ID from token:', error);
        return null;
      }
    },

    getValidToken() {
      const mainToken = localStorage.getItem('token');
      if (mainToken && this.isValidJWT(mainToken)) {
        console.log('✅ Token principal encontrado en localStorage.token');
        return mainToken;
      }

      const possibleTokenNames = [
        'authToken', 'access_token', 'jwt',
        'accessToken', 'auth_token', 'bearerToken',
        'Authorization', 'AUTH_TOKEN'
      ];

      for (const tokenName of possibleTokenNames) {
        const token = localStorage.getItem(tokenName);
        if (token && this.isValidJWT(token)) {
          console.log(`✅ Token válido encontrado en localStorage.${tokenName}`);
          return token;
        }
      }

      for (const tokenName of possibleTokenNames) {
        const token = sessionStorage.getItem(tokenName);
        if (token && this.isValidJWT(token)) {
          console.log(`✅ Token válido encontrado en sessionStorage.${tokenName}`);
          return token;
        }
      }

      console.error('❌ No se encontró ningún token JWT válido');
      return null;
    },

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
            console.warn('⚠️ Token expirado');
            return false;
          }
        }

        return true;
      } catch {
        return false;
      }
    },

    // 🚀 MÉTODO ACTUALIZADO: Cargar las reservas del customer con información del hotel usando el hotel ID del token
    async loadReservations() {
      this.loading = true;
      this.error = null;

      try {
        const customerId = this.getCustomerIdFromToken();
        if (!customerId) {
          throw new Error('No se pudo obtener el ID del cliente');
        }

        console.log('🔄 Cargando reservas para customer ID:', customerId);
        const response = await this.bookingService.getBookingsByCustomer(customerId);
        const reservationsData = response.data || [];

        console.log('📋 Reservas obtenidas:', reservationsData);

        // 🏨 NUEVO: Obtener el hotel ID del token para usar como respaldo
        const defaultHotelId = this.getHotelIdFromToken();

        // 🏨 Enriquecer cada reserva con información completa del hotel
        const enrichedReservations = await Promise.all(
            reservationsData.map(async (reservation) => {
              try {
                // Usar el hotelId de la reserva o el del token como respaldo
                const hotelIdToUse = reservation.hotelId || defaultHotelId;

                if (hotelIdToUse) {
                  console.log(`🏨 Obteniendo información del hotel ID: ${hotelIdToUse}`);
                  const hotelResponse = await this.bookingService.getHotelById(hotelIdToUse);
                  const hotelData = hotelResponse.data;

                  console.log(`✅ Información del hotel ${hotelIdToUse}:`, hotelData);

                  return {
                    ...reservation,
                    hotelName: hotelData.name || 'Hotel Sin Nombre',
                    hotelDescription: hotelData.description || '',
                    hotelAddress: hotelData.address || '',
                    hotelPhone: hotelData.phone || '',
                    hotelEmail: hotelData.email || '',
                    hotelCategory: hotelData.category || '',
                    // Mantener el logo original si existe, sino usar imagen por defecto
                    hotelLogo: reservation.hotelLogo || this.defaultHotelImage,
                    // Guardar el ID del hotel usado
                    hotelId: hotelIdToUse
                  };
                }
                return {
                  ...reservation,
                  hotelName: 'Hotel Desconocido',
                  hotelLogo: this.defaultHotelImage
                };
              } catch (hotelError) {
                console.warn(`⚠️ Error obteniendo datos del hotel ${reservation.hotelId || defaultHotelId}:`, hotelError);
                return {
                  ...reservation,
                  hotelName: reservation.hotelId ? `Hotel ID: ${reservation.hotelId}` : (defaultHotelId ? `Hotel ID: ${defaultHotelId}` : 'Hotel Desconocido'),
                  hotelLogo: this.defaultHotelImage
                };
              }
            })
        );

        this.reservations = enrichedReservations;
        console.log('✅ Reservas cargadas con información completa de hoteles:', this.reservations);

      } catch (error) {
        console.error('❌ Error loading reservations:', error);
        this.error = `Error al cargar las reservas: ${error.message}. Por favor, inténtalo de nuevo.`;
      } finally {
        this.loading = false;
      }
    },

    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    getStatusClass(state) {
      switch (state?.toLowerCase()) {
        case 'active':
        case 'confirmed':
          return 'active';
        case 'cancelled':
        case 'inactive':
          return 'inactive';
        case 'pending':
          return 'pending';
        default:
          return 'inactive';
      }
    },

    getStatusText(state) {
      switch (state?.toLowerCase()) {
        case 'active':
        case 'confirmed':
          return this.$t('user-reservations.activeStatus') || 'Activa';
        case 'cancelled':
          return this.$t('user-reservations.cancelledStatus') || 'Cancelada';
        case 'inactive':
          return this.$t('user-reservations.inactiveStatus') || 'Inactiva';
        case 'pending':
          return this.$t('user-reservations.pendingStatus') || 'Pendiente';
        default:
          return this.$t('user-reservations.inactiveStatus') || 'Inactiva';
      }
    },

    canCancelReservation(state) {
      return state?.toLowerCase() === 'active' || state?.toLowerCase() === 'confirmed';
    },

    // 🔧 MÉTODO CORREGIDO: Cancelar reserva usando el formato correcto de la API
    async cancelReservation(reservation) {
      const confirmMessage = this.$t('user-reservations.cancelConfirmation', {
        hotelName: reservation.hotelName || 'esta reserva'
      }) || `¿Estás seguro de que deseas cancelar la reserva en ${reservation.hotelName || 'este hotel'}?`;

      if (confirm(confirmMessage)) {
        try {
          console.log('🔄 Intentando cancelar reserva:', {
            id: reservation.id,
            hotelName: reservation.hotelName,
            currentState: reservation.state
          });

          // Usar el formato correcto según la API
          await this.bookingService.updateBooking(reservation.id, 'cancelled');
          console.log('✅ Reserva cancelada exitosamente');

          // Actualizar el estado local
          const index = this.reservations.findIndex(r => r.id === reservation.id);
          if (index !== -1) {
            this.reservations[index].state = 'cancelled';
          }

          const successMessage = this.$t('user-reservations.cancelSuccess', {
            hotelName: reservation.hotelName || 'Reserva'
          }) || `Reserva en ${reservation.hotelName || 'el hotel'} cancelada exitosamente`;

          alert(successMessage);

        } catch (error) {
          console.error('❌ Error cancelling reservation:', error);

          let errorMessage = 'Error al cancelar la reserva.';

          if (error.response) {
            errorMessage += ` Código HTTP: ${error.response.status}`;
            if (error.response.status === 405) {
              errorMessage += ' (Método no permitido - Verifica la configuración del endpoint)';
            } else if (error.response.status === 404) {
              errorMessage += ' (Reserva no encontrada)';
            } else if (error.response.status === 403) {
              errorMessage += ' (Sin permisos para cancelar)';
            }

            if (error.response.data && error.response.data.message) {
              errorMessage += ` - ${error.response.data.message}`;
            }
          } else if (error.message) {
            errorMessage += ` ${error.message}`;
          }

          errorMessage += '\n\nPor favor, contacta al soporte técnico si el problema persiste.';

          const finalErrorMessage = this.$t('user-reservations.cancelError') || errorMessage;
          alert(finalErrorMessage);
        }
      }
    },

    backToPreviousPage() {
      if (this.userData) {
        this.$router.push(`/home/profile/${this.userData.id}`);
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style scoped>
.reservations-page {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.breadcrumb {
  margin: 0 2rem;
}

.page-title {
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: bold;
  color: #333;
}

.page-subtitle {
  color: #666;
  margin-bottom: 30px;
  font-size: 16px;
  line-height: 1.4;
}

.loading-container, .error-container, .no-reservations {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: #666;
}

.retry-button {
  margin-top: 10px;
  padding: 8px 16px;
  background-color: #0074cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #0056a3;
}

.reservations-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

.reservation-card {
  width: 100%;
  max-width: 350px;
  min-height: 250px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.reservation-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.hotel-logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.hotel-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.reservation-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  padding: 0 10px;
}

.reservation-dates {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.date-label, .info-label {
  font-weight: bold;
  color: #555;
}

.reservation-description {
  font-size: 12px;
  color: #777;
  font-style: italic;
  margin-top: 5px;
}

.hotel-additional-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
}

.hotel-address, .hotel-contact {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  font-size: 12px;
  color: #666;
}

.hotel-address span:last-child,
.hotel-contact span:last-child {
  text-align: right;
  flex: 1;
  margin-left: 10px;
}

.hotel-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
  padding: 15px;
}

.status-badge {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.active {
  background-color: #e6f7ff;
  color: #0074cc;
  border: 1px solid #91d5ff;
}

.inactive {
  background-color: #fff2f0;
  color: #cf1322;
  border: 1px solid #ffb3b3;
}

.pending {
  background-color: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.cancel-button {
  width: 100%;
  padding: 10px 15px;
  background-color: white;
  border: 2px solid #ff4d4f;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  color: #ff4d4f;
  transition: all 0.2s;
}

.cancel-button:hover {
  background-color: #ff4d4f;
  color: white;
}

.actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #f0f0f0;
}

.back-button {
  padding: 12px 30px;
  background-color: white;
  border: 2px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  color: #595959;
  transition: all 0.2s;
}

.back-button:hover {
  border-color: #0074cc;
  color: #0074cc;
}

@media (max-width: 768px) {
  .reservations-container {
    justify-content: center;
  }

  .page-title {
    font-size: 24px;
  }

  .reservation-card {
    max-width: 100%;
  }
}

@media (max-width: 480px) {
  .reservations-page {
    padding: 15px;
  }

  .page-subtitle {
    font-size: 14px;
  }

  .breadcrumb {
    font-size: 12px;
    margin: 0 1rem;
  }

  .reservation-card {
    max-width: 100%;
    min-height: auto;
  }

  .hotel-logo {
    width: 60px;
    height: 60px;
  }

  .reservation-dates, .hotel-address, .hotel-contact {
    flex-direction: column;
    align-items: flex-start;
    gap: 2px;
  }

  .hotel-address span:last-child,
  .hotel-contact span:last-child {
    text-align: left;
    margin-left: 0;
  }
}
</style>
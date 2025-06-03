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
            {{ $t('user-reservations.cancelButton') }}
          </button>
        </div>
      </BasicCardComponent>
    </div>

    <div class="actions">
      <button class="back-button" @click="backToPreviousPage">
        {{ $t('user-reservations.backButton') }}
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
        // Buscar el token en localStorage primero (como en RoomService)
        const token = this.getValidToken();
        if (!token) {
          throw new Error('No token found');
        }

        // Decodificar el JWT (solo la parte del payload)
        const parts = token.split('.');
        let base64Payload = parts[1];

        // Agregar padding si es necesario
        while (base64Payload.length % 4) {
          base64Payload += '=';
        }

        const payload = JSON.parse(atob(base64Payload));
        console.log('🔍 Payload del token:', payload);

        // Obtener el customer ID del claim específico
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

    // Método para obtener token válido (similar al RoomService)
    getValidToken() {
      // Buscar primero en localStorage.token (que es donde está según el diagnóstico)
      const mainToken = localStorage.getItem('token');
      if (mainToken && this.isValidJWT(mainToken)) {
        console.log('✅ Token principal encontrado en localStorage.token');
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
          console.log(`✅ Token válido encontrado en localStorage.${tokenName}`);
          return token;
        }
      }

      // Buscar en sessionStorage
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

    // Validar si es un JWT válido
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
            console.warn('⚠️ Token expirado');
            return false;
          }
        }

        return true;
      } catch {
        return false;
      }
    },

    // Cargar las reservas del customer
    async loadReservations() {
      this.loading = true;
      this.error = null;

      try {
        const customerId = this.getCustomerIdFromToken();
        if (!customerId) {
          throw new Error('No se pudo obtener el ID del cliente');
        }

        const response = await this.bookingService.getBookingsByCustomer(customerId);
        this.reservations = response.data || [];
      } catch (error) {
        console.error('Error loading reservations:', error);
        this.error = 'Error al cargar las reservas. Por favor, inténtalo de nuevo.';
      } finally {
        this.loading = false;
      }
    },

    // Formatear fechas
    formatDate(dateString) {
      if (!dateString) return '';
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    // Obtener clase CSS según el estado
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

    // Obtener texto del estado
    getStatusText(state) {
      switch (state?.toLowerCase()) {
        case 'active':
        case 'confirmed':
          return this.$t('user-reservations.activeStatus') || 'Activa';
        case 'cancelled':
          return this.$t('user-reservations.cancelledStatus') || 'Cancelada';
        case 'pending':
          return this.$t('user-reservations.pendingStatus') || 'Pendiente';
        default:
          return this.$t('user-reservations.inactiveStatus') || 'Inactiva';
      }
    },

    // Verificar si se puede cancelar la reserva
    canCancelReservation(state) {
      return state?.toLowerCase() === 'active' || state?.toLowerCase() === 'confirmed';
    },

    // Cancelar reserva
    async cancelReservation(reservation) {
      const confirmMessage = this.$t('user-reservations.cancelConfirmation', {
        hotelName: reservation.hotelName || 'esta reserva'
      });

      if (confirm(confirmMessage)) {
        try {
          await this.bookingService.updateBooking(reservation.id, 'cancelled');

          // Actualizar el estado local
          const index = this.reservations.findIndex(r => r.id === reservation.id);
          if (index !== -1) {
            this.reservations[index].state = 'cancelled';
          }

          const successMessage = this.$t('user-reservations.cancelSuccess', {
            hotelName: reservation.hotelName || 'Reserva'
          });
          alert(successMessage || 'Reserva cancelada exitosamente');

        } catch (error) {
          console.error('Error cancelling reservation:', error);
          const errorMessage = this.$t('user-reservations.cancelError') ||
              'Error al cancelar la reserva. Por favor, inténtalo de nuevo.';
          alert(errorMessage);
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
  max-width: 300px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
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
}

.reservation-dates {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.date-label {
  font-weight: bold;
  color: #555;
}

.reservation-description {
  font-size: 12px;
  color: #777;
  font-style: italic;
  margin-top: 5px;
}

.hotel-status {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-top: 15px;
}

.status-badge {
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
  width: 100%;
  text-align: center;
}

.active {
  background-color: #e6f7ff;
  color: #0074cc;
}

.inactive {
  background-color: #ffb3b3;
  color: #cc0000;
}

.pending {
  background-color: #fff7e6;
  color: #fa8c16;
}

.cancel-button {
  width: 100%;
  padding: 8px 15px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #f5f5f5;
}

.actions {
  display: flex;
  justify-content: flex-start;
  margin-top: 20px;
}

.back-button {
  padding: 10px 30px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.back-button:hover {
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .reservations-container {
    justify-content: center;
  }

  .page-title {
    font-size: 24px;
  }
}

@media (max-width: 480px) {
  .page-subtitle {
    font-size: 14px;
  }

  .breadcrumb {
    font-size: 12px;
  }

  .reservation-card {
    max-width: 280px;
  }
}
</style>
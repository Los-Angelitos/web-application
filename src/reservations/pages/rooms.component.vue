<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
  />
  <div class="hotel-management">
    <!-- Header Section -->
    <header>
      <h1>{{ hotelName || 'Cargando hotel...' }}</h1>
      <p>{{ $t('rooms.title') }}</p>
      <div class="header-buttons">
        <ButtonComponent
            :text="$t('rooms.headerComponent.addButton')"
            state="primary"
            @click="openAddRoomModal"
        />
      </div>
    </header>

    <!-- Loading Spinner -->
    <div v-if="loading" class="loading-container">
      <div class="spinner"></div>
      <p>{{ $t('rooms.loading') || 'Cargando habitaciones...' }}</p>
    </div>

    <!-- Error Message -->
    <div v-if="error" class="error-message">
      <p>{{ error }}</p>
      <ButtonComponent
          :text="$t('rooms.retry') || 'Reintentar'"
          state="primary"
          @click="loadRooms"
      />
    </div>

    <!-- Rooms Grid -->
    <div class="rooms-container" v-if="!loading && !error">
      <BasicCardComponent
          v-for="room in rooms"
          :key="room.id"
          :title="`${$t('rooms.roomLabel') || 'Room'} ${room.number || room.id}`"
          class="room-card"
      >
        <template #image>
          <div class="room-icon">
            <div class="door"></div>
          </div>
        </template>
        <template #header-content>
          <div class="room-guest">{{ room.guest || $t('rooms.roomCardComponent.guestFallback') || '-' }}</div>
        </template>
        <div class="room-details">
          <div class="room-type">{{ getRoomTypeName(room.typeRoomId) }}</div>
          <div class="room-dates">
            <div>{{ $t('rooms.from') || 'From' }}: {{ formatDate(room.checkIn) || $t('rooms.roomCardComponent.dateFallback') || '--/--/--' }}</div>
            <div>{{ $t('rooms.to') || 'To' }}: {{ formatDate(room.checkOut) || $t('rooms.roomCardComponent.dateFallback') || '--/--/--' }}</div>
            <div class="room-state">{{ $t('rooms.state') || 'Estado' }}: {{ room.state }}</div>
          </div>
        </div>
        <div class="room-actions">
          <ButtonComponent
              :text="room.available ? ($t('rooms.available') || 'AVAILABLE') : ($t('rooms.notAvailable') || 'NOT AVAILABLE')"
              :state="room.available ? 'basic' : 'primary'"
              fullWidth
              :class="{ 'available': room.available, 'not-available': !room.available }"
              :disabled="true"
          />
          <ButtonComponent
              :text="$t('rooms.changeState') || 'Change state'"
              state="secondary"
              fullWidth
              @click="openStateModal(room)"
              class="change-state-btn"
          />
        </div>
      </BasicCardComponent>
    </div>

    <!-- Change State Modal -->
    <div class="modal" v-if="showStateModal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="room-icon blue">
            <div class="door"></div>
          </div>
          <h2>{{ $t('rooms.stateModalComponent.header') || 'Cambiar Estado de Habitación' }}</h2>
          <p>{{ $t('rooms.stateModalComponent.body') || `Habitación ${selectedRoom?.number || selectedRoom?.id}` }}</p>
        </div>
        <div class="form-group">
          <label>{{ $t('rooms.stateModalComponent.stateLabel') || 'Nuevo Estado' }}</label>
          <select v-model="newState" class="form-select">
            <option value="Disponible">Disponible</option>
            <option value="Ocupada">Ocupada</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Limpieza">Limpieza</option>
            <option value="Fuera de Servicio">Fuera de Servicio</option>
          </select>
        </div>
        <div class="modal-buttons">
          <ButtonComponent
              :text="$t('rooms.stateModalComponent.cancelButton') || 'Cancelar'"
              state="basic"
              @click="closeStateModal"
              :disabled="updatingState"
          />
          <ButtonComponent
              :text="updatingState ? ($t('rooms.updating') || 'Actualizando...') : ($t('rooms.stateModalComponent.updateButton') || 'Actualizar')"
              state="primary"
              @click="updateRoomState"
              :disabled="updatingState"
          />
        </div>
      </div>
    </div>

    <!-- Add Room Modal -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="room-icon blue">
            <div class="door"></div>
          </div>
          <h2>{{ $t('rooms.roomModalComponent.header') || 'Agregar Nueva Habitación' }}</h2>
          <p>{{ $t('rooms.roomModalComponent.body') || 'Complete los datos de la habitación' }}</p>
        </div>
        <div class="form-group">
          <label>{{ $t('rooms.roomModalComponent.roomNameLabel') || 'Número de Habitación' }}</label>
          <input
              type="text"
              v-model="newRoom.number"
              :placeholder="$t('rooms.roomModalComponent.roomNamePlaceholder') || 'Ej: 101, 102, etc.'"
          />
        </div>
        <div class="form-group">
          <label>{{ $t('rooms.roomModalComponent.roomTypeLabel') || 'Tipo de Habitación' }}</label>
          <select v-model="newRoom.typeRoomId" class="form-select" :disabled="loadingRoomTypes">
            <option value="0">
              {{ loadingRoomTypes ? 'Cargando tipos...' : ($t('rooms.roomModalComponent.roomTypePlaceholder') || 'Seleccione un tipo') }}
            </option>
            <option v-for="type in roomTypes" :key="type.id" :value="type.id">
              {{ type.description || type.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>{{ $t('rooms.roomModalComponent.stateLabel') || 'Estado' }}</label>
          <select v-model="newRoom.state" class="form-select">
            <option value="Disponible">Disponible</option>
            <option value="Ocupada">Ocupada</option>
            <option value="Mantenimiento">Mantenimiento</option>
            <option value="Limpieza">Limpieza</option>
          </select>
        </div>
        <div class="modal-buttons">
          <ButtonComponent
              :text="$t('rooms.roomModalComponent.cancelButton') || 'Cancelar'"
              state="basic"
              @click="closeAddRoomModal"
              :disabled="addingRoom"
          />
          <ButtonComponent
              :text="addingRoom ? ($t('rooms.adding') || 'Agregando...') : ($t('rooms.roomModalComponent.addButton') || 'Agregar')"
              state="primary"
              @click="addRoom"
              :disabled="addingRoom || loadingRoomTypes"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from '../../shared/components/button.component.vue';
import BasicCardComponent from '../../shared/components/basic-card.component.vue';
import MainPageNavigation from "../../organizational-management/components/main-page-navigation.component.vue";
import OverviewIcon from "../../assets/organizational-management/overview-icon.svg";
import AnalyticsIcon from "../../assets/organizational-management/analytics-icon.svg";
import ProvidersIcon from "../../assets/organizational-management/providers-icon.svg";
import InventoryIcon from "../../assets/organizational-management/inventory-icon.svg";
import RoomsIcon from "../../assets/organizational-management/rooms-icon.svg";
import OrganizationIcon from "../../assets/organizational-management/organization-icon.svg";
import DevicesIcon from "../../assets/organizational-management/devices-icon.svg";
import RoomService from '.././services/room.service.js';

export default {
  name: 'RoomsComponent',
  components: {
    MainPageNavigation,
    ButtonComponent,
    BasicCardComponent
  },
  data() {
    return {
      showModal: false,
      showStateModal: false,
      loading: false,
      loadingRoomTypes: false,
      error: null,
      addingRoom: false,
      updatingState: false,
      selectedRoom: null,
      newState: '',
      authError: false,
      hotelName: '', // Nueva propiedad para el nombre del hotel
      hotelInfo: null, // Nueva propiedad para la información completa del hotel
      navigationItems: [
        { id: "overview", label: "Overview", path: "/home/hotel/1/overview", icon: OverviewIcon, isActive: false },
        { id: "analytics", label: "Analytics", path: "/home/hotel/1/analytics", icon: AnalyticsIcon, isActive: false },
        { id: "providers", label: "Providers", path: "/home/hotel/1/providers", icon: ProvidersIcon, isActive: false },
        { id: "inventory", label: "Inventory", path: "/home/hotel/1/inventory", icon: InventoryIcon, isActive: false },
        { id: "rooms", label: "Rooms", path: "/home/hotel/1/rooms", icon: RoomsIcon, isActive: true },
        { id: "organization", label: "Organization", path: "/home/hotel/1/organization", icon: OrganizationIcon, isActive: false },
        { id: "devices", label: "Devices", path: "/home/hotel/1/set-up/devices", icon: DevicesIcon, isActive: false }
      ],
      newRoom: {
        number: '',
        typeRoomId: 0,
        state: 'Disponible'
      },
      rooms: [],
      roomTypes: [],
      bookings: []
    };
  },
  async mounted() {
    console.log('🚀 Componente Rooms montado');
    RoomService.debugAuth();
    await this.loadInitialData();
  },
  methods: {
    async loadInitialData() {
      await Promise.all([
        this.loadHotelInfo(), // Nueva función para cargar información del hotel
        this.loadRooms(),
        this.loadRoomTypes(),
        this.loadBookings()
      ]);
    },

    // NUEVA FUNCIÓN: Cargar información del hotel
    async loadHotelInfo() {
      try {
        console.log('🏨 Cargando información del hotel...');
        this.hotelInfo = await RoomService.getHotelById();

        // Extraer el nombre del hotel de la respuesta
        this.hotelName = this.hotelInfo?.name || this.hotelInfo?.hotelName || 'Hotel sin nombre';

        console.log('🏨 Información del hotel cargada:', this.hotelInfo);
        console.log('🏨 Nombre del hotel:', this.hotelName);

      } catch (error) {
        console.error('❌ Error cargando información del hotel:', error);
        // Mantener un nombre fallback si no se puede cargar
        this.hotelName = 'Hotel';
      }
    },

    async loadBookings() {
      try {
        console.log('📅 Cargando reservas...');
        const response = await RoomService.getAllBookings();

        if (Array.isArray(response)) {
          this.bookings = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.bookings = response.data;
        } else {
          console.warn('⚠️ Respuesta inesperada de reservas:', response);
          this.bookings = [];
        }

        console.log('📅 Reservas cargadas:', this.bookings);
        this.updateRoomsWithBookingData();

      } catch (error) {
        console.error('❌ Error cargando reservas:', error);
        this.bookings = [];
      }
    },

    updateRoomsWithBookingData() {
      console.log('🔄 Actualizando habitaciones con datos de reservas...');

      const activeBookingsMap = new Map();
      const now = new Date();

      this.bookings.forEach(booking => {
        if (booking.state === 'ACTIVE' && booking.roomId && booking.startDate && booking.finalDate) {
          const startDate = new Date(booking.startDate);
          const endDate = new Date(booking.finalDate);

          // Verificar si la reserva está actualmente activa (dentro del rango de fechas)
          const isCurrentlyActive = startDate <= now && endDate >= now;

          console.log(`📅 Verificando reserva ${booking.id} para habitación ${booking.roomId}:`, {
            startDate: startDate.toISOString(),
            endDate: endDate.toISOString(),
            now: now.toISOString(),
            isCurrentlyActive,
            state: booking.state
          });

          if (isCurrentlyActive) {
            activeBookingsMap.set(booking.roomId, {
              id: booking.id,
              checkIn: booking.startDate,
              checkOut: booking.finalDate,
              guest: booking.paymentCustomer || booking.customer || 'Cliente',
              state: booking.state,
              description: booking.description || ''
            });
          }
        }
      });

      console.log('📋 Reservas activas mapeadas:', activeBookingsMap.size);

      this.rooms = this.rooms.map(room => {
        const booking = activeBookingsMap.get(room.id);
        const hasActiveBooking = !!booking;

        console.log(`🏠 Habitación ${room.id}:`, {
          roomState: room.state,
          hasActiveBooking,
          booking: booking
        });

        if (hasActiveBooking) {
          // Habitación CON reserva activa -> NOT AVAILABLE (rojo)
          return {
            ...room,
            hasActiveBooking: true,
            bookingInfo: booking,
            guest: booking.guest,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            available: false // FALSE = rojo (not available) - está ocupada
          };
        } else {
          // Habitación SIN reserva activa -> AVAILABLE (azul)
          return {
            ...room,
            hasActiveBooking: false,
            bookingInfo: null,
            guest: room.guest || '', // Mantener guest original si no hay reserva
            checkIn: room.checkIn || '',
            checkOut: room.checkOut || '',
            available: true // TRUE = azul (available) - está libre
          };
        }
      });

      console.log('✅ Habitaciones actualizadas con información de reservas');
    },

    formatDate(dateString) {
      if (!dateString) return '';

      try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
      } catch (error) {
        console.warn('Error formateando fecha:', dateString, error);
        return dateString;
      }
    },

    async loadRoomTypes() {
      this.loadingRoomTypes = true;
      try {
        console.log('🏷️ Cargando tipos de habitación...');
        const response = await RoomService.getRoomTypes();

        if (Array.isArray(response)) {
          this.roomTypes = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.roomTypes = response.data;
        } else {
          console.warn('⚠️ Respuesta inesperada de tipos de habitación:', response);
          this.roomTypes = [];
        }

        console.log('🏷️ Tipos de habitación cargados:', this.roomTypes);

        if (this.roomTypes.length === 0) {
          console.log('⚠️ No se encontraron tipos de habitación, usando fallback');
          this.roomTypes = [
            { id: 1, name: 'Estándar', description: 'Estándar' },
            { id: 2, name: 'Deluxe', description: 'Deluxe' },
            { id: 3, name: 'Suite', description: 'Suite' }
          ];
        }

      } catch (error) {
        console.error('❌ Error cargando tipos de habitación:', error);
        this.roomTypes = [
          { id: 1, name: 'Estándar', description: 'Estándar' },
          { id: 2, name: 'Deluxe', description: 'Deluxe' },
          { id: 3, name: 'Suite', description: 'Suite' }
        ];
      } finally {
        this.loadingRoomTypes = false;
      }
    },

    getRoomTypeName(typeRoomId) {
      const type = this.roomTypes.find(t => t.id === typeRoomId);
      return type ? (type.name || type.description) : 'Tipo desconocido';
    },

    async loadRooms() {
      this.loading = true;
      this.error = null;
      this.authError = false;

      try {
        console.log('📥 Iniciando carga de habitaciones...');

        const token = RoomService.getValidToken();
        if (!token) {
          throw new Error('No se encontró token de autenticación válido');
        }

        const hotelId = RoomService.getHotelIdFromToken();
        if (!hotelId) {
          throw new Error('No se pudo obtener el ID del hotel');
        }

        console.log('🏨 Hotel ID:', hotelId);

        const response = await RoomService.getRoomsByHotel();
        console.log('✅ Respuesta de la API:', response);

        if (Array.isArray(response)) {
          this.rooms = this.mapApiDataToComponent(response);
        } else if (response && response.data && Array.isArray(response.data)) {
          this.rooms = this.mapApiDataToComponent(response.data);
        } else {
          console.warn('⚠️ Respuesta inesperada de la API:', response);
          this.rooms = [];
        }

        console.log('🏠 Habitaciones mapeadas:', this.rooms);

        if (this.rooms.length === 0) {
          this.error = 'No se encontraron habitaciones para este hotel';
        }

        // Actualizar con información de reservas si ya están cargadas
        if (this.bookings.length > 0) {
          this.updateRoomsWithBookingData();
        }

      } catch (error) {
        console.error('❌ Error cargando habitaciones:', error);

        if (error.message.includes('token') || error.message.includes('autenticación')) {
          this.authError = true;
          this.error = 'Problema de autenticación. Por favor, inicia sesión nuevamente.';
        } else if (error.response?.status === 401) {
          this.authError = true;
          this.error = 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.';
        } else if (error.response?.status === 403) {
          this.error = 'No tienes permisos para ver las habitaciones de este hotel.';
        } else if (error.response?.status === 404) {
          this.error = 'El servicio de habitaciones no está disponible.';
        } else if (error.response?.status >= 500) {
          this.error = 'Error del servidor. Por favor, intenta más tarde.';
        } else {
          this.error = error.message || 'Error desconocido al cargar las habitaciones';
        }
      } finally {
        this.loading = false;
      }
    },

    mapApiDataToComponent(apiRooms) {
      if (!Array.isArray(apiRooms)) {
        console.warn('⚠️ apiRooms no es un array:', apiRooms);
        return [];
      }

      return apiRooms.map((room) => {
        console.log('🏠 Habitación de la API:', room);

        return {
          id: room.id || room.roomId || Math.random(),
          number: room.roomNumber || room.number || room.name || room.id || 'Sin número',
          guest: room.guestName || room.guest || '',
          checkIn: room.checkInDate || room.checkIn || '',
          checkOut: room.checkOutDate || room.checkOut || '',
          available: room.state === 'Disponible' || room.state === 'Available' || room.available,
          typeRoomId: room.typeRoomId || room.roomTypeId || 0,
          state: room.state || room.status || 'Desconocido',
          hasActiveBooking: false,
          bookingInfo: null
        };
      });
    },

    async retryLoadRooms() {
      if (this.authError) {
        alert('Problema de autenticación detectado. Por favor, recarga la página e inicia sesión nuevamente.');
        return;
      }
      await this.loadInitialData();
    },

    debugAuthentication() {
      console.log('🔧 Iniciando debug manual...');
      RoomService.debugAuth();
    },

    async openAddRoomModal() {
      this.showModal = true;
      if (this.roomTypes.length === 0) {
        await this.loadRoomTypes();
      }
    },

    closeAddRoomModal() {
      this.showModal = false;
      this.resetNewRoom();
    },

    openStateModal(room) {
      this.selectedRoom = room;
      this.newState = room.state;
      this.showStateModal = true;
    },

    closeStateModal() {
      this.showStateModal = false;
      this.selectedRoom = null;
      this.newState = '';
    },

    async updateRoomState() {
      if (!this.selectedRoom || !this.newState) return;

      this.updatingState = true;

      try {
        await RoomService.updateRoomState(this.selectedRoom.id, this.newState);

        const roomIndex = this.rooms.findIndex(r => r.id === this.selectedRoom.id);
        if (roomIndex !== -1) {
          this.rooms[roomIndex].state = this.newState;

          // Mantener la lógica: con reserva = NOT available (rojo), sin reserva = available (azul)
          const hasActiveBooking = this.rooms[roomIndex].hasActiveBooking;
          this.rooms[roomIndex].available = !hasActiveBooking; // FALSE si tiene reserva, TRUE si no tiene
        }

        this.closeStateModal();
        alert('Estado actualizado exitosamente');

      } catch (error) {
        console.error('Error updating room state:', error);
        alert(error.response?.data?.message || 'Error al actualizar el estado de la habitación');
      } finally {
        this.updatingState = false;
      }
    },

    resetNewRoom() {
      this.newRoom = {
        number: '',
        typeRoomId: 0,
        state: 'Disponible'
      };
    },

    async addRoom(event) {
      if (event) event.preventDefault();
      if (this.addingRoom) return;

      if (!this.newRoom.number || this.newRoom.number.trim() === '') {
        alert('El número de habitación es requerido');
        return;
      }

      if (this.newRoom.typeRoomId === 0) {
        alert('El tipo de habitación es requerido');
        return;
      }

      const existingRoom = this.rooms.find(r =>
          r.number === this.newRoom.number.trim()
      );
      if (existingRoom) {
        alert(`La habitación ${this.newRoom.number} ya existe`);
        return;
      }

      this.addingRoom = true;

      try {
        const roomData = {
          roomNumber: this.newRoom.number.trim(),
          typeRoomId: this.newRoom.typeRoomId,
          state: this.newRoom.state
        };

        console.log('📤 Enviando datos de habitación:', roomData);

        const response = await RoomService.createRoom(roomData);
        console.log('✅ Respuesta de creación:', response);

        await this.loadInitialData();
        this.closeAddRoomModal();
        alert('Habitación creada exitosamente');

      } catch (error) {
        console.error('❌ Error creating room:', error);
        alert(error.response?.data?.message || 'Error al crear la habitación');
      } finally {
        this.addingRoom = false;
      }
    }
  }
};
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

.hotel-management {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  margin-bottom: 30px;
}

h1 {
  font-size: 1.8rem;
  margin-bottom: 5px;
}

header p {
  color: #666;
  margin-bottom: 15px;
}

.header-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #0066cc;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: #ffe6e6;
  border-radius: 8px;
  margin-bottom: 20px;
}

.error-message p {
  color: #cc0000;
  margin-bottom: 15px;
  text-align: center;
}

.rooms-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.room-card {
  width: 100% !important;
  margin: 0 !important;
  box-sizing: border-box;
}

.room-icon {
  width: 40px;
  height: 70px;
  background-color: #f0f0f0;
  border-radius: 4px;
  position: relative;
  margin: 0 auto 5px;
  border: 1px solid #ddd;
}

.room-icon.blue {
  background-color: #e6f0ff;
  border-color: #0066cc;
}

.door {
  position: absolute;
  width: 5px;
  height: 5px;
  background-color: #666;
  border-radius: 50%;
  top: 35px;
  left: 8px;
}

.room-guest {
  font-weight: bold;
  font-size: 0.9rem;
  text-align: center;
  width: 100%;
}

.room-details {
  width: 100%;
  text-align: center;
}

.room-type {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0066cc;
  margin-bottom: 8px;
}

.room-dates {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 0.8rem;
  color: #666;
  margin: 5px 0;
}

.room-state {
  font-weight: bold;
  color: #333;
  margin-top: 5px;
}

.room-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.change-state-btn {
  font-size: 0.8rem;
  padding: 8px 12px;
}

.available {
  color: #0066cc !important;
  background-color: #e6f0ff !important;
}

.not-available {
  color: white !important;
  background-color: #ff6b6b !important;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.modal-content {
  background-color: white;
  padding: 25px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
  text-align: center;
}

.modal-header h2 {
  font-size: 1.2rem;
  margin-top: 10px;
}

.modal-header p {
  color: #666;
  margin-top: 5px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #666;
}

.form-group input,
.form-select {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-select {
  background-color: white;
  cursor: pointer;
}

.form-select:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
}

.booking-info {
  margin-top: 5px;
}

.booking-status {
  color: #ff6b6b;
  font-weight: bold;
}

@media (max-width: 768px) {
  .rooms-container {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }

  .header-buttons {
    justify-content: space-between;
    width: 100%;
  }

  .header-buttons button {
    flex: 1;
  }
}

@media (max-width: 480px) {
  .rooms-container {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    padding: 15px;
  }

  .modal-buttons {
    flex-direction: column;
  }

  .modal-buttons button {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>
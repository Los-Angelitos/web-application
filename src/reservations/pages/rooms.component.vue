<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
  />
  <div class="hotel-management">
    <!-- Header Section -->
    <header>
      <h1>Royal Decameron Punta Sal</h1>
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
          :title="`${$t('rooms.roomLabel')} ${room.number}`"
          class="room-card"
      >
        <template #image>
          <div class="room-icon">
            <div class="door"></div>
          </div>
        </template>
        <template #header-content>
          <div class="room-guest">{{ room.guest || $t('rooms.roomCardComponent.guestFallback') }}</div>
        </template>
        <div class="room-dates">
          <div>{{ $t('rooms.from') }}: {{ room.checkIn || $t('rooms.roomCardComponent.dateFallback') }}</div>
          <div>{{ $t('rooms.to') }}: {{ room.checkOut || $t('rooms.roomCardComponent.dateFallback') }}</div>
          <div class="room-state">{{ $t('rooms.state') || 'Estado' }}: {{ room.state }}</div>
        </div>
        <div class="room-actions">
          <ButtonComponent
              :text="room.available ? $t('rooms.available') : $t('rooms.notAvailable')"
              :state="room.available ? 'basic' : 'primary'"
              fullWidth
              :class="{ 'available': room.available, 'not-available': !room.available }"
              :disabled="true"
          />
          <ButtonComponent
              :text="$t('rooms.changeState') || 'Cambiar Estado'"
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
          <p>{{ $t('rooms.stateModalComponent.body') || `Habitación ${selectedRoom?.number}` }}</p>
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
          <h2>{{ $t('rooms.roomModalComponent.header') }}</h2>
          <p>{{ $t('rooms.roomModalComponent.body') }}</p>
        </div>
        <div class="form-group">
          <label>{{ $t('rooms.roomModalComponent.roomNameLabel') }}</label>
          <input
              type="text"
              v-model="newRoom.number"
              :placeholder="$t('rooms.roomModalComponent.roomNamePlaceholder')"
          />
        </div>
        <div class="form-group">
          <label>{{ $t('rooms.roomModalComponent.roomTypeLabel') }}</label>
          <select v-model="newRoom.typeRoomId" class="form-select">
            <option value="0">{{ $t('rooms.roomModalComponent.roomTypePlaceholder') }}</option>
            <option v-for="type in roomTypes" :key="type.id" :value="type.id">
              {{ type.name }}
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
              :text="$t('rooms.roomModalComponent.cancelButton')"
              state="basic"
              @click="closeAddRoomModal"
              :disabled="addingRoom"
          />
          <ButtonComponent
              :text="addingRoom ? ($t('rooms.adding') || 'Agregando...') : $t('rooms.roomModalComponent.addButton')"
              state="primary"
              @click="addRoom"
              :disabled="addingRoom"
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

// rooms.component.vue - SCRIPT SECTION CORREGIDO
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
      error: null,
      addingRoom: false,
      updatingState: false,
      selectedRoom: null,
      newState: '',
      authError: false, // Nuevo: para errores de autenticación
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
      roomTypes: [
        { id: 1, name: 'Individual' },
        { id: 2, name: 'Doble' },
        { id: 3, name: 'Suite' },
        { id: 4, name: 'Familiar' }
      ]
    };
  },
  async mounted() {
    console.log('🚀 Componente Rooms montado');

    // Ejecutar diagnóstico completo
    RoomService.debugAuth();

    await this.loadRooms();
  },
  methods: {
    async loadRooms() {
      this.loading = true;
      this.error = null;
      this.authError = false;

      try {
        console.log('📥 Iniciando carga de habitaciones...');

        // Verificar autenticación antes de hacer la solicitud
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

        // Verificar si la respuesta es un array
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

      } catch (error) {
        console.error('❌ Error cargando habitaciones:', error);

        // Manejo específico de errores
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

      return apiRooms.map((room, index) => {
        console.log('🏠 Habitación de la API:', room);

        return {
          id: room.id || room.roomId || Math.random(), // Fallback si no hay ID
          number: `Habitación ${index + 1}`, // Generar número incremental
          guest: room.guestName || room.guest || '',
          checkIn: room.checkInDate || room.checkIn || '',
          checkOut: room.checkOutDate || room.checkOut || '',
          available: room.state === 'Disponible' || room.state === 'Available' || room.available,
          typeRoomId: room.typeRoomId || room.roomTypeId || 0,
          state: room.state || room.status || 'Desconocido'
        };
      });
    },

    // Método para reintento manual
    async retryLoadRooms() {
      if (this.authError) {
        // Si es error de autenticación, mostrar mensaje especial
        alert('Problema de autenticación detectado. Por favor, recarga la página e inicia sesión nuevamente.');
        return;
      }

      await this.loadRooms();
    },

    // Método para debugging manual
    debugAuthentication() {
      console.log('🔧 Iniciando debug manual...');
      RoomService.debugAuth();
    },

    // Resto de métodos sin cambios...
    openAddRoomModal() {
      this.showModal = true;
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

        // Actualizar el estado local
        const roomIndex = this.rooms.findIndex(r => r.id === this.selectedRoom.id);
        if (roomIndex !== -1) {
          this.rooms[roomIndex].state = this.newState;
          this.rooms[roomIndex].available = this.newState === 'Disponible';
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

      // Prevenir ejecución duplicada
      if (this.addingRoom) return;

      // Validaciones
      if (!this.newRoom.number || this.newRoom.number.trim() === '') {
        alert('El número de habitación es requerido');
        return;
      }

      if (this.newRoom.typeRoomId === 0) {
        alert('El tipo de habitación es requerido');
        return;
      }

      // Verificar si ya existe la habitación
      const existingRoom = this.rooms.find(r =>
          r.number === this.newRoom.number.trim() ||
          r.number === `Habitación ${this.newRoom.number.trim()}`
      );
      if (existingRoom) {
        alert(`La habitación ${this.newRoom.number} ya existe`);
        return;
      }

      this.addingRoom = true;

      try {
        // Probar diferentes formatos de datos que podría esperar la API
        const roomDataOptions = [
          {
            roomNumber: this.newRoom.number.trim(),
            typeRoomId: this.newRoom.typeRoomId,
            state: this.newRoom.state
          },
          {
            number: this.newRoom.number.trim(),
            typeRoomId: this.newRoom.typeRoomId,
            state: this.newRoom.state
          },
          {
            name: this.newRoom.number.trim(),
            typeRoomId: this.newRoom.typeRoomId,
            state: this.newRoom.state
          }
        ];

        console.log('📤 Enviando datos de habitación:', roomDataOptions[0]);

        // Intentar con el primer formato (roomNumber)
        let response;
        try {
          response = await RoomService.createRoom(roomDataOptions[0]);
        } catch (error) {
          console.log('❌ Falló con roomNumber, probando con number...');
          try {
            response = await RoomService.createRoom(roomDataOptions[1]);
          } catch (error2) {
            console.log('❌ Falló con number, probando con name...');
            response = await RoomService.createRoom(roomDataOptions[2]);
          }
        }

        console.log('✅ Respuesta de creación:', response);

        // Recargar las habitaciones para ver la nueva
        await this.loadRooms();
        this.closeAddRoomModal();
        alert('Habitación creada exitosamente');

      } catch (error) {
        console.error('❌ Error creating room:', error);
        console.error('📋 Detalles del error:', error.response?.data);
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

/* Loading Spinner */
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

/* Error Message */
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

.room-dates {
  display: flex;
  flex-direction: column;
  width: 100%;
  font-size: 0.8rem;
  color: #666;
  margin: 5px 0;
  text-align: center;
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

/* Modal styles */
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

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
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

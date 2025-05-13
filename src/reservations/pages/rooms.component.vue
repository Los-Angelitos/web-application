<!-- App.vue -->
<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
      @navigation-changed="handleNavigationChange"
  />
  <div class="hotel-management">
    <header>
      <h1>Royal Decameron Punta Sal</h1>
      <p>Rooms</p>
      <div class="header-buttons">
        <ButtonComponent
            text="Eliminar"
            state="basic"
            @click="handleDelete"
        />
        <ButtonComponent
            text="Agregar"
            state="primary"
            @click="openAddRoomModal"
        />
      </div>
    </header>

    <div class="rooms-container">
      <BasicCardComponent
          v-for="room in rooms"
          :key="room.id"
          :title="`Room ${room.number}`"
          class="room-card"
      >
        <template #image>
          <div class="room-icon">
            <div class="door"></div>
          </div>
        </template>
        <template #header-content>
          <div class="room-guest">{{ room.guest || '-' }}</div>
        </template>
        <div class="room-dates">
          <div>Desde: {{ room.checkIn || '--/--/--' }}</div>
          <div>Hasta: {{ room.checkOut || '--/--/--' }}</div>
        </div>
        <ButtonComponent
            :text="room.available ? 'DISPONIBLE' : 'NO DISPONIBLE'"
            :state="room.available ? 'basic' : 'primary'"
            fullWidth
            :class="{ 'available': room.available, 'not-available': !room.available }"
            :disabled="true"
        />
      </BasicCardComponent>
    </div>

    <!-- Modal para agregar habitación -->
    <div class="modal" v-if="showModal">
      <div class="modal-content">
        <div class="modal-header">
          <div class="room-icon blue">
            <div class="door"></div>
          </div>
          <h2>Nueva habitación</h2>
        </div>
        <div class="form-group">
          <label>Nombre de habitación</label>
          <input type="text" v-model="newRoom.number" placeholder="Room 009" />
        </div>
        <div class="form-group">
          <label>Tipo de habitación</label>
          <input type="text" v-model="newRoom.type" placeholder="Habitación doble" />
        </div>
        <div class="modal-buttons">
          <ButtonComponent
              text="Cancelar"
              state="basic"
              @click="closeAddRoomModal"
          />
          <ButtonComponent
              text="Agregar"
              state="primary"
              @click="addRoom"
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
const NavigationModel = {
  createNavigationItem(id, label, icon, route, isActive = false) {
    return {
      id,
      label,
      icon,
      route,
      isActive
    };
  }
};
export default {
  name: 'App',
  components: {
    MainPageNavigation,
    ButtonComponent,
    BasicCardComponent
  },
  data() {
    return {
      showModal: false,
      navigationItems: [
        NavigationModel.createNavigationItem('overview', 'Overview', OverviewIcon, '/home/hotel/:id/overview'),
        NavigationModel.createNavigationItem('analytics', 'Analytics',  AnalyticsIcon, '/home/hotel/:id/analytics'),
        NavigationModel.createNavigationItem('providers', 'Providers', ProvidersIcon, '/home/hotel/:id/providers' ),
        NavigationModel.createNavigationItem('inventory', 'Inventory', InventoryIcon, '/home/hotel/:id/inventory'),
        NavigationModel.createNavigationItem('rooms', 'Rooms', RoomsIcon, '/home/hotel/:id/rooms', true),
        NavigationModel.createNavigationItem('organization', 'Organization', OrganizationIcon, '/home/hotel/:id/organization'),
        NavigationModel.createNavigationItem('devices', 'Devices', DevicesIcon, '/home/hotel/:id/set-up/devices'),
      ],
      newRoom: {
        number: '',
        type: 'Habitación doble',
        guest: '',
        checkIn: '',
        checkOut: '',
        available: true
      },
      rooms: [
        {
          id: 1,
          number: '001',
          guest: 'Arian Rodriguez',
          checkIn: '04/05/25',
          checkOut: '20/05/25',
          available: false
        },
        {
          id: 2,
          number: '002',
          guest: 'Arian Rodriguez',
          checkIn: '04/05/25',
          checkOut: '20/05/25',
          available: false
        },
        {
          id: 3,
          number: '003',
          guest: 'Arian Rodriguez',
          checkIn: '04/05/25',
          checkOut: '20/05/25',
          available: false
        },
        {
          id: 4,
          number: '004',
          guest: 'Arian Rodriguez',
          checkIn: '04/05/25',
          checkOut: '20/05/25',
          available: false
        },
        {
          id: 5,
          number: '005',
          guest: '',
          checkIn: '',
          checkOut: '',
          available: true
        },
        {
          id: 6,
          number: '006',
          guest: '',
          checkIn: '',
          checkOut: '',
          available: true
        },
        {
          id: 7,
          number: '007',
          guest: '',
          checkIn: '',
          checkOut: '',
          available: true
        },
        {
          id: 8,
          number: '008',
          guest: 'Arian Rodriguez',
          checkIn: '04/05/25',
          checkOut: '20/05/25',
          available: false
        }
      ]
    }
  },
  methods: {
    openAddRoomModal() {
      this.showModal = true;
    },
    handleNavigationChange(selectedId) {
      this.navigationItems = this.navigationItems.map(item => ({
        ...item,
        isActive: item.id === selectedId
      }));
      // Opcional: lógica adicional al cambiar de sección
    },
    closeAddRoomModal() {
      this.showModal = false;
      this.resetNewRoom();
    },
    resetNewRoom() {
      this.newRoom = {
        number: '',
        type: 'Habitación doble',
        guest: '',
        checkIn: '',
        checkOut: '',
        available: true
      };
    },
    addRoom(event) {
      if (event) event.preventDefault();

      // Validar que se haya ingresado un número de habitación
      if (!this.newRoom.number) {
        alert('Debe ingresar un número de habitación');
        return;
      }

      // Verificar si ya existe una habitación con ese número
      const existingRoom = this.rooms.find(r => r.number === this.newRoom.number);
      if (existingRoom) {
        alert(`Ya existe una habitación con el número ${this.newRoom.number}`);
        return;
      }

      const roomId = Math.max(...this.rooms.map(r => r.id), 0) + 1;
      const newRoom = {
        ...this.newRoom,
        id: roomId
      };

      // Agregar solo una habitación
      this.rooms.push(newRoom);
      this.closeAddRoomModal();
    },
    handleDelete() {
      // Lógica para eliminar habitaciones seleccionadas
      // (Se implementaría con una selección múltiple)
      alert('Función eliminar presionada');
    }
  }
}
</script>

<style scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}

body {
  background-color: #f5f5f5;
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
}

.modal-header h2 {
  font-size: 1.2rem;
  margin-top: 10px;
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

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.modal-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  gap: 10px;
}

/* Responsive styles */
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

  .card {
    width: 100% !important;
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
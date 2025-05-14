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
            :text="$t('rooms.headerComponent.deleteButton')"
            state="basic"
            @click="handleDelete"
        />
        <ButtonComponent
            :text="$t('rooms.headerComponent.addButton')"
            state="primary"
            @click="openAddRoomModal"
        />
      </div>
    </header>

    <!-- Rooms Grid -->
    <div class="rooms-container">
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
        </div>
        <ButtonComponent
            :text="room.available ? $t('rooms.available') : $t('rooms.notAvailable')"
            :state="room.available ? 'basic' : 'primary'"
            fullWidth
            :class="{ 'available': room.available, 'not-available': !room.available }"
            :disabled="true"
        />
      </BasicCardComponent>
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
          <input
              type="text"
              v-model="newRoom.type"
              :placeholder="$t('rooms.roomModalComponent.roomTypePlaceholder')"
          />
        </div>
        <div class="modal-buttons">
          <ButtonComponent
              :text="$t('rooms.roomModalComponent.cancelButton')"
              state="basic"
              @click="closeAddRoomModal"
          />
          <ButtonComponent
              :text="$t('rooms.roomModalComponent.addButton')"
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
        type: this.$t('rooms.roomModalComponent.roomTypePlaceholder'),
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
    };
  },
  methods: {
    openAddRoomModal() {
      this.showModal = true;
    },
    closeAddRoomModal() {
      this.showModal = false;
      this.resetNewRoom();
    },
    resetNewRoom() {
      this.newRoom = {
        number: '',
        type: this.$t('rooms.roomModalComponent.roomTypePlaceholder'),
        guest: '',
        checkIn: '',
        checkOut: '',
        available: true
      };
    },
    addRoom(event) {
      if (event) event.preventDefault();

      if (!this.newRoom.number) {
        alert(this.$t('rooms.roomModalComponent.validation.numberRequired'));
        return;
      }

      const existingRoom = this.rooms.find(r => r.number === this.newRoom.number);
      if (existingRoom) {
        alert(this.$t('rooms.roomModalComponent.validation.alreadyExists', { number: this.newRoom.number }));
        return;
      }

      const roomId = Math.max(...this.rooms.map(r => r.id), 0) + 1;
      this.rooms.push({
        ...this.newRoom,
        id: roomId
      });
      this.closeAddRoomModal();
    },
    handleDelete() {
      // Delete functionality implementation
      alert(this.$t('rooms.header.deleteConfirmation'));
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
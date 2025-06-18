<template>
  <MainPageNavigation
  :navigationItems="navigationItems"
  />
  <div class="hotel-devices-container">
    <div class="hotel-header">
      <div class="hotel-title-section">
        <h1 class="hotel-title">Hotel</h1>
        <p class="hotel-subtitle">Devices IoT</p>
      </div>
      <div class="new-device-section">
        <p class="new-device-text">¿Nuevo dispositivo?</p>
        <button class="solicitar-btn" @click="requestDevice">Solicitar</button>
      </div>
    </div>

    <!-- Pantalla de carga mientras se obtienen los dispositivos -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Cargando dispositivos...</p>
    </div>

    <!-- Mensaje de error si falla la carga -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchDevices" class="retry-btn">Reintentar</button>
    </div>

    <!-- Contenedor de dispositivos -->
    <div v-else class="devices-grid">
      <div v-for="device in devices" :key="device.id">
        <HotelDeviceIoTCard :device="device" />
      </div>
    </div>
  </div>

    <ModalComponent v-model="showModal" title="" :showCloseButton="true" :closeOnOverlayClick="true" :width="'500px'" :height="'auto'" :backgroundColor="'#ffffff'">
        <template #image>
            <img src="../../assets/iot/plug-in-icon.svg" alt="Modal Image" />
        </template>
        <template #header>
            <h1>New device</h1>
        </template>
        <template #body>
            <form class="form">
                <div class="form-group">
                    <InputTextComponent v-model="mac" label="MAC" />
                </div>
                <div class="form-group">
                    <InputTextComponent v-model="ip" label="IP Address" />
                </div>
                <div class="form-group">
                    <select v-model="type" class="form-control">
                        <option value="Termostato">Termostat</option>
                        <option value="Otro">Other</option>
                    </select>
                </div>

            </form>
        </template>
        <template #footer>
            <ButtonComponent class="btn primary" state="primary" @click="saveDevice">Guardar</ButtonComponent>
            <ButtonComponent class="btn secondary" state="basic" @click="showModal = false">Cancelar</ButtonComponent>
        </template>
    </ModalComponent>
  
</template>

<script>
import HotelDeviceIoTCard from "../components/hotel-device-iot-card.component.vue";
import ModalComponent from "../../shared/components/modal.component.vue";
import InputTextComponent from "../../shared/components/input-text.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";
import OverviewIcon from "../../assets/organizational-management/overview-icon.svg";
import AnalyticsIcon from "../../assets/organizational-management/analytics-icon.svg";
import ProvidersIcon from "../../assets/organizational-management/providers-icon.svg";
import InventoryIcon from "../../assets/organizational-management/inventory-icon.svg";
import RoomsIcon from "../../assets/organizational-management/rooms-icon.svg";
import OrganizationIcon from "../../assets/organizational-management/organization-icon.svg";
import DevicesIcon from "../../assets/organizational-management/devices-icon.svg";
import ReservationsIcon from "../../assets/organizational-management/reservations-icon.svg";
import MainPageNavigation from "../components/main-page-navigation.component.vue";


export default {
  name: 'HotelDevicesIoTPage',
  components: {
    HotelDeviceIoTCard,
    ModalComponent,
    InputTextComponent,
    ButtonComponent,
    MainPageNavigation
  },
  data() {
    return {
      hotelId: null,
      roleId: null,
      loading: true,
      navigationItems: [
        {id: "overview", label: "Overview", path: "", icon: OverviewIcon, isActive: true},
        {id: "analytics", label: "Analytics", path: "", icon: AnalyticsIcon, isActive: false},
        {id: "providers", label: "Providers", path: "", icon: ProvidersIcon, isActive: false},
        {id: "inventory", label: "Inventory", path: "", icon: InventoryIcon, isActive: false},
        {id: "rooms", label: "Rooms", path: "", icon: RoomsIcon, isActive: false},
        {id: "organization", label: "Organization", path: "", icon: OrganizationIcon, isActive: false},
        {id: "devices", label: "Devices", path: "", icon: DevicesIcon, isActive: false}
      ],
      error: null,
      devices: [],
      hotelName: 'Royal Decameron Punta Sal',
        showModal: false,
    };
  },
  mounted() {
     this.hotelId = this.$route.params.id || null;
    this.roleId = localStorage.getItem("roleId") || null;
    console.log("Hotel ID from route:", this.hotelId);

    this.loadNavigationItems();
    this.fetchDevices();
  },
  methods: {
    loadNavigationItems() {
      // update the path with the hotel ID

      if(this.roleId == 1) {
        // reactive navigation items for roleId 3
        console.log("Role ID is 3, setting navigation paths accordingly");
        this.navigationItems.forEach(item => {
          item.path = `/home/hotel/${this.hotelId}/${item.id}`;
        });
      }else if(this.roleId == 2) {
        console.log("Role ID is 2, setting navigation paths accordingly");
        const itemsAdmin = [
          {id: "overview", label: "Overview", path: `/home/hotel/${this.hotelId}/overview`, icon: OverviewIcon, isActive: true},
          {id: "analytics", label: "Analytics", path: `/home/hotel/${this.hotelId}/analytics`, icon: AnalyticsIcon, isActive: false},
          {id: "reservations", label: "Reservations", path: `/home/hotel/${this.hotelId}/reservations`, icon: ReservationsIcon, isActive: false},
          {id: "rooms", label: "Rooms", path: `/home/hotel/${this.hotelId}/rooms`, icon: RoomsIcon, isActive: false}
        ]

        this.navigationItems.splice(0, this.navigationItems.length, ...itemsAdmin);
      }
      try {
        this.navigationItems.forEach(item => {
          item.isActive = item.path === this.$route.path;
        });
      } catch (error) {
        console.error("Error loading navigation items:", error);
      }
    },
    requestDevice() {
      this.showModal = true;
    },
    fetchDevices() {
      this.loading = true;
      this.error = null;
      
      setTimeout(() => {
        try {
          this.devices = [
            {
              id: 1,
              type: 'Termostato',
              physicalAddress: 'MAC: 27:8d:5f:9c:54:6a',
              ipAddress: '192.168.1.15',
              lastSeen: '1 hour ago',
              status: 'ACTIVE',
            },
            {
              id: 2,
              type: 'Termostato',
              physicalAddress: 'MAC: 27:8d:5f:9c:54:6b',
              ipAddress: '192.168.1.16',
              lastSeen: '7 minutes ago',
              status: 'ACTIVE',
            },
            {
              id: 3,
              type: 'Termostato',
              physicalAddress: 'MAC: 27:8d:5f:9c:54:6c',
              ipAddress: '192.168.1.17',
              lastSeen: '2 minutes ago',
              status: 'INACTIVE',
            },
            {
              id: 4,
              type: 'Termostato',
              physicalAddress: 'MAC: 27:8d:5f:9c:54:6d',
              ipAddress: '192.168.1.18',
              lastSeen: '1 hour ago',
              status: 'ACTIVE',
            }
          ];
          
          this.loading = false;
        } catch (err) {
          this.error = "Error al cargar los dispositivos. Por favor intente de nuevo.";
          this.loading = false;
          console.error('Error fetching devices:', err);
        }
      }, 800); 
    },
    saveDevice() {
      console.log('Dispositivo guardado:', {
        mac: this.mac,
        ip: this.ip,
        type: this.type
      });
      this.showModal = false;
    }
  }
};
</script>

<style scoped>
::v-deep(.modal-image) {
    background-color: #fff;
    height: 150px;
}

::v-deep(.modal-header) {
    padding-top: 0;
    text-align: center;
}


/* Estilos del form */
.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.form-group {
  display: flex;
  flex-direction: column;
}
.form-control {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
}

select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
    background-color: #fff;
    color: #333;
    cursor: pointer;
    transition: background-color 0.3s;
}

/* Estilos generales */
.hotel-devices-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

/* Estilos del encabezado */
.hotel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 30px;
}

.hotel-title {
  font-size: 28px;
  font-weight: bold;
  margin: 0 0 5px 0;
  color: #2c3e50;
}

.hotel-subtitle {
  font-size: 14px;
  color: #7f8c8d;
  margin: 0;
}

.new-device-section {
  text-align: right;
}

.new-device-text {
  font-size: 14px;
  margin: 0 0 10px 0;
  color: #7f8c8d;
}

.solicitar-btn {
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.solicitar-btn:hover {
  background-color: #006cc1;
}

/* Estilos de la cuadrícula de dispositivos */
.devices-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}



/* Estilos de carga */
.loading-container {
  text-align: center;
  padding: 40px 0;
  color: #7f8c8d;
}

.loading-spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  border-top: 4px solid var(--primary-color);
  width: 30px;
  height: 30px;
  animation: spin 1s linear infinite;
  margin: 0 auto 15px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Estilos de error */
.error-container {
  text-align: center;
  color: #e74c3c;
  padding: 20px;
  background-color: #fadbd8;
  border-radius: 4px;
}

.retry-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin-top: 10px;
  cursor: pointer;
}

.retry-btn:hover {
  background-color: #c0392b;
}

/* Media queries para responsividad */
@media (max-width: 768px) {
  .hotel-header {
    flex-direction: column;
  }
  
  .new-device-section {
    text-align: left;
    margin-top: 15px;
  }
  
  .devices-grid {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
}

@media (max-width: 480px) {
  .devices-grid {
    grid-template-columns: 1fr;
  }
}
</style>
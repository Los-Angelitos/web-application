<template>
  <MainPageNavigation
  :navigationItems="navigationItems"
  />
  <div class="hotel-devices-container">
    <div class="hotel-header">
      <div class="hotel-title-section">
        <h1 class="hotel-title">{{ hotelName }}</h1>
        <p class="hotel-subtitle">Devices IoT</p>
      </div>
      <div class="new-device-section">
        <p class="new-device-text">New device?</p>
        <button class="solicitar-btn" @click="requestDevice">Require</button>
      </div>
    </div>

    <!-- Pantalla de carga mientras se obtienen los dispositivos -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>Loading devices...</p>
    </div>

    <!-- Mensaje de error si falla la carga -->
    <div v-else-if="error" class="error-container">
      <p>{{ error }}</p>
      <button @click="fetchDevices" class="retry-btn">Retry</button>
    </div>

    <!-- Contenedor de dispositivos -->
    <div v-else class="devices-grid">
      <div v-for="device in devices" :key="device.id">
        <HotelDeviceIoTCard :device="device" />
      </div>
    </div>
  </div>

    <ModalComponent v-model="showModal" title="" :showCloseButton="true" :closeOnOverlayClick="true" :width="'500px'" :height="'auto'" :backgroundColor="'#ffffff'" v-if="showModal && this.rooms.length > 0">
        <template #image>
            <img src="../../assets/iot/plug-in-icon.svg" alt="Modal Image" />
        </template>
        <template #header>
            <h1>New device</h1>
        </template>
        <template #body>
            <form class="form">
                <div class="form-group" v-if="type !== 'RFID'">
                    <div class="mac-input-container">
                        <InputTextComponent v-model="mac" label="MAC" />
                        <button type="button" class="generate-mac-btn" @click="() => mac = macs[Math.floor(Math.random() * macs.length)]">
                            GENERATE
                        </button>
                    </div>
                </div>
                <div class="form-group">
                    <InputTextComponent v-model="ip" label="IP Address" v-if="type !== 'RFID'" />
                </div>

                <div class="form-group">
                    <InputTextComponent v-model="rfidApiKey" label="RFID API Key" v-if="type === 'RFID'" />
                </div>

                <div class="form-group">
                    <InputTextComponent v-model="uId" label="RFID UID" v-if="type === 'RFID'" />
                </div>

                <div class="form-group">
                    <select v-model="type" class="form-control">
                        <option value="" disabled selected>Select a device</option>
                        <option value="Thermostat">Thermostat</option>
                        <option value="Smoke Sensor">Smoke Sensor</option>
                        <option value="RFID">RFID Card</option>
                    </select>
                </div>
                <div class="form-group">
                    <select v-model="room" class="form-control">
                        <option value="" disabled selected>Select a room</option>
                        <option v-for="room in rooms" :value="room.id">
                            Room {{ room.id }} - State: {{ room.state }}
                        </option>
                    </select>
                </div>

            </form>
        </template>
        <template #footer>
            <ButtonComponent 
                class="btn primary" 
                state="primary" 
                :disabled="savingDevice" 
                @click="saveDevice"
            >
                <span v-if="savingDevice" class="save-loading">
                    <div class="save-spinner"></div>
                    Saving...
                </span>
                <span v-else>Save</span>
            </ButtonComponent>

            <ButtonComponent 
                class="btn secondary" 
                state="basic" 
                :disabled="savingDevice" 
                @click="showModal = false"
            >
                Cancel
            </ButtonComponent>
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
import { HotelApiService } from "../services/hotel-api.service.js";
import { RoomApiService } from "../../reservations/services/room-api.service.js";


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
      savingDevice: false, // Added separate loading state for saving
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
      rooms: [],
      hotelName: '',
      showModal: false,
      hotelApiService: new HotelApiService(),
      roomService: new RoomApiService(),
      mac: '',
      ip: '',
      type: '',
      room: '',
      rfidApiKey: '',
      uId: '',
      macs: [
        "00:1A:2B:3C:4D:5E",
        "01:2B:3C:4D:5E:6F",
        "02:3C:4D:5E:6F:70",
        "03:4D:5E:6F:70:81",
        "04:5E:6F:70:81:92",
        "05:6F:70:81:92:03",
        "06:70:81:92:03:14",
        "07:81:92:03:14:25",
        "08:92:03:14:25:36",
        "09:03:14:25:36:47",
        "0A:14:25:36:47:58",
      ]
    };
  },
  async mounted() {
     this.hotelId = this.$route.params.id || null;
      this.roleId = localStorage.getItem("roleId") || null;
      console.log("Hotel ID from route:", this.hotelId);

    this.loadNavigationItems();
    this.fetchHotelName();
    await this.fetchRooms();
    await this.fetchDevices();
  },
  methods: {
    async fetchRooms() {
      try {
        if(!this.hotelId) {
          console.error("Hotel ID is not set.");
          return;
        }

        const response = await this.roomService.getAllRooms(this.hotelId);
        if (response && response.data) {
          this.rooms = response.data.map(room => ({
            id: room.id,
            state: room.state
          }));

          console.log("Rooms fetched successfully:", this.rooms);
        } else {
          console.error("No rooms found in response:", response);
        }

      }catch(e) {
        console.error("Error fetching rooms:", e);
      }
    },  
    async fetchHotelName() {
      try {
        if (!this.hotelId) {
          console.error("Hotel ID is not set.");
          return;
        }
        const response = await this.hotelApiService.getHotelById(this.hotelId);
        if (response && response.data && response.data.name) {
          this.hotelName = response.data.name;
        } else {
          console.error("Hotel name not found in response:", response);
        }
      }catch(e) {
        console.error("Error fetching hotel name:", e);
      }
    },
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
      this.resetForm();
      this.showModal = true;
    },
    async fetchDevices() {
      this.loading = true;
      this.error = null;
      
      try {
        if (!this.hotelId) {
          console.error("Hotel ID is not set.");
          this.error = "Something went wrong. Please try again.";
          this.loading = false;
          return;
        }

        const thermostats = await this.hotelApiService.getThermostats(this.hotelId);
        const smokeSensors = await this.hotelApiService.getSmokeSensors(this.hotelId);
        const rfidCards = await this.hotelApiService.getRfidCards(this.hotelId);


        this.devices = [
          ...thermostats.data.map(device => ({
            id: device.id,
            type: 'Thermostat',
            roomId: device.roomId,
            ipAddress: device.ipAddress,
            macAddress: device.macAddress,
            temperature: device.temperature,
            state: device.state,
            lastUpdate: new Date(device.lastUpdate).toLocaleString()
          })),
          ...smokeSensors.data.map(device => ({
            id: device.id,
            type: 'Smoke Sensor',
            roomId: device.roomId,
            ipAddress: device.ipAddress,
            macAddress: device.macAddress,
            lastAnalogicValue: device.lastAnalogicValue,
            state: device.state,
            lastAlertTime: new Date(device.lastAlertTime).toLocaleString()
          })),
          ...rfidCards.data.map(device => ({
            id: device.id,
            type: 'RFID',
            roomId: device.roomId,
            apiKey: device.apiKey,
            uId: device.uId
          }))
        ];
          
        this.loading = false;
      } catch (err) {
        console.error('Error fetching devices:', err);
        this.error = "Error loading devices. Please try again.";
        this.loading = false;
      }
    },
    async saveDevice() {
      // Prevent double requests
      if (this.savingDevice) {
        return;
      }

      // Validation for RFID devices
      if (this.type === 'RFID') {
        if (!this.rfidApiKey || !this.uId || !this.room) {
          alert("Please fill in all fields for RFID device.");
          return;
        }
      } else {
        // Validation for other devices
        if (!this.mac || !this.ip || !this.type || !this.room) {
          alert("Please fill in all fields.");
          return;
        }
      }

      this.savingDevice = true;

      try {
        if (this.type === 'Thermostat') {
          await this.hotelApiService.createThermostat({
            "roomId": this.room,
            "ipAddress": this.ip,
            "macAddress": this.mac,
            "temperature": 20,
            "state": "ACTIVE",
            "lastUpdate": new Date().toISOString()
          });
        } else if (this.type === 'Smoke Sensor') {
          console.log("ola", {
            "roomId": this.room,
            "ipAddress": this.ip,
            "macAddress": this.mac,
            "lastAnalogicValue": 0,
            "state": "ACTIVE",
            "lastAlertTime": new Date().toISOString()
          })
          await this.hotelApiService.createSmokeSensor({
            "roomId": this.room,
            "ipAddress": this.ip,
            "macAddress": this.mac,
            "lastAnalogicValue": 0,
            "state": "ACTIVE",
            "lastAlertTime": new Date().toISOString()
          });
        } else if (this.type === 'RFID') {
          await this.hotelApiService.createRfidCard({
            "roomId": this.room,
            "apiKey": this.rfidApiKey,
            "uId": this.uId
          });
        }

        // Refresh devices list
        await this.fetchDevices();
        
        // Close modal and reset form
        this.showModal = false;
        this.resetForm();
        
      } catch (err) {
        console.error('Error creating device:', err);
        alert('Error creating device. Please try again.');
      } finally {
        this.savingDevice = false;
      }
    },
    resetForm() {
      this.mac = '';
      this.ip = '';
      this.type = '';
      this.room = '';
      this.rfidApiKey = '';
      this.uId = '';
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

.mac-input-container {
  position: relative;
}

.generate-mac-btn {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  height: fit-content;
  transition: background-color 0.2s;
  position: absolute;
  right: 10px;
  top: 15%;
}

.generate-mac-btn:hover {
  background-color: #0056b3;
}

.generate-mac-btn:active {
  background-color: #004494;
}

/* Save button loading styles */
.save-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.save-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
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
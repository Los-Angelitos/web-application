<template>
  <div class="hotel-devices-container">
    <div class="hotel-header">
      <div class="hotel-title-section">
        <h1 class="hotel-title">Royal Decameron Punta Sal</h1>
        <p class="hotel-subtitle">Devices IoT</p>
      </div>
      <div class="new-device-section">
        <p class="new-device-text">¿Nuevo dispositivo?</p>
        <button class="solicitar-btn">Solicitar</button>
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
</template>

<script>
import HotelDeviceIoTCard from "../components/hotel-device-iot-card.component.vue";

export default {
  name: 'HotelDevicesIoTPage',
  components: {
    HotelDeviceIoTCard
  },
  data() {
    return {
      loading: true,
      error: null,
      devices: [],
      hotelName: 'Royal Decameron Punta Sal'
    };
  },
  mounted() {
    this.fetchDevices();
  },
  methods: {
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
    }
  }
};
</script>

<style scoped>
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
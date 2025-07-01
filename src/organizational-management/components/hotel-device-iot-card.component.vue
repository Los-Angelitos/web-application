<script>
import termostatIcon from "../../assets/iot/termostat.svg";
import smokeSensorIcon from "../../assets/iot/smokesensor.png";
import rfidIcon from "../../assets/iot/rfid.png";
export default {
    name: "HotelDeviceIoT",
    props: {
        device: {
            type: Object,
            required: true
        }
    },
    methods: {
        getDeviceIcon(type) {
            console.log(this.device);
            switch (type) {
                case "Thermostat":
                    return termostatIcon;
                case "Smoke Sensor":
                    return smokeSensorIcon;
                case "RFID":
                    return rfidIcon;
                default:
                    return termostatIcon; // Default icon if type is unknown
            }
        }
    }
}
</script>

<template>
    <div class="device-card">
        <div class="device-icon">
            <div class="circle-gray">
                <img :src="getDeviceIcon(device.type)" :alt="device.type" />
            </div>
        </div>
        <div class="device-info" v-if="device.type !== 'RFID'">
            <h3 class="device-type">{{ device.type }}</h3>
            <p class="device-address">
            Physical address: {{ device.macAddress }}
            </p>
            <p class="device-ip-address">
            IP address: {{ device.ipAddress }}
            </p>
            <p class="device-ip-address device-room">
            Room: #{{ device.roomId }}
            </p>
            <p class="device-last-seen" v-if="device.lastUpdate">
                Last seen: {{ device.lastUpdate ? device.lastUpdate : 'N/A' }}
            </p>
            <p class="device-last-seen" v-else>
                Last seen: {{ device.lastAlertTime ? device.lastAlertTime : 'N/A' }}
            </p>
        </div>
        <div class="device-info" v-else>
            <h3 class="device-type">{{ device.type }}</h3>
            <p class="device-address">
            UID: {{ device.uId }}
            </p>
            <p class="device-ip-address">
            API Key: {{ device.rfidApiKey }}
            </p>
            <p class="device-ip-address device-room">
            Room: #{{ device.roomId }}
            </p>
        </div>
        <div class="device-status active">
            ACTIVE
        </div>
    </div>
</template>

<style scoped>
/* Estilos de las tarjetas de dispositivos */
.device-card {
  border: 1px solid #e1e1e1;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  padding: 20px;
  position: relative;
  height: 100%;
}

.device-icon {
  text-align: center;
  margin-bottom: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.device-icon img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.device-info {
  flex-grow: 1;
}

.device-type {
  font-size: 18px;
  font-weight: 500;
  margin: 0 0 8px 0;
  color: #2c3e50;
  text-align: center;
}

.device-address,
.device-ip-address,
.device-last-seen {
  font-size: 12px;
  color: #7f8c8d;
  margin: 5px 0;
  text-align: center;
}

.device-status {
  width: 100%;
  text-align: center;
  padding: 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  border-radius: 4px;
  margin-top: 15px;
}

.device-status.active {
  background-color: var(--primary-color);
}

.device-status.inactive {
  background-color: var(--red-color);
}

.circle-gray {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
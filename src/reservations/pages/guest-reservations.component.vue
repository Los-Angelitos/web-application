<template>
  <div class="reservation-page">
    <div class="content">
      <h1 class="hotel-name">{{ hotelName }}</h1>
      <p class="hotel-address">{{ hotelAddress }}</p>

      <div class="main-container">
        <div class="left-container">
          <div class="provider-card">
            <div class="provider-logo">
              <img src="" alt="Hoteles Decameron Logo" />
            </div>
            <div class="provider-info">
              <div class="provider-name">Hoteles Decameron Perú</div>
              <div class="provider-phone">📞 {{ hotelPhone }}</div>
            </div>
          </div>

          <div class="price-info">
            <span class="price-label">s/ 320</span>
            <span class="price-description">por 1 noche</span>
          </div>

          <div class="guest-preferences">
            <label class="checkbox-label">
              <input type="checkbox" />
              <span>Incluir mis preferencias de huésped</span>
            </label>
          </div>

          <div class="date-inputs">
            <div class="date-field">
              <label for="startDate">Desde</label>
              <input
                  id="startDate"
                  type="date"
                  v-model="startDate"
                  :max="endDate || null"
              />
            </div>
            <div class="date-field">
              <label for="endDate">Hasta</label>
              <input
                  id="endDate"
                  type="date"
                  v-model="endDate"
                  :min="startDate || null"
              />
            </div>
          </div>

          <div class="room-selector">
            <div class="room-title">Tipo de habitación</div>
            <div class="room-options-grid">
              <label
                  class="room-option"
                  v-for="type in roomTypes"
                  :key="type"
              >
                <input
                    type="radio"
                    :value="type"
                    v-model="selectedRoomType"
                    name="room"
                />
                <span class="radio-label">{{ type }}</span>
              </label>
            </div>
          </div>
        </div>

        <div class="right-container">
          <div class="hotel-description">
            <p>{{ hotelDescription }}</p>
          </div>

          <div class="amenities">
            <div class="amenity">
              <span class="amenity-icon">✓</span>
              <span class="amenity-text">Wifi pago</span>
            </div>
            <div class="amenity">
              <span class="amenity-icon">✓</span>
              <span class="amenity-text">Desayuno incluido</span>
            </div>
            <div class="amenity">
              <span class="amenity-icon">✓</span>
              <span class="amenity-text">Estacionamiento gratuito</span>
            </div>
            <div class="amenity">
              <span class="amenity-icon">✓</span>
              <span class="amenity-text">Piscina al aire libre</span>
            </div>
          </div>

          <div class="hotel-images">
            <div class="image-row">
              <img src="" alt="Hotel view" />
              <img src="" alt="Room view" />
            </div>
            <div class="image-row">
              <img src="" alt="Pool view" />
              <img src="" alt="Beach view" />
            </div>
          </div>
        </div>
      </div>

      <div class="action-buttons">
        <button class="back" @click="goBack">Atrás</button>
        <button class="reserve" @click="reserveRoom" :disabled="!selectedRoomType">Reservar</button>
      </div>
    </div>
  </div>
</template>

<script>
import { HotelsApiService } from "../../shared/services/hotels-api.service.js";
import { Hotel } from "../../shared/model/hotel.entity.js";
import { Reservation } from "../model/reservations.entity.js";
import { ReservationsApiService } from "../services/reservations-api.service.js";

export default {
  name: "GuestReservationsPage",
  data() {
    return {
      hotelId: 3,
      hotel: null,
      hotelApi: new HotelsApiService(),
      startDate: '',
      endDate: '',
      selectedRoomType: '',
      roomTypes: [
        "Habitación simple",
        "Habitación matrimonial",
        "Habitación doble",
        "Habitación con balcón"
      ],
      reservationApi: new ReservationsApiService(),
      priceRoom: 320, // Precio fijo por ahora
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },

    reserveRoom() {
      if (!this.startDate || !this.endDate || !this.selectedRoomType) return;

      const start = new Date(this.startDate);
      const end = new Date(this.endDate);

      const timeDiff = end.getTime() - start.getTime();
      const nightCount = Math.ceil(timeDiff / (1000 * 3600 * 24));
      const amount = nightCount * this.priceRoom;

      const reservation = new Reservation(
          0,
          0,
          `Reserva de ${this.selectedRoomType}`,
          start,
          end,
          this.priceRoom,
          nightCount,
          amount,
          "Pending",
          0 // preferenceId provisional
      );

      this.reservationApi
          .createReservation(0, reservation) // guestId = 0
          .then(() => {
            alert("✅ Reserva creada con éxito");
          })
          .catch((error) => {
            console.error("Error al crear la reserva:", error);
            alert("❌ Ocurrió un error al reservar");
          });
    }
  },
  computed: {
    hotelName() {
      return this.hotel?.name ?? "Hotel Name Not Found";
    },
    hotelAddress() {
      return this.hotel?.address ?? "Hotel Address Not Found";
    },
    hotelPhone() {
      return this.hotel?.phone ?? "Hotel Phone Number Not Found";
    },
    hotelDescription() {
      return this.hotel?.description ?? "Hotel Description Not Found";
    }
  },
  async created() {
    try {
      const res = await this.hotelApi.getHotelsById(this.hotelId);
      this.hotel = Hotel.fromDisplayableHotel(res.data);
    } catch (error) {
      console.error("Error al obtener hotel:", error);
    }
  }
}
</script>

<style scoped>
.reservation-page {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  background-color: white;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
  margin-bottom: 0.5rem;
}

.logo {
  display: flex;
  align-items: center;
  color: #0066cc;
  font-weight: bold;
  font-size: 1.2rem;
}

.logo-text {
  margin-left: 0.5rem;
}

.language-profile {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.language {
  font-weight: 500;
}

.profile-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #f0f0f0;
}

.content {
  padding: 0 1rem;
}

.hotel-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
  margin-top: 0.5rem;
}

.hotel-address {
  color: #666;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.main-container {
  display: flex;
  gap: 2rem;
  justify-content: space-between;
  flex-wrap: wrap;
}

.left-container {
  flex: 1 1 300px;
  max-width: 500px;
}

.right-container {
  flex: 1 1 300px;
  max-width: 600px;
}

.provider-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  border: 1px solid #eee;
}

.provider-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  overflow: hidden;
  background-color: #0093dd;
  display: flex;
  justify-content: center;
  align-items: center;
}

.provider-name {
  font-weight: 500;
  margin-bottom: 0.25rem;
}

.provider-phone {
  font-size: 0.9rem;
  color: #666;
}

.price-info {
  margin: 1.5rem 0;
}

.price-label {
  font-size: 1.5rem;
  font-weight: bold;
}

.price-description {
  font-size: 1rem;
  color: #666;
  margin-left: 0.5rem;
}

.guest-preferences {
  margin-bottom: 1.5rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.date-inputs {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.date-field {
  flex: 1;
}

.date-field label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.25rem;
}

.date-input {
  position: relative;
  display: flex;
}

.date-input input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.calendar-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
}

.room-selector {
  margin-bottom: 1.5rem;
}

.room-title {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.room-options {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
}

.room-option {
  display: flex;
  align-items: center;
}

.room-option label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-size: 0.9rem;
}

.hotel-description {
  font-size: 0.85rem;
  color: #333;
  line-height: 1.4;
  margin-bottom: 1rem;
}

.hotel-description p {
  margin-bottom: 0.5rem;
}

.amenities {
  margin-bottom: 1rem;
}

.amenity {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
  font-size: 0.85rem;
}

.amenity-icon {
  color: #0066cc;
}

.hotel-images {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.image-row {
  display: flex;
  gap: 0.5rem;
}

.hotel-images img {
  border-radius: 4px;
  width: 100%;
  max-width: 250px;
  height: auto;
  object-fit: cover;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

button {
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.back {
  background: white;
  border: 1px solid #ccc;
}

.reserve {
  background: #0066cc;
  color: white;
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
  }

  .room-options {
    grid-template-columns: 1fr;
  }

  .image-row {
    flex-direction: column;
  }
}

.room-options-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem 1.5rem;
}

.room-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;
  cursor: pointer;
}

input[type="date"] {
  width: 100%;
  padding: 0.5rem 0.75rem;
  font-size: 0.95rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: white;
  color: #333;
  font-family: inherit;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml,%3Csvg fill="gray" height="20" viewBox="0 0 24 24" width="20" xmlns="http://www.w3.org/2000/svg"%3E%3Cpath d="M7 10h5v5H7z" opacity=".3"/%3E%3Cpath d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H5V8h14v13zM7 10h5v5H7z"/%3E%3C/svg%3E');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
}

input[type="date"]:focus {
  outline: none;
  border-color: #0066cc;
  box-shadow: 0 0 0 2px rgba(0, 102, 204, 0.2);
}

</style>
<template>
  <div class="booking-page">
    <!-- Main content -->
    <div class="main-content">
      <!-- Hotel Title -->
      <h1 class="hotel-title">{{ $t('guest-reservations.hotelName') }}</h1>
      <p class="hotel-address">{{ $t('guest-reservations.hotelAddress') }}</p>

      <div class="content-container">
        <!-- Left Column -->
        <div class="booking-column">
          <!-- Hotel Card -->
          <div class="hotel-card">
            <div class="hotel-info-card">
              <img src="../../assets/images/hotel-image-4.png" :alt="$t('guest-reservations.hotelLogoAlt')" class="hotel-logo" />
              <div class="hotel-details">
                <h2>{{ $t('guest-reservations.hotelChain') }}</h2>
                <p class="phone"><span class="phone-icon">📞</span> {{ $t('guest-reservations.hotelPhone') }}</p>
              </div>
            </div>
          </div>

          <!-- Price -->
          <div class="price-container">
            <h2 class="price">{{ $t('guest-reservations.price') }}</h2>
            <span class="per-night">{{ $t('guest-reservations.perNight') }}</span>
          </div>

          <!-- Preferences Checkbox -->
          <div class="preferences">
            <label class="checkbox-wrapper">
              <input type="checkbox" v-model="includePreferences" class="checkbox-input" />
              <span class="checkbox-label">{{ $t('guest-reservations.includePreferences') }}</span>
            </label>
          </div>

          <!-- Dates -->
          <div class="date-selection">
            <div class="date-card">
              <label>{{ $t('guest-reservations.from') }}</label>
              <div class="date-input">
                <input type="text" :value="$t('guest-reservations.sampleDate')" readonly />
                <span class="calendar-icon">📅</span>
              </div>
            </div>
            <div class="date-card">
              <label>{{ $t('guest-reservations.to') }}</label>
              <div class="date-input">
                <input type="text" :value="$t('guest-reservations.sampleDateEnd')" readonly />
                <span class="calendar-icon">📅</span>
              </div>
            </div>
          </div>

          <!-- Room Selection -->
          <div class="room-selection">
            <p class="room-title">{{ $t('guest-reservations.roomType') }}</p>
            <div class="room-options">
              <div class="room-options-row">
                <label class="room-option" v-for="room in roomTypes.slice(0, 2)" :key="room.value">
                  <input type="radio" name="roomType" :value="room.value" v-model="selectedRoom" />
                  <span class="room-label">{{ $t(`guest-reservations.roomTypes.${room.value}`) }}</span>
                </label>
              </div>
              <div class="room-options-row">
                <label class="room-option" v-for="room in roomTypes.slice(2)" :key="room.value">
                  <input type="radio" name="roomType" :value="room.value" v-model="selectedRoom" />
                  <span class="room-label">{{ $t(`guest-reservations.roomTypes.${room.value}`) }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="description-column">
          <div class="description-container">
            <div class="text-description">
              <p v-for="(paragraph, index) in $t('guest-reservations.description').split('\n')" :key="index">{{ paragraph }}</p>

              <div class="amenities">
                <div class="amenity" v-for="(amenity, index) in $t('guest-reservations.amenities')" :key="index">
                  <span class="amenity-icon" :class="amenity.color">{{ amenity.icon }}</span> {{ amenity.text }}
                </div>
              </div>
            </div>

            <div class="hotel-images">
              <div class="image-row">
                <img src="../../assets/images/hotel-image-1.png" :alt="$t('guest-reservations.imageAlts.aerial')" class="hotel-main-img" />
                <img src="../../assets/images/hotel-image-2.png" :alt="$t('guest-reservations.imageAlts.room')" class="hotel-small-img" />
              </div>
              <div class="image-row-bottom">
                <img src="../../assets/images/hotel-image-3.png" :alt="$t('guest-reservations.imageAlts.beach')" class="hotel-bottom-img" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Buttons -->
      <div class="button-container">
        <div class="buttons-row">
          <ButtonComponent
              :text="$t('guest-reservations.buttons.back')"
              state="basic"
              class="btn-back"
          />
          <ButtonComponent
              :text="$t('guest-reservations.buttons.reserve')"
              state="primary"
              class="btn-reserve"
              @click="handleReservation"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from "../../shared/components/button.component.vue";

export default {
  name: "GuestReservationsPage",
  components: {
    ButtonComponent
  },
  data() {
    return {
      includePreferences: false,
      selectedRoom: null,
      roomTypes: [
        { value: "simple" },
        { value: "matrimonial" },
        { value: "doble" },
        { value: "balcon" },
      ],
    };
  },
  methods: {
    handleReservation() {
      if (!this.selectedRoom) {
        alert(this.$t('guest-reservations.validation.roomRequired'));
        return;
      }

      const message = this.includePreferences
          ? this.$t('guest-reservations.success.withPreferences')
          : this.$t('guest-reservations.success.withoutPreferences');

      alert(message);
    },
  },
};
</script>
<style scoped>
.booking-page {
  font-family: Arial, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 15px;
  color: #333;
}

.main-content {
  padding: 20px 0;
}

.hotel-title {
  font-size: 26px;
  margin-bottom: 5px;
  font-weight: bold;
}

.hotel-address {
  color: #666;
  margin-bottom: 20px;
}

.content-container {
  display: flex;
  gap: 30px;
  flex-direction: row;
}

.booking-column {
  flex: 1;
}

.description-column {
  flex: 1.5;
}

.hotel-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.hotel-info-card {
  display: flex;
  align-items: center;
}

.hotel-logo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 15px;
  object-fit: cover;
}

.hotel-details h2 {
  margin: 0 0 5px 0;
  font-size: 18px;
}

.phone {
  color: #333;
  margin: 0;
}

.phone-icon {
  color: #cc0000;
  margin-right: 5px;
}

.price-container {
  display: flex;
  align-items: baseline;
  margin: 20px 0;
}

.price {
  font-size: 30px;
  color: #000;
  margin: 0 10px 0 0;
  font-weight: bold;
}

.per-night {
  color: #666;
}

.preferences {
  margin: 20px 0;
}

.checkbox-wrapper {
  display: flex;
  align-items: center;
}

.checkbox-input {
  margin-right: 8px;
}

.date-selection {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.date-card {
  flex: 1;
}

.date-card label {
  display: block;
  margin-bottom: 5px;
  color: #666;
}

.date-input {
  display: flex;
  align-items: center;
  border: 1px solid #ccc;
  padding: 8px 10px;
  border-radius: 4px;
}

.date-input input {
  border: none;
  flex: 1;
  padding: 0;
  font-size: 16px;
  background: transparent;
}

.calendar-icon {
  margin-left: 5px;
}

.room-selection {
  margin-top: 20px;
}

.room-title {
  margin-bottom: 10px;
  color: #666;
}

.room-options {
  margin-top: 5px;
}

.room-options-row {
  display: flex;
  justify-content: flex-start;
  gap: 30px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.room-option {
  display: flex;
  align-items: center;
  cursor: pointer;
  min-width: 180px;
}

.room-option input[type="radio"] {
  margin-right: 10px;
}

.description-container {
  display: flex;
  gap: 20px;
}

.text-description {
  flex: 1;
}

.hotel-images {
  flex: 1;
  margin: 0;
}

.image-row {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.hotel-main-img {
  width: 65%;
  border-radius: 6px;
  object-fit: cover;
}

.hotel-small-img {
  width: 35%;
  border-radius: 6px;
  object-fit: cover;
}

.image-row-bottom {
  width: 103%;
  margin-top: 10px;
}

.hotel-bottom-img {
  width: 100%;
  border-radius: 6px;
  object-fit: cover;
}

.hotel-description p {
  margin: 10px 0;
  line-height: 1.5;
}

.amenities {
  margin-top: 20px;
}

.amenity {
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  font-size: 14px;
}

.amenity-icon {
  margin-right: 8px;
  display: inline-block;
  width: 16px;
  text-align: center;
}

.blue {
  color: blue;
}

.red {
  color: red;
}

.arrow {
  color: #333;
}

.button-container {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}

.buttons-row {
  display: flex;
  gap: 10px;
}

.btn-back {
  min-width: 170px;
  border: 1px solid #ccc;
  color: #333;
  background-color: white;
}

.btn-reserve {
  min-width: 170px;
  background-color: #0074cc;
  color: white;
}

/* Estilos responsivos */
@media (max-width: 991px) {
  .content-container {
    flex-direction: column;
  }

  .booking-column,
  .description-column {
    flex: 1 1 100%;
  }

  .description-container {
    flex-direction: column;
  }

  .text-description,
  .hotel-images {
    flex: 1 1 100%;
  }

  .hotel-images {
    margin-top: 20px;
  }
}

@media (max-width: 767px) {
  .date-selection {
    flex-direction: column;
    gap: 15px;
  }

  .room-options-row {
    flex-direction: column;
    gap: 10px;
  }

  .room-option {
    min-width: auto;
    width: 100%;
  }

  .buttons-row {
    flex-direction: column;
    width: 100%;
  }

  .btn-back,
  .btn-reserve {
    width: 100%;
    min-width: auto;
  }

  .button-container {
    justify-content: center;
  }
}

@media (max-width: 575px) {
  .hotel-title {
    font-size: 22px;
  }

  .hotel-info-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .hotel-logo {
    margin-bottom: 15px;
    margin-right: 0;
  }

  .image-row {
    flex-direction: column;
    gap: 15px;
  }

  .hotel-main-img,
  .hotel-small-img {
    width: 100%;
  }
}
</style>
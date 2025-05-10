<template>
  <div class="hotel-details-container">
    <div class="details-content">
      <div class="details-form-section">
        <h1 class="details-title">Detalles del hotel</h1>
        <p class="details-subtitle">Completa el siguiente formulario</p>

        <div class="details-form">
          <div class="form-section">
            <div class="section-title">Cantidad de habitaciones</div>

            <div class="radio-options">
              <div class="radio-option">
                <RadioButton
                    :inputId="'rooms10to50'"
                    name="roomsCount"
                    value="10 a 50 habitaciones"
                    v-model="roomsCount"
                />
                <label for="rooms10to50">10 a 50 habitaciones</label>
              </div>

              <div class="radio-option">
                <RadioButton
                    :inputId="'rooms51to250'"
                    name="roomsCount"
                    value="51 a 250 habitaciones"
                    v-model="roomsCount"
                />
                <label for="rooms51to250">51 a 250 habitaciones</label>
              </div>

              <div class="radio-option">
                <RadioButton
                    :inputId="'roomsMore250'"
                    name="roomsCount"
                    value="más de 250 habitaciones"
                    v-model="roomsCount"
                />
                <label for="roomsMore250">más de 250 habitaciones</label>
              </div>
            </div>
          </div>

          <div class="form-section">
            <InputTextComponent
                v-model="hotelType"
                label="Tipo de hotel"
            />
          </div>

          <div class="form-section">
            <div class="section-title">Tipo de habitaciones</div>

            <div class="checkbox-options">
              <div class="checkbox-row">
                <div class="checkbox-option">
                  <CheckboxComponent v-model="roomTypes.simple" />
                  <label>Habitación simple</label>
                </div>

                <div class="checkbox-option">
                  <CheckboxComponent v-model="roomTypes.matrimonial" />
                  <label>Habitación matrimonial</label>
                </div>
              </div>

              <div class="checkbox-row">
                <div class="checkbox-option">
                  <CheckboxComponent v-model="roomTypes.double" />
                  <label>Habitación doble</label>
                </div>

                <div class="checkbox-option">
                  <CheckboxComponent v-model="roomTypes.balcony" />
                  <label>Habitación con balcón</label>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section admin-section">
            <div class="section-title">Invitar a administrador</div>
            <div class="admin-input-container">
              <InputTextComponent
                  v-model="adminEmail"
                  label="Correo electrónico"
                  @keyup.enter="addAdminEmail"
              />
              <div class="admin-chips">
                <div v-for="(email, index) in adminEmails" :key="index" class="admin-chip">
                  {{ email }}
                  <span class="remove-chip" @click="removeAdminEmail(index)">×</span>
                </div>
              </div>
            </div>
          </div>

          <div class="form-buttons">
            <button-component
                text="Atrás"
                state="basic"
                @click="goBack"
            ></button-component>
            <button-component
                text="Continuar"
                state="primary"
                @click="submitForm"
            ></button-component>
          </div>
        </div>
      </div>

      <div class="hotel-images-section">
        <div class="image-gallery">
          <div class="main-images">
            <img src="/public/hotel_aerial_view.png" alt="Vista aérea del hotel" class="hotel-image main-image" />
            <img src="/public/hotel_room.png" alt="Habitación del hotel" class="hotel-image secondary-image" />
          </div>
          <div class="bottom-image">
            <img src="/public/hotel_beach.png" alt="Playa del hotel" class="hotel-image" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ButtonComponent from "../../shared/components/button.component.vue";
import InputTextComponent from "../../shared/components/input-text.component.vue";
import CheckboxComponent from "../../shared/components/checkbox.component.vue";

export default {
  name: 'HotelSetupPage',
  components: {
    ButtonComponent,
    InputTextComponent,
    CheckboxComponent
  },
  data() {
    return {
      roomsCount: '10 a 50 habitaciones',
      hotelType: '',
      roomTypes: {
        simple: false,
        matrimonial: false,
        double: false,
        balcony: false
      },
      adminEmail: '',
      adminEmails: []
    }
  },
  methods: {
    addAdminEmail() {
      if (this.adminEmail.trim() !== '' && this.isValidEmail(this.adminEmail)) {
        this.adminEmails.push(this.adminEmail.trim());
        this.adminEmail = '';
      }
    },
    removeAdminEmail(index) {
      this.adminEmails.splice(index, 1);
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    goBack() {
      this.$router.push('/home/hotel/set-up');
    },
    submitForm() {
      // Gather selected room types
      const selectedRoomTypes = Object.entries(this.roomTypes)
          .filter(([_, isSelected]) => isSelected)
          .map(([type]) => type);

      const formData = {
        roomsCount: this.roomsCount,
        hotelType: this.hotelType,
        roomTypes: selectedRoomTypes,
        adminEmails: [...this.adminEmails]
      };

      this.$emit('submit-form', formData);
    }
  }
}
</script>

<style scoped>
.hotel-details-container {
  width: 100%;
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.details-content {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  width: 100%;
}

.details-form-section {
  flex: 1;
  min-width: 300px;
  flex-basis: calc(50% - 15px);
}

.details-title {
  font-size: 32px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 8px;
  color: #000;
  word-wrap: break-word;
}

.details-subtitle {
  font-size: 18px;
  color: #666;
  font-weight: 300;
  margin-bottom: 30px;
}

.details-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.form-section {
  margin-bottom: 20px;
  width: 100%;
}

.section-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 10px;
}

.radio-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-left: 5px;
  width: 100%;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  width: 100%;
}

.radio-option label {
  font-size: 14px;
  color: #333;
}

.checkbox-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.checkbox-row {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
}

.checkbox-option label {
  font-size: 14px;
  color: #333;
}

.admin-section {
  margin-top: 10px;
}

.admin-input-container {
  width: 100%;
}

.admin-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.admin-chip {
  background-color: #f0f0f0;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 14px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 5px;
}

.remove-chip {
  cursor: pointer;
  font-weight: bold;
  font-size: 16px;
  color: #666;
}

.remove-chip:hover {
  color: #d32f2f;
}

.form-buttons {
  display: flex;
  gap: 15px;
  margin-top: 30px;
  width: 100%;
}

.form-buttons button {
  min-width: 120px;
}

/* Image section styles - IMPROVED */
.hotel-images-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  flex-basis: calc(50% - 15px);
}

.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 8px; /* Reduced gap between image rows */
  width: 100%;
}

.main-images {
  display: flex;
  gap: 8px; /* Reduced gap between images */
  width: 100%;
}

.main-image {
  width: 65%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
  aspect-ratio: 4/3; /* Maintain aspect ratio */
}

.secondary-image {
  width: 35%;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
  aspect-ratio: 3/4; /* Maintain aspect ratio */
}

.bottom-image img {
  width: 100%;
  height: auto;
  object-fit: cover;
  object-position: center;
  border-radius: 8px;
  aspect-ratio: 16/7; /* Maintain aspect ratio */
}

.hotel-image {
  transition: transform 0.3s ease;
  display: block; /* Prevent extra spacing */
}

.hotel-image:hover {
  transform: scale(1.03);
}

/* Responsive styles */
@media (max-width: 1100px) {
  .details-content {
    gap: 20px;
  }
}

@media (max-width: 992px) {
  .details-content {
    flex-direction: column;
  }

  .hotel-images-section {
    order: -1; /* Show images first on small screens */
    margin-bottom: 20px;
  }

  .details-form-section,
  .hotel-images-section {
    flex-basis: 100%;
    width: 100%;
  }

  .main-images {
    height: auto;
  }

  .main-image, .secondary-image {
    aspect-ratio: 16/9;
  }

  .bottom-image img {
    aspect-ratio: 16/6;
  }
}

@media (max-width: 768px) {
  .hotel-details-container {
    padding: 30px 15px;
  }

  .details-title {
    font-size: 28px;
  }

  .details-subtitle {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .form-buttons {
    justify-content: space-between;
  }

  .checkbox-row {
    flex-direction: column;
    gap: 15px;
  }
}

@media (max-width: 580px) {
  .details-title {
    font-size: 24px;
  }

  .form-buttons {
    flex-direction: column;
  }

  .main-images {
    flex-direction: column;
  }

  .main-image, .secondary-image {
    width: 100%;
    aspect-ratio: 16/9;
  }

  .checkbox-option {
    min-width: 150px;
  }

  .admin-chips {
    gap: 8px;
  }

  .admin-chip {
    font-size: 13px;
    padding: 4px 8px;
  }
}

@media (max-width: 480px) {
  .hotel-details-container {
    padding: 20px 12px;
  }

  .details-title {
    font-size: 22px;
  }

  .details-subtitle {
    font-size: 14px;
  }

  .section-title {
    font-size: 15px;
  }

  .radio-option label,
  .checkbox-option label {
    font-size: 13px;
  }
}
</style>
<template>
  <div class="hotel-registration-container">
    <div class="registration-content">
      <div class="registration-form-section">
        <h1 class="registration-title">{{i18n.global.t('hotel-register.title')}}</h1>
        <p class="registration-subtitle">{{i18n.global.t('hotel-register.subtitle')}}</p>

        <div class="registration-form">
          <div class="form-group">
            <InputTextComponent
                v-model="hotelName"
                :label="i18n.global.t('hotel-register.registration-form.hotel-name')"
            />
          </div>

          <div class="form-group">
            <InputTextComponent
                v-model="hotelAddress"
                :label="i18n.global.t('hotel-register.registration-form.hotel-address')"
            />
          </div>

          <div class="form-group">
            <InputTextComponent
                v-model="email"
                :label="i18n.global.t('hotel-register.registration-form.hotel-email')"
            />
          </div>

          <div class="form-group">
            <InputTextComponent
                v-model="phone"
                :label="i18n.global.t('hotel-register.registration-form.hotel-phone')"
            />
          </div>

          <div class="form-group">
            <label for="description" class="description-label">{{i18n.global.t('hotel-register.registration-form.hotel-description')}}</label>
            <textarea
                id="description"
                v-model="description"
                class="description-input"
                rows="4"
            ></textarea>
          </div>

          <div class="form-buttons">
            <button-component
                :text="i18n.global.t('hotel-register.registration-form.button')"
                state="primary"
                width="300"
                @click="submitForm"
            ></button-component>
          </div>
        </div>
      </div>

      <div class="hotel-images-section">
        <div class="image-gallery">
          <div class="main-image">
            <img src="/public/hotel_aerial_view.png" alt="Vista aérea del hotel" class="hotel-image" />
          </div>
          <div class="secondary-images">
            <img src="/public/hotel_room.png" alt="Habitación del hotel" class="hotel-image" />
            <img src="/public/hotel_beach.png" alt="Playa del hotel" class="hotel-image" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <ModalComponent
      v-model="showErrorModal"
      title="Validation Error"
      :close-on-overlay-click="true"
      width="400px"
  >
    <template #body>
      <p>{{ errorMessage }}</p>
    </template>
    <template #footer>
      <button-component height="40" width="100" @click="showErrorModal = false">Close</button-component>
    </template>
  </ModalComponent>
</template>

<script>
import ButtonComponent from "../../shared/components/button.component.vue";
import InputTextComponent from "../../shared/components/input-text.component.vue";
import ModalComponent from "../../shared/components/modal.component.vue";
import i18n from "../../i18n.js";

export default {
  name: 'HotelRegisterPage',
  computed: {
    i18n() {
      return i18n
    }
  },
  components: {
    ModalComponent,
    ButtonComponent,
    InputTextComponent
  },
  data() {
    return {
      hotelName: '',
      hotelAddress: '',
      email: '',
      phone: '',
      description: '',
      showErrorModal: false,
      errorMessage: ''
    }
  },
  methods: {
    submitForm() {
      // Validate form
      if (this.validateForm()) {
        this.$router.push('/home/hotel/set-up/details');
      }
    },
    isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },
    validateForm() {
      // Basic validation
      if (!this.hotelName.trim()) {
        this.errorMessage = 'Por favor ingrese el nombre del hotel';
        this.showErrorModal = true;
        return false;
      }

      if (!this.hotelAddress.trim()) {
        this.errorMessage = 'Por favor ingrese la dirección del hotel';
        this.showErrorModal = true;
        return false;
      }

      if (!this.email.trim() || !this.isValidEmail(this.email)) {
        this.errorMessage = 'Por favor ingrese un correo electrónico valido.';
        this.showErrorModal = true;
        return false;
      }

      if (!this.phone.trim()) {
        this.errorMessage = 'Por favor ingrese el número de teléfono';
        this.showErrorModal = true;
        return false;
      }
      return true;
    }
  }
}
</script>

<style scoped>
.hotel-registration-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.registration-content {
  display: flex;
  flex-wrap: wrap;
  gap: 40px;
}

.registration-form-section {
  flex: 1;
  min-width: 300px;
  width: 100%;
  max-width: 100%;
}

.registration-title {
  font-size: 32px;
  font-weight: bold;
  line-height: 1.2;
  margin-bottom: 8px;
  color: #000;
  word-wrap: break-word;
}

.registration-subtitle {
  font-size: 18px;
  color: #666;
  font-weight: 300;
  margin-bottom: 30px;
}

.registration-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.form-group {
  width: 100%;
}

.description-label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.7rem;
  color: #555;
}

.description-input {
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 16px;
  transition: border-color 0.2s;
  background-color: #f5f5f5;
  resize: vertical;
  box-sizing: border-box;
}

.description-input:focus {
  border-color: #0066cc;
  outline: none;
}

.form-buttons {
  display: flex;
  gap: 15px;
  margin-top: 20px;
  width: 100%;
  justify-content: center;
}

.form-buttons button {
  min-width: 120px;
}

.hotel-images-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 300px;
  width: 100%;
}

.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
}

.main-image {
  width: 100%;
  height: 300px;
  overflow: hidden;
  border-radius: 10px;
}

.secondary-images {
  display: flex;
  gap: 15px;
  width: 100%;
}

.secondary-images > img {
  flex: 1;
  width: 50%;
  height: 200px;
  overflow: hidden;
  border-radius: 10px;
  object-fit: cover;
}

.hotel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.hotel-image:hover {
  transform: scale(1.03);
}

/* Responsive styles */
@media (max-width: 1100px) {
  .registration-content {
    gap: 30px;
  }

  .main-image {
    height: 250px;
  }

  .secondary-images img {
    height: 170px;
  }
}

@media (max-width: 992px) {
  .registration-content {
    flex-direction: column;
  }

  .hotel-images-section {
    order: -1; /* Show images first on small screens */
    margin-bottom: 30px;
  }

  .registration-form-section,
  .hotel-images-section {
    flex: none;
    width: 100%;
    max-width: 100%;
  }

  .main-image {
    height: 300px;
  }

  .secondary-images img {
    height: 180px;
  }
}

@media (max-width: 768px) {
  .hotel-registration-container {
    padding: 30px 15px;
  }

  .registration-title {
    font-size: 28px;
  }

  .registration-subtitle {
    font-size: 16px;
    margin-bottom: 20px;
  }

  .form-buttons {
    justify-content: space-between;
  }

  .main-image {
    height: 250px;
  }

  .secondary-images img {
    height: 150px;
  }
}

@media (max-width: 580px) {
  .registration-title {
    font-size: 24px;
  }

  .form-buttons {
    flex-direction: column;
  }

  .secondary-images {
    flex-direction: column;
  }

  .secondary-images img {
    width: 100%;
    height: 180px;
  }

  .main-image {
    height: 220px;
  }
}

@media (max-width: 480px) {
  .hotel-registration-container {
    padding: 20px 12px;
  }

  .registration-title {
    font-size: 22px;
  }

  .registration-subtitle {
    font-size: 14px;
  }

  .main-image {
    height: 180px;
  }

  .secondary-images img {
    height: 150px;
  }
}
</style>
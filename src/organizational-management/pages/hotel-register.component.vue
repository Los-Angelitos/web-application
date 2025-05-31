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
            <PicturePlaceholderComponent
                ref="mainImagePlaceholder"
                @image-selected="onMainImageSelected"
                :initialImage="'/public/hotel_aerial_view.png'"
                width="100%"
                height="300px"
                class="hotel-image-placeholder"
            />
          </div>
          <div class="secondary-images">
            <PicturePlaceholderComponent
                ref="roomImagePlaceholder"
                @image-selected="onRoomImageSelected"
                :initialImage="'/public/hotel_room.png'"
                width="100%"
                height="200px"
                class="hotel-image-placeholder secondary-image"
            />
            <PicturePlaceholderComponent
                ref="beachImagePlaceholder"
                @image-selected="onBeachImageSelected"
                :initialImage="'/public/hotel_beach.png'"
                width="100%"
                height="200px"
                class="hotel-image-placeholder secondary-image"
            />
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
import PicturePlaceholderComponent from "../../shared/components/picture-placeholder.component.vue";
import i18n from "../../i18n.js";
import {HotelApiService} from "../services/hotel-api.service.js";
import {Hotel} from "../../shared/model/hotel.entity.js";

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
    InputTextComponent,
    PicturePlaceholderComponent
  },
  data() {
    return {
      hotelName: '',
      hotelAddress: '',
      email: '',
      phone: '',
      description: '',
      showErrorModal: false,
      errorMessage: '',
      mainImage: null,
      roomImage: null,
      beachImage: null
    }
  },
  props: {
    hotelApiService: {
      type: Object,
      default: () => new HotelApiService()
    }
  },
  methods: {
    onMainImageSelected(imageData) {
      this.mainImage = imageData;
      console.log("Main image selected:", imageData);
    },
    onRoomImageSelected(imageData) {
      this.roomImage = imageData;
      console.log("Room image selected:", imageData);
    },
    onBeachImageSelected(imageData) {
      this.beachImage = imageData;
      console.log("Beach image selected:", imageData);
    },
    async submitForm() {
      // Validate form
      if (this.validateForm()) {
        let userId = localStorage.getItem('userId');
        let response = await this.hotelApiService.createHotel({
          ownerId: userId,
          name: this.hotelName,
          description: this.description,
          email: this.email,
          address: this.hotelAddress,
          phone: this.phone,
          // You can include the image data here if needed
          mainImage: this.mainImage,
          roomImage: this.roomImage,
          beachImage: this.beachImage
        });
        if (response) {
          localStorage.setItem("hotelId", response.id);
          this.$router.push('/home/hotel/set-up/details');
        } else {
          this.errorMessage = 'Error al registrar el hotel. Por favor, inténtelo de nuevo más tarde.';
          this.showErrorModal = true;
        }
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

.secondary-images > .hotel-image-placeholder {
  flex: 1;
  width: 50%;
}

/* Custom styles for picture placeholders to match the original design */
.hotel-image-placeholder {
  border-radius: 10px !important;
  overflow: hidden;
}

.hotel-image-placeholder .image-placeholder {
  border-radius: 10px !important;
  border: none !important;
  transition: transform 0.3s ease;
}

.hotel-image-placeholder .image-placeholder:hover {
  transform: scale(1.03);
}

/* Override placeholder component styles to match hotel image design */
.hotel-image-placeholder .image-placeholder {
  background-color: #f8f9fa;
}

.hotel-image-placeholder .placeholder-content {
  color: #666;
}

.hotel-image-placeholder .image-overlay {
  background-color: rgba(0, 0, 0, 0.6);
}

/* Responsive styles */
@media (max-width: 1100px) {
  .registration-content {
    gap: 30px;
  }

  .main-image {
    height: 250px;
  }

  .secondary-images .hotel-image-placeholder {
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

  .secondary-images .hotel-image-placeholder {
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

  .secondary-images .hotel-image-placeholder {
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

  .secondary-images .hotel-image-placeholder {
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

  .secondary-images .hotel-image-placeholder {
    height: 150px;
  }
}
</style>
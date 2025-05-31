<template>
  <div class="hotel-details-container">
    <div class="details-content">
      <div class="details-form-section">
        <h1 class="details-title">{{i18n.global.t('hotel-setup.title')}}</h1>
        <p class="details-subtitle">{{i18n.global.t('hotel-setup.subtitle')}}</p>

        <div class="details-form">
          <div class="form-section">
            <div class="section-title">{{i18n.global.t('hotel-setup.form-section.room-type')}}</div>

            <div class="checkbox-options">
              <div class="checkbox-row">
                <div class="room-type-option">
                  <div class="checkbox-option">
                    <CheckboxComponent v-model="roomTypes.simple.selected" />
                    <label>{{i18n.global.t('hotel-setup.form-section.rooms-types.single-room')}}</label>
                  </div>
                  <div v-if="roomTypes.simple.selected" class="room-inputs-row">
                    <div class="room-count-input">
                      <InputTextComponent
                          v-model="roomTypes.simple.count"
                          :label="'Número de habitaciones'"
                          type="number"
                          placeholder="0"
                          @input="validateNumberInput($event, 'simple')"
                          @keypress="onlyNumbers"
                          @paste="preventPaste"
                          autocomplete="off"
                          spellcheck="false"
                      />
                    </div>
                    <div class="room-price-input">
                      <InputTextComponent
                          v-model="roomTypes.simple.price"
                          :label="'Precio por noche (S/.)'"
                          type="number"
                          placeholder="0.00"
                          @input="validatePriceInput($event, 'simple')"
                          @keypress="onlyNumbersAndDecimal"
                          @paste="preventPaste"
                          autocomplete="off"
                          spellcheck="false"
                      />
                    </div>
                  </div>
                </div>

                <div class="room-type-option">
                  <div class="checkbox-option">
                    <CheckboxComponent v-model="roomTypes.matrimonial.selected" />
                    <label>{{i18n.global.t('hotel-setup.form-section.rooms-types.matrimonial-room')}}</label>
                  </div>
                  <div v-if="roomTypes.matrimonial.selected" class="room-inputs-row">
                    <div class="room-count-input">
                      <InputTextComponent
                          v-model="roomTypes.matrimonial.count"
                          :label="'Número de habitaciones'"
                          type="number"
                          placeholder="0"
                          @input="validateNumberInput($event, 'matrimonial')"
                          @keypress="onlyNumbers"
                          @paste="preventPaste"
                          autocomplete="off"
                          spellcheck="false"
                      />
                    </div>
                    <div class="room-price-input">
                      <InputTextComponent
                          v-model="roomTypes.matrimonial.price"
                          :label="'Precio por noche (S/.)'"
                          type="number"
                          placeholder="0.00"
                          @input="validatePriceInput($event, 'matrimonial')"
                          @keypress="onlyNumbersAndDecimal"
                          @paste="preventPaste"
                          autocomplete="off"
                          spellcheck="false"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="checkbox-row">
                <div class="room-type-option">
                  <div class="checkbox-option">
                    <CheckboxComponent v-model="roomTypes.double.selected" />
                    <label>{{i18n.global.t('hotel-setup.form-section.rooms-types.double-room')}}</label>
                  </div>
                  <div v-if="roomTypes.double.selected" class="room-inputs-row">
                    <div class="room-count-input">
                      <InputTextComponent
                          v-model="roomTypes.double.count"
                          :label="'Número de habitaciones'"
                          type="number"
                          placeholder="0"
                          @input="validateNumberInput($event, 'double')"
                          @keypress="onlyNumbers"
                          @paste="preventPaste"
                          autocomplete="off"
                          spellcheck="false"
                      />
                    </div>
                    <div class="room-price-input">
                      <InputTextComponent
                          v-model="roomTypes.double.price"
                          :label="'Precio por noche (S/.)'"
                          type="number"
                          placeholder="0.00"
                          @input="validatePriceInput($event, 'double')"
                          @keypress="onlyNumbersAndDecimal"
                          @paste="preventPaste"
                          autocomplete="off"
                          spellcheck="false"
                      />
                    </div>
                  </div>
                </div>

                <div class="room-type-option">
                  <div class="checkbox-option">
                    <CheckboxComponent v-model="roomTypes.balcony.selected" />
                    <label>{{i18n.global.t('hotel-setup.form-section.rooms-types.suite-room')}}</label>
                  </div>
                  <div v-if="roomTypes.balcony.selected" class="room-inputs-row">
                    <div class="room-count-input">
                      <InputTextComponent
                          v-model="roomTypes.balcony.count"
                          :label="'Número de habitaciones'"
                          type="number"
                          placeholder="0"
                          @input="validateNumberInput($event, 'balcony')"
                          @keypress="onlyNumbers"
                          @paste="preventPaste"
                          autocomplete="off"
                          spellcheck="false"
                      />
                    </div>
                    <div class="room-price-input">
                      <InputTextComponent
                          v-model="roomTypes.balcony.price"
                          :label="'Precio por noche (S/.)'"
                          type="number"
                          placeholder="0.00"
                          @input="validatePriceInput($event, 'balcony')"
                          @keypress="onlyNumbersAndDecimal"
                          @paste="preventPaste"
                          autocomplete="off"
                          spellcheck="false"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="form-section admin-section">
            <div class="section-title">{{i18n.global.t('hotel-setup.form-section.admin-invite')}}</div>
            <div class="admin-input-container">
              <InputTextComponent
                  v-model="adminEmail"
                  :label="i18n.global.t('hotel-setup.form-section.admin-mail')"
                  @keyup.enter="addAdminEmail"
                  autocomplete="off"
                  spellcheck="false"
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
                :text="i18n.global.t('hotel-setup.form-section.back-button')"
                state="basic"
                @click="goBack"
            ></button-component>
            <button-component
                :text="i18n.global.t('hotel-setup.form-section.next-button')"
                state="primary"
                @click="submitForm"
            ></button-component>
          </div>
        </div>
      </div>

      <div class="hotel-images-section">
        <div class="image-gallery">
          <div class="bottom-image">
            <img :src="getMainImageUrl()" alt="Playa del hotel" class="hotel-image" />
          </div>
          <div class="main-images">
            <img :src="getSecondaryImageUrl(0)" alt="Vista aérea del hotel" class="hotel-image main-image" />
            <img :src="getSecondaryImageUrl(1)" alt="Habitación del hotel" class="hotel-image secondary-image" />
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
import i18n from "../../i18n.js";
import {SetupApiService} from "../services/setup-api.service.js";
import {MultimediaApiService} from "../services/multimedia-api.service.js";

export default {
  name: 'HotelSetupPage',
  computed: {
    i18n() {
      return i18n
    }
  },
  components: {
    ButtonComponent,
    InputTextComponent,
    CheckboxComponent
  },
  data() {
    return {
      roomTypes: {
        simple: {
          selected: false,
          count: '',
          price: ''
        },
        matrimonial: {
          selected: false,
          count: '',
          price: ''
        },
        double: {
          selected: false,
          count: '',
          price: ''
        },
        balcony: {
          selected: false,
          count: '',
          price: ''
        }
      },
      adminEmail: '',
      adminEmails: [],
      mainImage: null,
      secondariesImages: [],
    }
  },
  props: {
    setupApiService: {
      type: Object,
      default: () => new SetupApiService()
    },
    multimediaApiService: {
      type: Object,
      default: () => new MultimediaApiService()
    }
  },
  async mounted() {
    await this.getImageUrls();
  },
  methods: {
    async getImageUrls() {
      try {
        let hotelId = localStorage.getItem("hotelId");
        this.mainImage = await this.multimediaApiService.getMainMultimediaByHotelId(hotelId);
        console.log('Main image:', this.mainImage);
        this.secondariesImages = await this.multimediaApiService.getDetailsMultimediaByHotelId(hotelId);
        console.log('Secondary images:', this.secondariesImages);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    },
    getMainImageUrl() {
      if (this.mainImage && this.mainImage.url) {
        return this.mainImage.url;
      }
      return '/public/hotel_beach.png'; // Fallback image
    },
    getSecondaryImageUrl(index) {
      if (this.secondariesImages && this.secondariesImages[index] && this.secondariesImages[index].url) {
        return this.secondariesImages[index].url;
      }
      // Fallback images
      const fallbacks = ['/public/hotel_aerial_view.png', '/public/hotel_room.png'];
      return fallbacks[index] || '/public/hotel_aerial_view.png';
    },
    // Number validation methods (for room count - integers only)
    onlyNumbers(event) {
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
      if (allowedKeys.includes(event.key)) {
        return;
      }

      if (!/[0-9]/.test(event.key)) {
        event.preventDefault();
      }
    },
    // Number validation for prices (allows decimal point)
    onlyNumbersAndDecimal(event) {
      const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter'];
      if (allowedKeys.includes(event.key)) {
        return;
      }

      // Allow numbers and decimal point
      if (!/[0-9.]/.test(event.key)) {
        event.preventDefault();
        return;
      }

      // Prevent multiple decimal points
      const currentValue = event.target.value;
      if (event.key === '.' && currentValue.includes('.')) {
        event.preventDefault();
      }
    },
    preventPaste(event) {
      event.preventDefault();
      return false;
    },
    validateNumberInput(value, roomType) {
      // Remove any non-numeric characters
      const numericValue = value.replace(/[^0-9]/g, '');

      // Update the room count with only numeric value
      this.roomTypes[roomType].count = numericValue;

      // Add maximum limit (e.g., 999 rooms)
      if (parseInt(numericValue) > 999) {
        this.roomTypes[roomType].count = '999';
      }
    },
    validatePriceInput(value, roomType) {
      // Remove any non-numeric characters except decimal point
      let numericValue = value.replace(/[^0-9.]/g, '');

      // Ensure only one decimal point
      const decimalParts = numericValue.split('.');
      if (decimalParts.length > 2) {
        numericValue = decimalParts[0] + '.' + decimalParts.slice(1).join('');
      }

      // Limit to 2 decimal places
      if (decimalParts.length === 2 && decimalParts[1].length > 2) {
        numericValue = decimalParts[0] + '.' + decimalParts[1].substring(0, 2);
      }

      // Update the room price with validated value
      this.roomTypes[roomType].price = numericValue;

      // Add maximum limit (e.g., 9999.99)
      if (parseFloat(numericValue) > 9999.99) {
        this.roomTypes[roomType].price = '9999.99';
      }
    },
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
    async submitForm() {
      // Gather selected room types with their counts and prices
      const selectedRoomTypes = Object.entries(this.roomTypes)
          .filter(([_, roomType]) => roomType.selected && roomType.count > 0 && roomType.price > 0)
          .map(([type, roomType]) => ({
            type: type,
            count: parseInt(roomType.count),
            price: parseFloat(roomType.price)
          }));

      for (const roomType of selectedRoomTypes) {
        await this.setupApiService.setUpRoomsByTypeRoom({"description": roomType.type, "price": roomType.price, "count": roomType.count});
      }

      const formData = {
        roomTypes: selectedRoomTypes,
        adminEmails: [...this.adminEmails]
      };

      console.log('Form data:', formData);
      this.$emit('submit-form', formData);
      this.$router.push('/home/hotel/set-up/review');
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

.checkbox-options {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.checkbox-row {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.room-type-option {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  border: 1px solid #eee;
  border-radius: 8px;
  background-color: #fafafa;
}

.checkbox-option {
  display: flex;
  align-items: center;
  gap: 10px;
}

.checkbox-option label {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.room-inputs-row {
  display: flex;
  gap: 15px;
  margin-left: 30px;
  align-items: flex-start;
}

.room-count-input {
  flex: 1;
  max-width: 180px;
}

.room-price-input {
  flex: 1;
  max-width: 180px;
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

  .room-inputs-row {
    margin-left: 20px;
    gap: 10px;
  }

  .room-count-input,
  .room-price-input {
    max-width: 150px;
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

  .room-inputs-row {
    flex-direction: column;
    margin-left: 15px;
    gap: 10px;
  }

  .room-count-input,
  .room-price-input {
    max-width: 200px;
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

  .checkbox-option label {
    font-size: 13px;
  }

  .room-inputs-row {
    margin-left: 10px;
  }

  .room-count-input,
  .room-price-input {
    max-width: 160px;
  }
}
</style>
<script>
import PicturePlaceholderComponent from "../../shared/components/picture-placeholder.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";
import {HotelsApiService} from "../../shared/services/hotels-api.service.js";
import {MultimediaApiService} from "../services/multimedia-api.service.js";
import Cloudinary from "../../shared/services/external/cloudinary.js";

export default {
  name: "HotelSetupReview",
  components: {
    PicturePlaceholderComponent,
    ButtonComponent
  },
  data() {
    return {
      hotel: {
        name: "",
        address: "",
        description: "",
        email: "",
        phone: "",
        ownerId: 0,
        category: ""
      },
      mainImage: null,
      secondariesImages: [],
      imagesLoaded: false,
      editing: {
        description: false,
        email: false,
        phone: false
      },
      editable: {
        description: '',
        email: '',
        phone: ''
      },
      // Image data storage
      mainImageData: {
        file: null,
        dataUrl: null,
        cloudinaryUrl: null
      },
      roomImageData: {
        file: null,
        dataUrl: null,
        cloudinaryUrl: null
      },
      beachImageData: {
        file: null,
        dataUrl: null,
        cloudinaryUrl: null
      },
      logoImageData: {
        file: null,
        dataUrl: null,
        cloudinaryUrl: null
      },
      // Upload status tracking
      uploadingImages: {
        main: false,
        room: false,
        beach: false
      },
      cloudinary: new Cloudinary()
    };
  },
  props: {
    hotelsApiService: {
      type: Object,
      default: () => new HotelsApiService()
    },
    multimediaApiService: {
      type: Object,
      default: () => new MultimediaApiService()
    }
  },
  async mounted() {
    await this.loadHotelData();
    await this.getImageUrls();
  },
  methods: {
    async loadHotelData() {
      try {
        const hotelId = localStorage.getItem("hotelId");

        if (hotelId) {
          const hotel = await HotelsApiService.getHotelsById(hotelId);
          if (hotel) {
            this.hotel = {
              name: hotel.name || "",
              address: hotel.address || "",
              description: hotel.description || "",
              email: hotel.email || "",
              phone: hotel.phone || "",
              ownerId: hotel.ownerId || 0,
              category: hotel.category || ""
            };
            console.log("Hotel data loaded:", this.hotel);
          }
        }
      } catch (error) {
        console.error("Error loading hotel data:", error);
      }
    },
    async getImageUrls() {
      try {
        let hotelId = localStorage.getItem("hotelId");

        if (hotelId) {
          this.mainImage = await this.multimediaApiService.getMainMultimediaByHotelId(hotelId);
          console.log('Main image:', this.mainImage);
          this.secondariesImages = await this.multimediaApiService.getDetailsMultimediaByHotelId(hotelId);
          console.log('Secondary images:', this.secondariesImages);
          this.imagesLoaded = true; // Mark images as loaded
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        this.imagesLoaded = true; // Still mark as loaded to show fallbacks
      }
    },
    getMainImageUrl() {
      if (this.mainImage && this.mainImage.url) {
        return this.mainImage.url;
      }
      return '/public/hotel_aerial_view.png'; // Fallback image
    },
    getSecondaryImageUrl(index) {
      // Check if secondariesImages array exists and has enough items
      if (!this.secondariesImages || this.secondariesImages.length <= index) {
        console.log('Secondary images not loaded yet or index out of bounds:', index);
        const fallbacks = ['/public/hotel_room.png', '/public/hotel_beach.png'];
        return fallbacks[index] || '/public/hotel_room.png';
      }

      let entity = this.secondariesImages[index];
      console.log('Entity at index', index, ':', entity);

      if (entity && entity.url) {
        console.log('Using entity URL:', entity.url);
        return entity.url;
      }

      // Fallback images
      const fallbacks = ['/public/hotel_room.png', '/public/hotel_beach.png'];
      console.log('Using fallback image for index:', index);
      return fallbacks[index] || '/public/hotel_room.png';
    },
    async onMainImageSelected(imageData) {
      console.log("Main image selected:", imageData);

      if (imageData && imageData.file) {
        // Store the file and dataUrl immediately for preview
        this.mainImageData.file = imageData.file;
        this.mainImageData.dataUrl = imageData.dataUrl;

        // Upload to Cloudinary
        await this.uploadImageToCloudinary('main', imageData.file);
      }
    },
    async onRoomImageSelected(imageData) {
      console.log("Room image selected:", imageData);

      if (imageData && imageData.file) {
        // Store the file and dataUrl immediately for preview
        this.roomImageData.file = imageData.file;
        this.roomImageData.dataUrl = imageData.dataUrl;

        // Upload to Cloudinary
        await this.uploadImageToCloudinary('room', imageData.file);
      }
    },
    async onBeachImageSelected(imageData) {
      console.log("Beach image selected:", imageData);

      if (imageData && imageData.file) {
        // Store the file and dataUrl immediately for preview
        this.beachImageData.file = imageData.file;
        this.beachImageData.dataUrl = imageData.dataUrl;

        // Upload to Cloudinary
        await this.uploadImageToCloudinary('beach', imageData.file);
      }
    },
    async onLogoSelected(imageData) {
      console.log("Logo selected:", imageData);

      if (imageData && imageData.file) {
        // Store the file and dataUrl immediately for preview
        this.logoImageData.file = imageData.file;
        this.logoImageData.dataUrl = imageData.dataUrl;

        // Upload to Cloudinary
        await this.uploadImageToCloudinary('logo', imageData.file);
      }
    },
    async uploadImageToCloudinary(imageType, file) {
      this.uploadingImages[imageType] = true;

      try {
        console.log(`Uploading ${imageType} image to Cloudinary...`);
        const cloudinaryUrl = await this.cloudinary.uploadImage(file);

        if (cloudinaryUrl) {
          // Store the Cloudinary URL
          switch (imageType) {
            case 'main':
              this.mainImageData.cloudinaryUrl = cloudinaryUrl;
              break;
            case 'room':
              this.roomImageData.cloudinaryUrl = cloudinaryUrl;
              break;
            case 'beach':
              this.beachImageData.cloudinaryUrl = cloudinaryUrl;
              break;
            case 'logo':
              this.logoImageData.cloudinaryUrl = cloudinaryUrl;
              break;
          }

          console.log(`${imageType} image uploaded successfully:`, cloudinaryUrl);
        } else {
          throw new Error('Failed to upload image to Cloudinary');
        }
      } catch (error) {
        console.error(`Error uploading ${imageType} image:`, error);
        this.errorMessage = `Error al subir la imagen ${imageType}. Por favor, inténtelo de nuevo.`;
        this.showErrorModal = true;

        // Reset the image data on error
        switch (imageType) {
          case 'main':
            this.mainImageData = { file: null, dataUrl: null, cloudinaryUrl: null };
            break;
          case 'room':
            this.roomImageData = { file: null, dataUrl: null, cloudinaryUrl: null };
            break;
          case 'beach':
            this.beachImageData = { file: null, dataUrl: null, cloudinaryUrl: null };
            break;
        }
      } finally {
        this.uploadingImages[imageType] = false;
      }
    },
    enableEdit(field) {
      this.editable[field] = this.hotel[field];
      this.editing[field] = true;
      this.$nextTick(() => {
        const input = this.$refs[field];
        if (input) input.focus();
      });
    },
    saveEdit(field) {
      this.hotel[field] = this.editable[field];
      this.editing[field] = false;
      // Here you would typically make an API call to save the changes
      console.log(`Saved ${field}:`, this.hotel[field]);
    },
    goBack() {
      // Navigate back to previous step
      this.$router.go(-1);
    },
    async finishSetup() {
      let hotelId = localStorage.getItem("hotelId");

      await this.hotelsApiService.UpdateHotel({"description": this.hotel.description, "email": this.hotel.email,
        "address": this.hotel.address, "phone": this.hotel.phone, "ownerId": this.hotel.ownerId, "category": this.hotel.category}, hotelId);

      //await this.multimediaApiService.createMultimedia({"hotelId": hotelId, "url": this.logoImageData.cloudinaryUrl, "type": "LOGO", "position": 1});

      this.$router.push(`/home/hotel/${hotelId}/overview`);
    }
  }
};
</script>

<template>
  <div class="hotel-setup-review-container">
    <!-- Header Section -->
    <div class="header-section">
      <h1 class="page-title">Everything ready?</h1>
      <p class="page-subtitle">Choose and upload a photo of your hotel so it can be found by the entire SweetManager community.</p>
    </div>

    <!-- Main Content -->
    <div class="hotel-container">
      <!-- Left Side: Hotel Info and Images -->
      <div class="hotel-left">
        <h2 class="hotel-title">{{ hotel.name }}</h2>
        <p class="hotel-address">{{ hotel.address }}</p>

        <div class="image-gallery">
          <!-- Main aerial image -->
          <div class="main-image-container">
            <PicturePlaceholderComponent
                :key="`main-${imagesLoaded}`"
                ref="mainImagePlaceholder"
                @image-selected="onRoomImageSelected"
                :initialImage="getSecondaryImageUrl(0)"
                width="100%"
                height="100%"
                class="hotel-image-placeholder"
            />
          </div>

          <!-- Room image -->
          <div class="room-image-container">
            <PicturePlaceholderComponent
                :key="`room-${imagesLoaded}`"
                ref="roomImagePlaceholder"
                @image-selected="onBeachImageSelected"
                :initialImage="getSecondaryImageUrl(1)"
                width="100%"
                height="100%"
                class="hotel-image-placeholder"
            />
          </div>

          <!-- Beach image -->
          <div class="beach-image-container">
            <PicturePlaceholderComponent
                :key="`beach-${imagesLoaded}`"
                ref="beachImagePlaceholder"
                @image-selected="onMainImageSelected"
                :initialImage="getMainImageUrl()"
                width="100%"
                height="100%"
                class="hotel-image-placeholder"
            />
          </div>

          <!-- Hotel Logo -->
          <div class="hotel-logo">
            <PicturePlaceholderComponent
                ref="logoPlaceholder"
                @image-selected="onLogoSelected"
                :initialImage="null"
                width="80px"
                height="80px"
                class="hotel-logo-placeholder"
            />
          </div>
        </div>
      </div>

      <!-- Right Side: Hotel Details -->
      <div class="hotel-right">
        <h2 class="section-title">Discover how everyone see your hotel</h2>

        <!-- Description Section -->
        <div class="section">
          <div class="section-header">
            <div class="section-label">Description</div>
            <span class="edit-icon" @click="enableEdit('description')">🖉 Edit</span>
          </div>

          <div v-if="editing.description" class="edit-container">
            <textarea
                ref="description"
                v-model="editable.description"
                class="edit-area"
            ></textarea>
            <button-component
                text="Save changes"
                state="primary"
                @click="saveEdit('description')"
                class="save-button"
            />
          </div>
          <p v-else class="description">{{ hotel.description }}</p>
        </div>

        <hr class="section-divider"/>

        <!-- Email Section -->
        <div class="section">
          <div class="section-header">
            <div class="section-label">Email</div>
            <span class="edit-icon" @click="enableEdit('email')">🖉 Edit</span>
          </div>

          <div v-if="editing.email" class="edit-container">
            <input
                ref="email"
                v-model="editable.email"
                class="edit-input"
                type="email"
            />
            <button-component
                text="Save changes"
                state="primary"
                @click="saveEdit('email')"
                class="save-button"
            />
          </div>
          <p v-else class="contact">{{ hotel.email }}</p>
        </div>

        <hr class="section-divider"/>

        <!-- Phone Section -->
        <div class="section">
          <div class="section-header">
            <div class="section-label">Phone Number</div>
            <span class="edit-icon" @click="enableEdit('phone')">🖉 Edit</span>
          </div>

          <div v-if="editing.phone" class="edit-container">
            <input
                ref="phone"
                v-model="editable.phone"
                class="edit-input"
                type="tel"
            />
            <button-component
                text="Save changes"
                state="primary"
                @click="saveEdit('phone')"
                class="save-button"
            />
          </div>
          <p v-else class="contact">{{ hotel.phone }}</p>
        </div>
      </div>
    </div>

    <!-- Bottom Action Buttons -->
    <div class="action-buttons">
      <button-component
          text="Back"
          state="basic"
          width="200"
          @click="goBack"
      />
      <button-component
          text="Finish"
          state="primary"
          width="200"
          @click="finishSetup"
      />
    </div>
  </div>
</template>

<style scoped>
.hotel-setup-review-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

.header-section {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #000;
}

.page-subtitle {
  color: #666;
  font-size: 1rem;
  margin-bottom: 0;
}

.hotel-container {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

/* Left Side */
.hotel-left {
  flex: 1;
  min-width: 400px;
}

.hotel-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #000;
}

.hotel-address {
  color: #666;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
}

.image-gallery {
  position: relative;
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 180px 190px;
  gap: 10px;
  border-radius: 12px;
}

.main-image-container {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.room-image-container {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.beach-image-container {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
}

.hotel-image-placeholder {
  width: 100%;
  height: 100%;
  border-radius: 12px !important;
  overflow: hidden;
}

.hotel-image-placeholder .image-placeholder {
  border-radius: 12px !important;
  border: none !important;
  height: 100%;
}

.hotel-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
}

.hotel-logo-placeholder {
  border-radius: 50% !important;
  overflow: hidden;
  border: 3px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.hotel-logo-placeholder .image-placeholder {
  border-radius: 50% !important;
  border: none !important;
  background-color: rgba(108, 142, 156, 0.9);
}

.hotel-logo-placeholder .placeholder-content {
  color: white;
  font-size: 0.7rem;
}

.hotel-logo-placeholder .image-icon {
  fill: white;
  width: 24px;
  height: 24px;
}

/* Right Side */
.hotel-right {
  flex: 1;
  min-width: 400px;
}

.section-title {
  font-size: 1.1rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #333;
}

.section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.section-label {
  font-weight: 500;
  color: #333;
}

.edit-icon {
  font-size: 0.875rem;
  color: #666;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.edit-icon:hover {
  background-color: #f5f5f5;
}

.description {
  font-size: 0.875rem;
  color: #333;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.amenities-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: #555;
}

.amenity-icon {
  font-size: 1rem;
}

.contact {
  font-size: 0.875rem;
  color: #333;
}

.section-divider {
  border: none;
  border-top: 1px solid #eee;
  margin: 1rem 0;
}

.edit-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.edit-area {
  width: 100%;
  min-height: 120px;
  font-size: 0.875rem;
  font-family: inherit;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  box-sizing: border-box;
}

.edit-input {
  width: 100%;
  font-size: 0.875rem;
  font-family: inherit;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
}

.save-button {
  align-self: flex-start;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

/* Responsive Design */
@media (max-width: 968px) {
  .hotel-container {
    flex-direction: column;
  }

  .hotel-left,
  .hotel-right {
    min-width: unset;
  }

  .action-buttons {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .hotel-setup-review-container {
    padding: 1rem;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .image-gallery {
    grid-template-columns: 1fr;
    grid-template-rows: 200px 150px 180px;
  }

  .main-image-container {
    grid-column: 1 / 2;
    grid-row: 1 / 2;
  }

  .room-image-container {
    grid-column: 1 / 2;
    grid-row: 2 / 3;
  }

  .beach-image-container {
    grid-column: 1 / 2;
    grid-row: 3 / 4;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>
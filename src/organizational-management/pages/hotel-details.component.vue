<!-- HotelDetail.vue -->
<template>
  <div class="hotel-detail-container" v-if="hotel">
    <h1 class="hotel-title">{{ hotel.name }}</h1>
    
    <!-- Galeria de imágenes -->
    <div class="image-gallery">
      <div class="gallery-nav">
        <button @click="prevImage" class="gallery-button prev" :disabled="currentImageIndex === 0">
          &lt;
        </button>
        <div class="gallery-images">
          <img v-for="(image, index) in hotel.images" 
               :key="index" 
               :src="image" 
               :alt="`${hotel.name} - Imagen ${index + 1}`" 
               :class="{ 'active': index === currentImageIndex }"
               @click="setCurrentImage(index)" />
        </div>
        <button @click="nextImage" class="gallery-button next" :disabled="currentImageIndex === hotel.images.length - 1">
          &gt;
        </button>
      </div>
      
      <div class="main-image-container">
        <img :src="hotel.images[currentImageIndex]" :alt="hotel.name" class="main-image" />
      </div>
    </div>
    
    <!-- Información del hotel -->
    <div class="hotel-info-container">
      <div class="location-info">
        <div class="location-marker">
          <h2>📍</h2>
        </div>
        <div class="location-text">
          <h2>{{ hotel.name }}</h2>
          <p>{{ hotel.address }}</p>
        </div>
      </div>
      
      <!-- Información del contacto -->
      <div class="contact-info">
        <div class="hotel-brand">
          <img :src="hotel.logoUrl" :alt="hotel.name" class="brand-logo">
          <div class="brand-details">
            <h3>{{ hotel.name }}</h3>
            <p>✉️ {{ hotel.email }}</p>
            <p class="phone-number">
              <span class="phone-icon">📞</span> {{ hotel.phone }}
            </p>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Contenedor de dos columnas para descripción y precio -->
    <div class="content-two-columns">
      <!-- Columna izquierda: Descripción del hotel -->
      <div class="left-column">
        <div class="hotel-description">
          <h2>{{ i18n.global.t('hotel-details.hotel-details-card-component.about') }}</h2>
          <p style="white-space: pre-line;">{{ hotel.description }}</p>
        </div>
        
      </div>
      
      <!-- Columna derecha: Precio y Reserva -->
      <div class="right-column">
        <div class="reservation-container">
          <div class="price-info">
            <h3>{{ i18n.global.t('hotel-details.hotel-details-card-component.from') }} <span class="price">S/ {{ hotel.price }}</span> {{ i18n.global.t('hotel-details.hotel-details-card-component.per-night') }}</h3>
          </div>
          <button class="book-button" @click="newReservationHotel" v-if="canBooking">{{ messageBooking }}</button>
        </div>
      </div>
    </div>

    <!-- Modal overlay for requesting admin access to join hotel -->
  <div class="modal-overlay" v-if="ownerRequest" @click.self="closeModal">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">Request Admin Access</h2>
        <button class="close-button" @click="closeModal">
          <span>&times;</span>
        </button>
      </div>

      <div class="modal-body">
        <div class="hotel-info">
          <div class="hotel-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
              <path d="M19 19V4h-4V3H5v16H3v2h18v-2h-2zm-6-6h-4v-3h4v3z" fill="#1976d2"/>
            </svg>
          </div>
          <div>
            <h3>{{ hotel.name }}</h3>
            <p class="location"><span class="location-icon">📍</span> {{ hotel.address }}</p>
          </div>
        </div>

        <div class="divider"></div>

        <div class="owner-info">
          <h4>Hotel Owner Contact</h4>
          <div class="contact-details">
            <div class="contact-item">
              <span class="contact-label">Email:</span>
              <span class="contact-value">{{ hotel.email }}</span>
            </div>
            <div class="contact-item">
              <span class="contact-label">Phone:</span>
              <span class="contact-value">{{ hotel.phone }}</span>
            </div>
          </div>
        </div>

        <div class="message-area">
          <label for="request-message">Your message to the owner:</label>
          <textarea 
            id="request-message"
            v-model="requestMessage" 
            placeholder="Explain why you'd like admin access to this hotel..."
            rows="4"
          ></textarea>
          <p class="hint-text">The owner will review your request and contact you.</p>
        </div>
      </div>

      <div class="modal-footer">
        <button class="cancel-button" @click="closeModal">Cancel</button>
        <button 
          class="request-button" 
          @click="requestAccessHotel" 
          :disabled="isRequestingAccess || !requestMessage.trim()"
        >
          <span v-if="isRequestingAccess" class="spinner"></span>
          <span v-else>Send Request</span>
        </button>
      </div>
    </div>
  </div>
  </div>

  <Toast ref="toast" position="top-right" />
</template>


<script>
import i18n from "../../i18n.js";
import { HotelApiService } from "../services/hotel-api.service.js";
import { OrganizationApiService } from "../services/organization-api.service.js";

export default {
  name: 'HotelDetailPage',
  computed: {
    i18n() {
      return i18n;
    }
  },
  data() {
    return {
      organizationService: new OrganizationApiService(),
      hotelApiService: new HotelApiService(),
      currentImageIndex: 0,
      hotel: null,
      requestMessage: '',
      isRequestingAccess: false,
      ownerRequest: false,
      canBooking: true,
      messageBooking: 'Quote your next booking',
    };
  },
  async created() {
    const roleId = localStorage.getItem('roleId');
    if(roleId == 2) {
      this.canBooking = true;
      this.messageBooking = 'Request admin access to join this hotel';
    } else if(roleId == 1) {
      this.canBooking = false;
      this.messageBooking = '';
    }else if(roleId == 3) {
      this.canBooking = true;
      this.messageBooking = 'Quote your next booking';
    }


    
    // llamada a la API
    await this.fetchHotelData();
  },
  methods: {
    closeModal() {
      this.ownerRequest = false;
      this.requestMessage = '';
    },
    async requestAccessHotel() {
      if (!this.requestMessage.trim()) {
        return;
      }

      this.isRequestingAccess = true;

      try {
        // Create request payload
        const requestPayload = {
          adminId: JSON.parse(localStorage.getItem('user'))?.id,
          hotelId: this.hotel.id,
          additionalMessage: this.requestMessage.trim()
        };

        // Simulate endpoint call
        console.log('Sending admin access request:', requestPayload);
        
        const response = await this.organizationService.requestAdminAccessToHotel(requestPayload);

        // Show success message
        alert('Your request for admin access has been sent successfully! The hotel owner will review it and contact you soon.');
        console.log('Admin access request sent successfully:', response.data);

        // Close the modal
        this.closeModal();
      } catch (error) {
        console.error('Error sending admin access request:', error);
      } finally {
        this.isRequestingAccess = false;
      }
    },
    newReservationHotel() {
      console.log("New reservation for hotel:", this.hotel.id);
      const userId = JSON.parse(localStorage.getItem('user'))?.id;

      if(!userId) {
        console.error("User ID not found in localStorage");
        this.$router.push('/auth/sign-in'); // Redirigir al login si no hay usuario
        return;
      }

      const roleId = localStorage.getItem('roleId');
      console.log("User role ID:", roleId); 
      if(roleId == 3) {
        this.$router.push({
          name: 'Hotel Bookings',
          params: { hotelId: this.hotel.id, userId: userId }
        });
      }else if(roleId == 2) {
        // REQUEST WITH A MODAL FOR THE OWNER 
        this.ownerRequest = true;
      }

    },
    async getHotelDetailsImages(hotelId) {
      try {
        const response = await this.hotelApiService.getHotelDetailMultimedia(hotelId);
        if (!response.data || response.data.length === 0) {
          console.warn("No images found for hotel:", hotelId);
          return [
            'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg',
            'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg',
            'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'
          ];
        }


        return response.data.map(image => image.url);
      } catch (error) {
        console.error("Error fetching hotel images:", error);
        return [
          'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg',
          'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg',
          'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'
        ]
      }
    },
    async getLogoHotelImage(hotelId) {
      try {
        const response = await this.hotelApiService.getHotelLogoMultimedia(hotelId);
        return response.data.url || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'; // Fallback image URL
      } catch (error) {
        console.error("Error fetching hotel logo:", error);
        return 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'; // Fallback image URL
      }
    },
    async getMainHotelImage(hotelId) {
      try {
        const response = await this.hotelApiService.getHotelMainMultimedia(hotelId);
        return response.data.url || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'; // Fallback image URL
      } catch (error) {
        console.error("Error fetching hotel main image:", error);
        return 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg'; // Fallback image URL
      }
    },
    async getHotelPrice(hotelId) {
      try {
        const response = await this.hotelApiService.getHotelPrice(hotelId);
        console.log("Hotel price response:", response);
        return response.data.minimumPrice || 49.9; // Fallback price
      } catch (error) {
        console.error("Error fetching hotel price:", error);
        return 49.9; // Fallback price
      }
    },
    async fetchHotelData() {
      // Simulación de una llamada a la API para obtener los datos del hotel
      const hotelId = this.$route.params.id; // Obtener el ID del hotel de la ruta

      try {
        const hotel = await this.hotelApiService.getHotelById(hotelId);
        if(!hotel) {
          console.error("Hotel not found");
          this.$router.push('/not-found'); // Redirigir si no se encuentra el hotel
          return;
        }

        // Obtener el precio del hotel
        const price = await this.getHotelPrice(hotelId);
        this.hotel = hotel.data; // Asignar los datos del hotel
        this.hotel.price = price; // Asignar el precio al hotel
        this.hotel.images = await this.getHotelDetailsImages(hotelId); // Obtener las imágenes del hotel
        this.hotel.logoUrl = await this.getLogoHotelImage(hotelId); // Obtener la imagen del logo
        this.hotel.mainImageUrl = await this.getMainHotelImage(hotelId); // Obtener la imagen principal

        console.log("Hotel data:", this.hotel);

      }catch(e) {
        console.error("Error fetching hotel data:", e);
      }
    },
    prevImage() {
      if (this.currentImageIndex > 0) {
        this.currentImageIndex--;
      }
    },
    nextImage() {
      if (this.currentImageIndex < this.hotel.images.length - 1) {
        this.currentImageIndex++;
      }
    },
    setCurrentImage(index) {
      this.currentImageIndex = index;
    }
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3500;
  overflow-y: auto;
  padding: 20px;
}

.modal-container {
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.15);
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  animation: modal-appear 0.3s ease-out forwards;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: translateY(-50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #eaeaea;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #777;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  transition: background-color 0.2s;
}

.close-button:hover {
  background-color: #f0f0f0;
}

.modal-body {
  padding: 20px;
}

.hotel-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.hotel-icon {
  flex-shrink: 0;
  background-color: #e3f2fd;
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hotel-info h3 {
  margin: 0 0 6px 0;
  font-size: 18px;
  font-weight: 600;
}

.location {
  display: flex;
  align-items: center;
  gap: 5px;
  margin: 0;
  color: #666;
  font-size: 14px;
}

.location-icon {
  font-size: 14px;
}

.divider {
  height: 1px;
  background-color: #eaeaea;
  margin: 20px 0;
}

.owner-info h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  color: #444;
}

.contact-details {
  background-color: #f9f9f9;
  border-radius: 6px;
  padding: 12px 16px;
}

.contact-item {
  display: flex;
  margin-bottom: 8px;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-label {
  font-weight: 500;
  width: 80px;
  flex-shrink: 0;
}

.contact-value {
  color: #555;
}

.message-area {
  margin-top: 20px;
}

.message-area label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #444;
}

textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
  transition: border-color 0.2s;
}

textarea:focus {
  border-color: #1976d2;
  outline: none;
}

.hint-text {
  margin-top: 8px;
  font-size: 12px;
  color: #777;
  font-style: italic;
}

.modal-footer {
  padding: 16px 20px;
  border-top: 1px solid #eaeaea;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.cancel-button {
  background-color: transparent;
  border: 1px solid #ddd;
  color: #555;
  padding: 10px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.cancel-button:hover {
  background-color: #f5f5f5;
}

.request-button {
  background-color: #1976d2;
  color: white;
  border: none;
  padding: 10px 24px;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 120px;
}

.request-button:hover {
  background-color: #1565c0;
}

.request-button:disabled {
  background-color: #bbdefb;
  cursor: not-allowed;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 600px) {
  .modal-container {
    max-width: 100%;
    margin: 0 10px;
  }
  
  .modal-header {
    padding: 12px 16px;
  }
  
  .modal-body, .modal-footer {
    padding: 16px;
  }
}
.hotel-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

.hotel-title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 24px;
  color: #333;
}

/* Galería de imágenes */
.image-gallery {
  margin-bottom: 30px;
  display: flex;
  gap: 15px;
}

.gallery-nav {
  width: 100px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.gallery-images {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 0px;
  overflow-y: auto;
  gap: 10px;
  max-height: 400px;
}

.gallery-images img {
  width: 90px;
  height: 70px;
  object-fit: cover;
  border-radius: 4px;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.3s;
}

.gallery-images img:hover, .gallery-images img.active {
  opacity: 1;
  box-shadow: 0 0 0 2px #0066cc;
}

.gallery-button {
  background: white;
  border: 1px solid #ddd;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  align-self: center;
}

.gallery-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.main-image-container {
  flex-grow: 1;
  height: 400px;
  overflow: hidden;
  border-radius: 8px;
}

.main-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Información del hotel */
.hotel-info-container {
  display: flex;
  justify-content: space-between;
  margin-bottom: 30px;
  padding: 20px 0;
  border-bottom: 1px solid #eaeaea;
}

.location-info {
  display: flex;
  align-items: flex-start;
}

.location-marker h2{
  font-size: 20px;
  margin-right: 10px;
}

.location-text h2 {
  font-size: 20px;
  margin: 0 0 5px 0;
  color: #333;
}

.location-text p {
  margin: 0;
  color: #666;
}

.contact-info {
  flex-shrink: 0;
}

.hotel-brand {
  display: flex;
  align-items: center;
}

.brand-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-right: 24px;
  object-fit: cover;
  border: 1px solid #eaeaea;
}

.brand-details h3 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.brand-details p {
  margin: 0 0 5px 0;
  font-size: 14px;
  color: #666;
}

.phone-number {
  display: flex;
  align-items: center;
}

.phone-icon {
  margin-right: 5px;
}

/* Layout de dos columnas */
.content-two-columns {
  display: flex;
  gap: 30px;
  margin-bottom: 30px;
}

.left-column {
  flex: 2;
}

.right-column {
  flex: 1;
}

/* Precio y Reserva */
.reservation-container {
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  position: sticky;
  top: 20px;
}

.price-info h3 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.price {
  font-size: 22px;
  font-weight: bold;
  color: #0066cc;
}

.book-button {
  background-color: #0066cc;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 12px 24px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s;
  width: 100%;
}

.book-button:hover {
  background-color: #004c99;
}

/* Descripción y amenidades */
.hotel-description, .amenities {
  margin-bottom: 30px;
}

.hotel-description h2, .amenities h2 {
  font-size: 22px;
  margin-bottom: 15px;
  color: #333;
}

.hotel-description p {
  line-height: 1.6;
  color: #444;
}

.amenities-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 10px;
  padding-left: 20px;
}

.amenities-list li {
  color: #444;
}

/* Responsividad */
@media (max-width: 768px) {
  .hotel-info-container {
    flex-direction: column;
    gap: 20px;
  }
  
  .image-gallery {
    flex-direction: column;
  }
  
  .gallery-nav {
    width: 100%;
    flex-direction: row;
    order: 2;
  }
  
  .gallery-images {
    flex-direction: row;
    max-height: none;
    overflow-x: auto;
    overflow-y: hidden;
  }
  
  .content-two-columns {
    flex-direction: column;
  }
  
  .main-image-container {
    height: 300px;
    order: 1;
  }
}

@media (max-width: 480px) {
  .main-image-container {
    height: 250px;
  }
  
  .hotel-title {
    font-size: 24px;
  }
  
  .gallery-images img {
    width: 70px;
    height: 50px;
  }
}
</style>
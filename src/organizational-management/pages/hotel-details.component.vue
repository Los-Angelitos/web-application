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
          <button class="book-button">{{ i18n.global.t('hotel-details.hotel-details-card-component.quote') }}</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script>
import i18n from "../../i18n.js";
import { HotelApiService } from "../services/hotel-api.service.js";

export default {
  name: 'HotelDetailPage',
  computed: {
    i18n() {
      return i18n;
    }
  },
  data() {
    return {
      hotelApiService: new HotelApiService(),
      currentImageIndex: 0,
      hotel: null
    };
  },
  async created() {
    // llamada a la API
    await this.fetchHotelData();
  },
  methods: {
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
    async fetchHotelData() {
      // Simulación de una llamada a la API para obtener los datos del hotel
      const hotelId = this.$route.params.id; // Obtener el ID del hotel de la ruta
      console.log("Hotel ID meneme:", hotelId);

      try {
        const hotel = await this.hotelApiService.getHotelById(hotelId);
        if(!hotel) {
          console.error("Hotel not found");
          this.$router.push('/not-found'); // Redirigir si no se encuentra el hotel
          return;
        }

        this.hotel = hotel.data; // Asignar los datos del hotel
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
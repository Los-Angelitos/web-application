<template>
  <div class="hotel-gallery">
    <!-- Grid de hoteles filtrados -->
    <div class="gallery-grid" v-if="hotels.length > 0 && filteredHotels.length > 0">
      <hotel-card
        v-for="hotel in filteredHotels"
        :key="hotel.id"
        :hotel="hotel"
        class="gallery-item" 
        @click="onSelectHotel(hotel.id)"
      />
    </div>

    <!-- Mensaje cuando no hay hoteles en la categoría -->
    <div v-if="filteredHotels.length === 0 && hotels.length > 0" class="no-hotels-message">
      <img src="https://cdn-icons-png.flaticon.com/512/7486/7486740.png" alt="No hoteles disponibles" />
      <p>No hotels available in this category.</p>
    </div>

    <!-- Estado de carga -->
    <div v-if="hotels.length === 0" class="loading-container">
      <div class="spinner"></div>
      <p>Loading hotels...</p>
    </div>
  </div>  
</template>

<script>
import HotelCard from "../components/hotel-card.component.vue"
import { HotelApiService } from "../services/hotel-api.service.js";

export default {
  name: 'HotelGallery',
  components: {
    HotelCard
  },
  data() {
    return {
      hotels: [],
      hotelApi: new HotelApiService(),
      selectedCategory: 'all'
    };
  },
  computed: {
    filteredHotels() {
      if (this.selectedCategory === 'all') return this.hotels;
      return this.hotels.filter(hotel => hotel.category === this.selectedCategory.toUpperCase());
    }
  },
  watch: {
    '$route.query.category': {
      handler(newCategory) {
        this.selectedCategory = newCategory || 'all';
      },
      immediate: true
    }
  },
  async created() {
    await this.loadHotels();
  },
  methods: {
    async loadHotels() {
      try {
        const response = await this.hotelApi.getHotels();
        const data = response.data;

        this.hotels = [];

        for (let i = 0; i < data.length; ++i) {
          const imageUrl = await this.getMainHotelImage(data[i].id);
          const logoUrl = await this.getLogoHotelImage(data[i].id);
          this.hotels.push({
            id: data[i].id,
            logoUrl,
            imageUrl,
            name: data[i].name,
            description: data[i].description,
            email: data[i].email,
            address: data[i].address,
            phone: data[i].phone,
            ownerId: data[i].ownerId,
            category: data[i].category,
          });
        }

        this.selectedCategory = this.$route.query.category || 'all';
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    },

    onSelectHotel(hotelId) {
      this.$router.push(`/home/hotel/${hotelId}`);
    },
    
    async getMainHotelImage(hotelId) {
      try {
        const response = await this.hotelApi.getHotelMainMultimedia(hotelId);
        return response.data.url || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';
      } catch {
        return 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';
      }
    },

    async getLogoHotelImage(hotelId) {
      try {
        const response = await this.hotelApi.getHotelLogoMultimedia(hotelId);
        return response.data.url || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';
      } catch {
        return 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';
      }
    }
  }
}
</script>

<style scoped>
.hotel-gallery {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: 20px;
}

.no-hotels-message,
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  color: #6c757d;
  font-size: 18px;
}

.no-hotels-message img {
  width: 150px;
  margin-bottom: 20px;
  opacity: 0.8;
}

/* Spinner moderno */
.spinner {
  border: 6px solid #f3f3f3;
  border-top: 6px solid #007BFF;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (min-width: 640px) {
  .gallery-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .gallery-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .gallery-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>

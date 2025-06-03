<!-- HotelGallery.vue -->
<template>
  <div class="hotel-gallery">
    <!-- Grid de hoteles filtrados -->
    <div class="gallery-grid">
      <hotel-card
        v-for="hotel in filteredHotels"
        :key="hotel.id"
        :hotel="hotel"
        class="gallery-item" 
        @click="onSelectHotel(hotel.id)"
      />
    </div>

    <!-- Mensaje cuando no hay hoteles -->
    <div v-if="filteredHotels.length === 0 && hotels.length > 0" class="no-hotels-message">
      <p>No se encontraron hoteles en esta categoría.</p>
    </div>

    <!-- Loading state -->
    <div v-if="hotels.length === 0" class="loading-message">
      <p>Cargando hoteles...</p>
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
    // Hoteles filtrados según la categoría seleccionada
    filteredHotels() {
      if (this.selectedCategory === 'all') {
        return this.hotels;
      }
      return this.hotels.filter(hotel => hotel.category === this.selectedCategory.toUpperCase());
    }
  },

  watch: {
    // Observar cambios en la ruta para actualizar el filtro
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
        
        console.log(response);
        const data = response.data;

        // Clear existing hotels
        this.hotels = [];

        for(let i=0; i<data.length; ++i) {
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
        
        // Establecer categoría inicial desde la URL
        this.selectedCategory = this.$route.query.category || 'all';
        
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    },

    onSelectHotel(hotelId) {
      console.log(`Selected hotel ID: ${hotelId}`);
      this.$router.push(`/home/hotel/${hotelId}`);
    },
    
    async getMainHotelImage(hotelId) {
      try {
        const response = await this.hotelApi.getHotelMainMultimedia(hotelId);
        console.log("response", response);
        return response.data.url || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';
      } catch (error) {
        console.error(`Error loading main image for hotel ${hotelId}:`, error);
        return 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';
      }
    },
    
    async getLogoHotelImage(hotelId) {
      try {
        const response = await this.hotelApi.getHotelLogoMultimedia(hotelId);
        return response.data.url || 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg';
      } catch (error) {
        console.error(`Error loading logo image for hotel ${hotelId}:`, error);
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

/* Mensaje cuando no hay hoteles */
.no-hotels-message,
.loading-message {
  text-align: center;
  padding: 40px;
  color: #6c757d;
  font-size: 18px;
}

.no-hotels-message p,
.loading-message p {
  margin: 0;
}

/* Responsive grid */
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
<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
  />
  
  <!-- Loading Spinner -->
  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p class="loading-text">Cargando información del hotel...</p>
    </div>
  </div>

  <!-- Main Content -->
  <div v-else class="hotel-container">
     <!-- Izquierda: Título, dirección e imágenes -->
     <div class="hotel-left">
       <h2 class="hotel-title">{{hotel.name}}</h2>
       <p class="hotel-address">{{hotel.address}}</p>

       <div>
         <div>
           <div class="image-gallery">
             <img
                 v-for="(image, index) in filteredImages"
                 :key="index"
                 :src="image.src"
                 :alt="image.alt || 'Hotel Image'"
                 :class="{ 'full-width-image': image.type === 'MAIN' }"
             />
           </div>
         </div>
       </div>
     </div>

     <!-- Derecha: Descripción, servicios, contacto -->
     <div class="hotel-right">
       <h2 class="section-title">Find out how others see your hotel!</h2>

       <div class="section">
         <div class="section-header">
           <div>Descripción</div>
           <span class="edit-icon" @click="enableEdit('description')">Edit</span>
         </div>

         <div v-if="editing.description">
           <textarea ref="description" v-model="editable.description" class="edit-area"></textarea>
           <button class="save-button" @click="saveEdit('description')">Save changes</button>
         </div>
         <p v-else class="description" style="white-space: pre-line">
           {{ hotel.description }}
         </p>

       </div>

       <hr style="margin-bottom:0.5rem"/>
       <div class="section">
         <div class="section-header">
           <div>Email Address</div>
           <span class="edit-icon" @click="enableEdit('email')">Edit</span>
         </div>

         <div v-if="editing.email">
           <input
               ref="email"
               v-model="editable.email"
               class="edit-input"
           />
           <button class="save-button" @click="saveEdit('email')">Save changes</button>
         </div>
         <p v-else class="contact">{{ hotel.email }}</p>

       </div>

       <hr style="margin-bottom:0.5rem"/>
       <div class="section">
         <div class="section-header">
           <div>Phone</div>
           <span class="edit-icon" @click="enableEdit('phone')">Edit</span>
         </div>

         <div v-if="editing.phone">
           <input
               ref="phone"
               v-model="editable.phone"
               class="edit-input"
           />
           <button class="save-button" @click="saveEdit('phone')">Save changes</button>
         </div>
         <p v-else class="contact">{{ hotel.phone }}</p>

       </div>
     </div>
   </div>
</template>

<script>
import SearchBar from "../../shared/components/search-bar.component.vue";
import TopBarComponent from "../../shared/components/top-bar.component.vue";
import MainPageNavigation from "../components/main-page-navigation.component.vue";

import OverviewIcon from "../../assets/organizational-management/overview-icon.svg";
import AnalyticsIcon from "../../assets/organizational-management/analytics-icon.svg";
import ProvidersIcon from "../../assets/organizational-management/providers-icon.svg";
import InventoryIcon from "../../assets/organizational-management/inventory-icon.svg";
import RoomsIcon from "../../assets/organizational-management/rooms-icon.svg";
import OrganizationIcon from "../../assets/organizational-management/organization-icon.svg";
import DevicesIcon from "../../assets/organizational-management/devices-icon.svg";
import ReservationsIcon from "../../assets/organizational-management/reservations-icon.svg";
import {HotelsApiService} from "../../shared/services/hotels-api.service.js";

import {useAuthenticationStore} from '/src/iam/services/authentication.store.js';
import {MultimediaApiService} from "../services/multimedia-api.service.js"; // Ajusta la ruta según tu estructura

const userId = useAuthenticationStore.state.userId;

export default {
  name: "HotelOverviewPage",
  components: { SearchBar, TopBarComponent, MainPageNavigation },

  data() {
    return {
      isLoading: true, // Loading state
      hotelId: null,
      detailImages: [],
      filteredImages: [],
      mainImages: [],
      allImages: [],
      userId: userId, // Obtenemos el userId del store de autenticación
      navigationItems: [
        {id: "overview", label: "Overview", path: "", icon: OverviewIcon, isActive: true},
        {id: "analytics", label: "Analytics", path: "", icon: AnalyticsIcon, isActive: false},
        {id: "providers", label: "Providers", path: "", icon: ProvidersIcon, isActive: false},
        {id: "inventory", label: "Inventory", path: "", icon: InventoryIcon, isActive: false},
        {id: "rooms", label: "Rooms", path: "", icon: RoomsIcon, isActive: false},
        {id: "organization", label: "Organization", path: "", icon: OrganizationIcon, isActive: false},
        {id: "devices", label: "Devices", path: "", icon: DevicesIcon, isActive: false}
      ],
      hotel: {
        id: null,
        name: "",
        address: "",
        description: "",
        email: "",
        phone: "",
        ownerId: userId
      },
      editable: {
        description: '',
        email: '',
        phone: ''
      },
      editing: {
        description: false,
        email: false,
        phone: false
      },
      roleId: null
    };
  },

  async mounted() {
    this.hotel.id = this.$route.params.id || null;
    this.roleId = localStorage.getItem("roleId") || null;
    this.userId = localStorage.getItem("userId");
    console.log("Hotel ID from route:", this.hotel.id);

    try {
      await this.loadNavigationItems();
      await this.loadHotelMockData();
    } catch (error) {
      console.error("Error during page initialization:", error);
    } finally {
      this.isLoading = false; // Stop loading regardless of success or error
    }
  },

  methods: {
    async loadNavigationItems() {
      // update the path with the hotel ID

      if(this.roleId == 1) {
        // reactive navigation items for roleId 3
        console.log("Role ID is 3, setting navigation paths accordingly");
        this.navigationItems.forEach(item => {
          item.path = `/home/hotel/${this.hotel.id}/${item.id}`;
        });
      }else if(this.roleId == 2) {
        console.log("Role ID is 2, setting navigation paths accordingly");
        const itemsAdmin = [
          {id: "overview", label: "Overview", path: `/home/hotel/${this.hotel.id}/overview`, icon: OverviewIcon, isActive: true},
          {id: "analytics", label: "Analytics", path: `/home/hotel/${this.hotel.id}/analytics`, icon: AnalyticsIcon, isActive: false},
          {id: "reservations", label: "Reservations", path: `/home/hotel/${this.hotel.id}/reservations`, icon: ReservationsIcon, isActive: false},
          {id: "rooms", label: "Rooms", path: `/home/hotel/${this.hotel.id}/rooms`, icon: RoomsIcon, isActive: false}
        ]

        this.navigationItems.splice(0, this.navigationItems.length, ...itemsAdmin);
      }
      try {
        this.navigationItems.forEach(item => {
          item.isActive = item.path === this.$route.path;
        });
      } catch (error) {
        console.error("Error loading navigation items:", error);
      }
    },
    async loadHotelMockData() {
      try {
        const multimediaService = new MultimediaApiService();
        console.log("User ID:", this.userId);

        if(this.roleId == 2) {
          this.hotel = await HotelsApiService.getHotelsById(this.hotel.id);
          console.log("Hotel data for roleId 2:", this.hotel);
        }else {
          this.hotel = await HotelsApiService.getHotelByOwnerId(this.userId);
        }

        if (!this.hotel || !this.hotel.id) {
          console.error("Hotel not found or missing ID");
          return;
        }

        this.hotel.ownerId = this.userId;
        
        const mainMultimedia = await multimediaService.getMainMultimediaByHotelId(this.hotel.id) || [];
        const detailMultimedia = await multimediaService.getDetailsMultimediaByHotelId(this.hotel.id) || [];

        const allImages = [
          ...(Array.isArray(mainMultimedia) ? mainMultimedia : [mainMultimedia]),
          ...(Array.isArray(detailMultimedia) ? detailMultimedia : [])
        ];

        console.log("All images loaded:", allImages);

        this.allImages = allImages.length >= 3 ? allImages.slice(2) : [];

        if(!this.allImages.length) {
          this.filteredImages = [
            { src: 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg', alt: 'Placeholder Image 1', type: 'MAIN' },
            { src: 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg', alt: 'Placeholder Image 2', type: 'DETAIL' },
            { src: 'https://coffective.com/wp-content/uploads/2018/06/default-featured-image.png.jpg', alt: 'Placeholder Image 3', type: 'DETAIL' }
          ];
        }else  {
          this.filteredImages = allImages.map(img => ({
            src: img.url,
            alt: img.type,
            type: img.type
          }));
        }

        this.editable = this.hotel;

        console.log("Hotel data loaded:", this.hotel);
      } catch (error) {
        console.error("Error in loadHotelMockData:", error);
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

    async saveEdit(field) {
      this.hotel[field] = this.editable[field];
      await HotelsApiService.UpdateHotel(this.hotel);
      this.editing[field] = false;
      // En el futuro: aquí iría el PUT al backend
    }
  }
};
</script>

<style scoped>
/* Loading Styles */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 80px); /* Adjust based on your navigation height */
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e0e0e0;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  color: #666;
  font-size: 1rem;
  margin: 0;
  text-align: center;
}

/* Existing Styles */
.hotel-container {
  display: flex;
  gap: 1.5rem;
  padding: 2rem;
  font-family: Arial, sans-serif;
}

/* Left Side */
.hotel-left {
  flex: 1;
}

.hotel-title {
  font-size: 2rem;
}

.hotel-address {
  color: #555;
  margin-bottom: 1rem;
}
.edit-area {
  width: 100%;
  min-height: 6rem;
  font-size: 0.875rem;
  font-family: inherit;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
  resize: vertical;
}
.save-button {
  background-color: var(--primary-color, #007bff);
  color: white;
  border: none;
  border-radius: 0.5rem;
  padding: 0.4rem 1rem;
  cursor: pointer;
  font-size: 0.875rem;
}

.edit-input {
  width: 100%;
  font-size: 0.875rem;
  font-family: inherit;
  padding:  0.5rem;
  border: 1px solid #ccc;
  border-radius: 0.5rem;
}

.image-gallery {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-template-rows: 11.25rem 11.875rem; /* 180px and 190px */
  gap: 0.625rem; /* 10px */
  border-radius: 0.75rem; /* 12px */
}

.image-gallery img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 0.75rem;
}

.image-gallery img:nth-child(1) {
  grid-column: 1 / 2;
  grid-row: 1 / 2;
}

.image-gallery img:nth-child(2) {
  grid-column: 2 / 3;
  grid-row: 1 / 2;
}

.image-gallery img:nth-child(3) {
  grid-column: 1 / 3;
  grid-row: 2 / 3;
}

/* Right Side */
.hotel-right {
  flex: 1;
}

.section-title {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 1rem;
  margin-top: 0.4375rem; /* 7px */
}

.section {
  margin-bottom: 1rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-icon {
  font-size: 0.875rem; /* 14px */
  color: #007bff;
  cursor: pointer;
}

.description {
  font-size: 0.875rem;
  color: #333;
  margin-top: 0.3125rem; /* 5px */
  line-height: 1.5;
}

.amenities {
  margin-top: 0.625rem;
  list-style: none;
  padding: 0;
  font-size: 0.875rem;
}

.amenities li {
  margin-bottom: 0.25rem; /* 4px */
}

.contact {
  font-size: 0.875rem;
  color: #444;
}

/* Responsive Loading */
@media (max-width: 768px) {
  .loading-container {
    padding: 1rem;
  }
  
  .spinner {
    width: 40px;
    height: 40px;
    border-width: 3px;
  }
  
  .loading-text {
    font-size: 0.875rem;
  }
}
</style>
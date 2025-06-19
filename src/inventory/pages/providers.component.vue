<script>
import BasicCardComponent from "../../shared/components/basic-card.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";
import { ProviderApiService } from "../services/provider-api.service.js";
import { Provider } from "../model/provider.entity.js";
import {HotelsApiService} from "../../shared/services/hotels-api.service.js";
import {Hotel} from "../../shared/model/hotel.entity.js";
import ProviderDetailsComponent from "../components/provider-details.component.vue";
import ProviderDeleteConfirmComponent from "../components/provider-delete.component.vue";
import MainPageNavigation from "../../organizational-management/components/main-page-navigation.component.vue";
import OverviewIcon from "../../assets/organizational-management/overview-icon.svg";
import AnalyticsIcon from "../../assets/organizational-management/analytics-icon.svg";
import ProvidersIcon from "../../assets/organizational-management/providers-icon.svg";
import InventoryIcon from "../../assets/organizational-management/inventory-icon.svg";
import RoomsIcon from "../../assets/organizational-management/rooms-icon.svg";
import OrganizationIcon from "../../assets/organizational-management/organization-icon.svg";
import DevicesIcon from "../../assets/organizational-management/devices-icon.svg";
import ProviderAddModalComponent from "../components/provider-add.component.vue";
import i18n from "../../i18n.js";
import {Booking} from "../../reservations/model/booking.entity.js";
import {Supply} from "../model/supply.entity.js";
import ReservationsIcon from "../../assets/organizational-management/reservations-icon.svg";

export default {
  name: "ProvidersPage",
  components: {
    MainPageNavigation,
    BasicCardComponent,
    ButtonComponent,
    ProviderDetailsComponent,
    ProviderDeleteConfirmComponent,
    ProviderAddModalComponent,
  },
  data() {
    return {
      isLoading: true,
      hotelId: 1,
      hotel: null,
      hotelApi: new HotelsApiService(),
      providers: [],
      providerApi: new ProviderApiService(),
      selectedProvider: null,
      selectedAvatar: '',
      navigationItems: [
        {id: "overview", label: "Overview", path: "", icon: OverviewIcon, isActive: true},
        {id: "analytics", label: "Analytics", path: "", icon: AnalyticsIcon, isActive: false},
        {id: "providers", label: "Providers", path: "", icon: ProvidersIcon, isActive: false},
        {id: "inventory", label: "Inventory", path: "", icon: InventoryIcon, isActive: false},
        {id: "rooms", label: "Rooms", path: "", icon: RoomsIcon, isActive: false},
        {id: "organization", label: "Organization", path: "", icon: OrganizationIcon, isActive: false},
        {id: "devices", label: "Devices", path: "", icon: DevicesIcon, isActive: false}
      ],
      selectedProviderId: null,
      showAddModal: false,
      showDeleteModal: false,
      providerToDeleteId: null
    };
  },
   async mounted() {
    this.hotelId = this.$route.params.id || null;
    this.roleId = localStorage.getItem("roleId") || null;
    console.log("Hotel ID from route:", this.hotelId);
    this.loadNavigationItems();
  },
  async created() {
    this.isLoading = true;
    
    try {
      this.hotelId = this.$route.params.id || null;
      this.roleId = localStorage.getItem("roleId") || null;

      // Cargar proveedores y hotel en paralelo
      const [providersRes, hotelRes] = await Promise.all([
        this.providerApi.getProviders(this.hotelId),
        HotelsApiService.getHotelsById(this.hotelId)
      ]);

      // Procesar proveedores
      if(providersRes) {
        this.providers = providersRes
            .filter(p => p.state === "active")
            .map(p => Provider.fromDisplayableProvider(p));
      }

      // Procesar hotel
      this.hotel = Hotel.fromDisplayableHotel(hotelRes);

      console.log(this.providers);
    } catch (error) {
      console.error("Error al cargar los datos:", error);
    } finally {
      this.isLoading = false;
    }
  },
  computed: {
    i18n() {
      return i18n
    },
    hotelName() {
      return this.hotel?.name ?? "Hotel Name Not Found";
    }
  },
  methods: {
    loadNavigationItems() {
      // update the path with the hotel ID

      if(this.roleId == 1) {
        // reactive navigation items for roleId 3
        console.log("Role ID is 3, setting navigation paths accordingly");
        this.navigationItems.forEach(item => {
          item.path = `/home/hotel/${this.hotelId}/${item.id}`;
        });
      }else if(this.roleId == 2) {
        console.log("Role ID is 2, setting navigation paths accordingly");
        const itemsAdmin = [
          {id: "overview", label: "Overview", path: `/home/hotel/${this.hotelId}/overview`, icon: OverviewIcon, isActive: true},
          {id: "analytics", label: "Analytics", path: `/home/hotel/${this.hotelId}/analytics`, icon: AnalyticsIcon, isActive: false},
          {id: "reservations", label: "Reservations", path: `/home/hotel/${this.hotelId}/reservations`, icon: ReservationsIcon, isActive: false},
          {id: "rooms", label: "Rooms", path: `/home/hotel/${this.hotelId}/rooms`, icon: RoomsIcon, isActive: false}
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
    async addProvider({ name, email, phone, state, hotelId }) {
      if(!name || !email || !phone || !state) {
        alert("Todos los campos son obligatorios para crear un proveedor.");
        return;
      }

      const provider = new Provider(
          null,
          name,
          email,
          phone,
          state,
          this.hotelId
      );

      try {
        const responseProvider = await this.providerApi.createProvider(provider);
        this.providers.push(responseProvider?.data);
      } catch (error) {
        console.error("Error al crear provider:", error);
      }finally{
        this.showAddModal = false;
      }
    },

    openDeleteModal(providerId) {
      this.providerToDeleteId = providerId;
      this.showDeleteModal = true;
    },

    async confirmDelete(providerId) {
      try {
        await this.providerApi.deleteProvider(providerId);
        this.providers = this.providers.filter(p => p.id !== providerId);
      } catch (error) {
        console.error("Error al eliminar proveedor:", error);
        alert("No se pudo eliminar el proveedor.");
      } finally {
        this.showDeleteModal = false;
        this.providerToDeleteId = null;
      }
    },

    viewDetails(provider, index) {
      this.selectedProviderId = provider.id;
      this.selectedAvatar = `https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg`;
    }
  }
};
</script>

<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
  />
  
  <!-- Loading Spinner -->
  <div v-if="isLoading" class="loading-container">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p class="loading-text">Cargando...</p>
    </div>
  </div>

  <!-- Contenido principal -->
  <div v-else class="providers-page">
    <div class="providers-header">
      <div>
        <h1 class="hotel-title">{{ hotelName }}</h1>
        <h2 class="section-title">{{ i18n.global.t('providers.title')}}</h2>
      </div>
      <ButtonComponent
          :text="'Agregar proveedor'"
          state="primary"
          :onClick="() => { showAddModal = true }"
      />
    </div>
    <div class="provider-grid">
      <p v-if="providers.length === 0" class="no-providers-text">
        {{ i18n.global.t('providers.message')}}
      </p>
      <BasicCardComponent
          v-for="(provider, index) in providers"
          :key="provider.id"
          :title="provider.name"
      >
        <template #image>
          <img
              :src="`https://static.vecteezy.com/system/resources/previews/009/292/244/non_2x/default-avatar-icon-of-social-media-user-vector.jpg`"
              alt="Avatar"
              class="provider-image"
          />
        </template>

        <template #header-content>
          <p>{{ provider.email }}</p>
        </template>

        <template #default>
          <div class="button-row">
            <ButtonComponent
                :text="i18n.global.t('providers.delete')"
                state="basic"
                :onClick="() => openDeleteModal(provider.id)"
            />
            <ButtonComponent
                :text="i18n.global.t('providers.details')"
                state="primary"
                :onClick="() => viewDetails(provider, index)"
            />
          </div>
        </template>
      </BasicCardComponent>
    </div>
  </div>

  <ProviderDetailsComponent
      v-if="selectedProviderId !== null"
      :providerId="selectedProviderId"
      :image="selectedAvatar"
      @close="selectedProviderId = null"
  />

  <ProviderDeleteConfirmComponent
      v-if="showDeleteModal"
      :providerId="providerToDeleteId"
      @confirm="confirmDelete"
      @close="() => { showDeleteModal = false; providerToDeleteId = null; }"
  />

  <ProviderAddModalComponent
      v-if="showAddModal"
      :hotel-id="this.hotelId"
      @added="addProvider"
      @close="() => { showAddModal = false }"
  />
</template>

<style scoped>
/* Estilos para el loading spinner */
.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
  padding: 2rem;
}

.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  font-size: 1rem;
  color: #666;
  margin: 0;
}

/* Estilos existentes */
.providers-page {
  padding: 2rem;
}

.hotel-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--gray-light-color);
  font-weight: 400;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.provider-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 2rem;
}

.card .provider-image {
  display: block;
  margin: 0 auto;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
}

.card .card-header {
  text-align: center;
}

.card .card-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-top: 0.5rem;
}

.card .card-header-content {
  text-align: center;
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.25rem;
}

.button-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
  margin-top: 1rem;
}

.no-providers-text {
  text-align: center;
  font-size: 1rem;
  color: #888;
  margin-top: 2rem;
}

.providers-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
</style>
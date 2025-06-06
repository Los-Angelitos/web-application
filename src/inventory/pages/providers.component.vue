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
import i18n from "../../i18n.js";

export default {
  name: "ProvidersPage",
  components: {
    MainPageNavigation,
    BasicCardComponent,
    ButtonComponent,
    ProviderDetailsComponent,
    ProviderDeleteConfirmComponent
  },
  data() {
    return {
      hotelId: 11,
      hotel: null,
      hotelApi: new HotelsApiService(),
      providers: [],
      providerApi: new ProviderApiService(),
      selectedProvider: null,
      selectedAvatar: '',
      navigationItems: [
        {id: "overview", label: "Overview", path: "/home/hotel/1/overview", icon: OverviewIcon, isActive: false},
        {id: "analytics", label: "Analytics", path: "/home/hotel/1/analytics", icon: AnalyticsIcon, isActive: false},
        {id: "providers", label: "Providers", path: "/home/hotel/1/providers", icon: ProvidersIcon, isActive: true},
        {id: "inventory", label: "Inventory", path: "/home/hotel/1/inventory", icon: InventoryIcon, isActive: false},
        {id: "rooms", label: "Rooms", path: "/home/hotel/1/rooms", icon: RoomsIcon, isActive: false},
        {id: "organization", label: "Organization", path: "/home/hotel/1/organization", icon: OrganizationIcon, isActive: false},
        {id: "devices", label: "Devices", path: "/home/hotel/1/set-up/devices", icon: DevicesIcon, isActive: false}
      ],
      selectedProviderId: null,
      showDeleteModal: false,
      providerToDeleteId: null
    };
  },
  async created() {
    try {
      const res = await this.providerApi.getProviders();
      console.log(res);
      this.providers = res.data
          .filter(p => p.state === "active")
          .map(p => Provider.fromDisplayableProvider(p));
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }

    try {
      const res = await this.hotelApi.getHotelsById(this.hotelId);
      this.hotel = Hotel.fromDisplayableHotel(res);
    } catch (error) {
      console.error("Error al obtener hotel:", error);
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
      this.selectedAvatar = `https://i.pravatar.cc/150?img=${index + 1}`;
    }
  }
};
</script>

<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
  />
  <div class="providers-page">
    <h1 class="hotel-title">{{ hotelName }}</h1>
    <h2 class="section-title">{{ i18n.global.t('providers.title')}}</h2>

    <div class="provider-grid">
      <BasicCardComponent
          v-for="(provider, index) in providers"
          :key="provider.id"
          :title="provider.name"
      >
        <template #image>
          <img
              :src="`https://i.pravatar.cc/150?img=${index + 1}`"
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
</template>

<style scoped>
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


</style>
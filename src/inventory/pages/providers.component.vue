<script>
import BasicCardComponent from "../../shared/components/basic-card.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";
import { ProviderApiService } from "../services/provider-api.service.js";
import { Provider } from "../model/provider.entity.js";
import {HotelsApiService} from "../../shared/services/hotels-api.service.js";
import {Hotel} from "../../shared/model/hotel.entity.js";
import ProviderDetailsComponent from "../components/provider-details.component.vue";

export default {
  name: "ProvidersPage",
  components: {
    BasicCardComponent,
    ButtonComponent,
    ProviderDetailsComponent
  },
  data() {
    return {
      hotelId: 3,
      hotel: null,
      hotelApi: new HotelsApiService(),
      providers: [],
      providerApi: new ProviderApiService(),
      selectedProvider: null,
      selectedAvatar: '',
      selectedProviderId: null,
    };
  },
  async created() {
    try {
      const res = await this.providerApi.getProviders();
      this.providers = res.data.map((p) => Provider.fromDisplayableProvider(p));
    } catch (error) {
      console.error("Error al obtener los proveedores:", error);
    }

    try {
      const res = await this.hotelApi.getHotelsById(this.hotelId);
      this.hotel = Hotel.fromDisplayableHotel(res.data);
    } catch (error) {
      console.error("Error al obtener hotel:", error);
    }
  },
  computed: {
    hotelName() {
      return this.hotel?.name ?? "Hotel Name Not Found";
    }
  },
  methods: {
    async deleteProvider(index) {
      const provider = this.providers[index];
      if (!provider?.id) return;

      try {
        await this.providerApi.deleteProvider(provider.id);
        this.providers.splice(index, 1);
      } catch (error) {
        console.error(`Error al eliminar al proveedor ${provider.name}:`, error);
        alert("No se pudo eliminar el proveedor.");
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
  <div class="providers-page">
    <h1 class="hotel-title">{{ hotelName }}</h1>
    <h2 class="section-title">Providers</h2>

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
                text="Delete"
                state="basic"
                :onClick="() => deleteProvider(index)"
            />
            <ButtonComponent
                text="Details"
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

</template>

<style scoped>
.providers-page {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.hotel-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
}

.button-container {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.provider-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 por fila */
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
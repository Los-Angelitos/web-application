<script>
import { SupplierApiService } from "../services/supply-api.service.js";
import { Supply } from "../model/supply.entity.js";
import { ProviderApiService } from "../services/provider-api.service.js";
import { Provider } from "../model/provider.entity.js";
import { HotelsApiService } from "../../shared/services/hotels-api.service.js";
import { Hotel } from "../../shared/model/hotel.entity.js";
import ButtonComponent from "../../shared/components/button.component.vue";
import SupplyDeleteConfirmComponent from "../components/supply-delete.component.vue";
import SupplyAddComponent from "../components/supply-add.component.vue";
import MainPageNavigation from "../../organizational-management/components/main-page-navigation.component.vue";
import OverviewIcon from "../../assets/organizational-management/overview-icon.svg";
import AnalyticsIcon from "../../assets/organizational-management/analytics-icon.svg";
import ProvidersIcon from "../../assets/organizational-management/providers-icon.svg";
import InventoryIcon from "../../assets/organizational-management/inventory-icon.svg";
import RoomsIcon from "../../assets/organizational-management/rooms-icon.svg";
import OrganizationIcon from "../../assets/organizational-management/organization-icon.svg";
import DevicesIcon from "../../assets/organizational-management/devices-icon.svg";
import i18n from "../../i18n.js";
import { useAuthenticationStore } from '/src/iam/services/authentication.store.js';
const userId = useAuthenticationStore.state.userId;


export default {
  name: "InventoryPage",
  components: {
    ButtonComponent,
    SupplyDeleteConfirmComponent,
    SupplyAddComponent,
    MainPageNavigation
  },
  data() {
    return {
      hotelId: null,
      hotelName: null,
      userId: userId,
      supplies: [],
      providers: [],
      supplierApi: new SupplierApiService(),
      providerApi: new ProviderApiService(),
      hotelApi: new HotelsApiService(),
      selectedSupplies: [],
      showDeleteModal: false,
      navigationItems: [
        {id: "overview", label: "Overview", path: "/home/hotel/1/overview", icon: OverviewIcon, isActive: false},
        {id: "analytics", label: "Analytics", path: "/home/hotel/1/analytics", icon: AnalyticsIcon, isActive: false},
        {id: "providers", label: "Providers", path: "/home/hotel/1/providers", icon: ProvidersIcon, isActive: false},
        {id: "inventory", label: "Inventory", path: "/home/hotel/1/inventory", icon: InventoryIcon, isActive: true},
        {id: "rooms", label: "Rooms", path: "/home/hotel/1/rooms", icon: RoomsIcon, isActive: false},
        {id: "organization", label: "Organization", path: "/home/hotel/1/organization", icon: OrganizationIcon, isActive: false},
        {id: "devices", label: "Devices", path: "/home/hotel/1/set-up/devices", icon: DevicesIcon, isActive: false}
      ],
      showCreateModal: false
    };
  },
  async created() {
    try {
      // Fetch hotel by owner ID
      const hotel = await HotelsApiService.getHotelByOwnerId(this.userId);
      if (hotel && hotel.id) {
        this.hotelId = hotel.id;
        this.hotelName = hotel.name;
      } else {
        console.error("No hotel found for the user or missing hotel ID.");
        return;
      }
      // Fetch supplies
      this.supplies = await this.supplierApi.getSupplies(this.hotelId);
      console.log("Supplies loaded successfully.");

      // Fetch providers
      this.providers = await this.providerApi.getProviders(this.hotelId);
      console.log("Providers loaded successfully.");

    } catch (error) {
      console.error("Error during initialization:", error);
    }
  },
  methods: {
    getProviderName(providerId) {
      const provider = this.providers.find(p => p.id === providerId);
      return provider ? provider.name : "Unknown";
    },
    toggleSelectAll(event) {
      if (event.target.checked) {
        this.selectedSupplies = this.supplies.map(s => s.id);
      } else {
        this.selectedSupplies = [];
      }
    },
    async confirmDelete() {
      try {
        const updates = this.selectedSupplies.map(async (id) => {
          const supply = this.supplies.find(s => s.id === id);
          if (supply) {
            supply.state = "INACTIVE";
            await this.supplierApi.updateSupply(supply.id, supply);
          }
        });

        await Promise.all(updates);

        this.supplies = this.supplies.filter(s => !this.selectedSupplies.includes(s.id));
        this.selectedSupplies = [];

      } catch (error) {
        console.error("Error al actualizar supplies:", error);
        alert("No se pudo eliminar uno o más supplies.");
      } finally {
        this.showDeleteModal = false;
      }
    },
    async handleCreated({ name, price, stock }) {
      const supply = new Supply(
          0,
          this.providers[0]?.id ?? 1,
          this.hotelId,
          name,
          price,
          stock,
          "ACTIVE"
      );

      try {
        await this.supplierApi.createSupply(supply);
        this.supplies.push(supply);
        this.showCreateModal = false;
      } catch (error) {
        console.error("Error al crear supply:", error);
        alert("No se pudo crear el supply.");
      }
    }
  },
  computed: {
    i18n() {
      return i18n
    },
    allSelected() {
      return this.selectedSupplies.length === this.supplies.length;
    }
  }
};
</script>

<template>
  <MainPageNavigation
      :navigationItems="navigationItems"
  />
  <div class="inventory-page">
    <h1 class="hotel-title">{{this.hotelName}}</h1>
    <h2 class="section-title">{{ i18n.global.t('inventory.title')}}</h2>
    <div class="inventory-actions">
      <ButtonComponent
          :text="i18n.global.t('inventory.delete')"
          state="basic"
          :onClick="() => showDeleteModal = true"
      />
      <ButtonComponent
          :text="i18n.global.t('inventory.add')"
          state="primary"
          :onClick="() => showCreateModal = true"
      />
    </div>
    <table class="inventory-table">
      <thead>
      <tr>
        <th>
          <input
              type="checkbox"
              @change="toggleSelectAll($event)"
              :checked="allSelected"
          />
        </th>
        <th>{{ i18n.global.t('inventory.info.id')}}</th>
        <th>{{ i18n.global.t('inventory.info.name')}}</th>
        <th>{{ i18n.global.t('inventory.info.price')}}</th>
        <th>{{ i18n.global.t('inventory.info.quantity')}}</th>
        <th>{{ i18n.global.t('inventory.info.stock')}}</th>
        <th>{{ i18n.global.t('inventory.info.provider')}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="supply in supplies" :key="supply.id">
        <td>
          <input
              type="checkbox"
              :value="supply.id"
              v-model="selectedSupplies"
          />
        </td>
        <td>{{ supply.id.toString().padStart(5, '0') }}</td>
        <td>{{ supply.name }}</td>
        <td>S/ {{ supply.price.toFixed(2) }} per unit</td>
        <td>{{ supply.stock }}</td>
        <td>
            <span
                :class="['stock-btn', supply.stock === 0 ? 'yes' : 'no']"
            >
              {{ supply.stock === 0 ? 'Yes' : 'No' }}
            </span>
        </td>
        <td>{{ getProviderName(supply.providerId) }}</td>
      </tr>
      </tbody>
    </table>
    <SupplyDeleteConfirmComponent
        v-if="showDeleteModal"
        @confirm="confirmDelete"
        @close="showDeleteModal = false"
    />
    <SupplyAddComponent
        v-if="showCreateModal"
        :hotelId="hotelId"
        :providerId="providers[0]?.id ?? 1"
    @close="showCreateModal = false"
    @created="handleCreated"
    />
  </div>
</template>

<style scoped>
.inventory-page {
  padding: 2rem;
  font-family: 'Segoe UI', sans-serif;
}

.hotel-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 1.2rem;
  margin-bottom: 1.5rem;
  color: var(--gray-light-color);
  font-weight: 400;
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.95rem;
}

.inventory-table th,
.inventory-table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.inventory-table th {
  font-weight: 600;
  color: #333;
}

.stock-btn {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  display: inline-block;
  min-width: 45px;
}

.stock-btn.yes {
  background-color: #f7c6c6;
  color: #a10000;
}

.stock-btn.no {
  background-color: #e7f1ff;
  color: #004080;
}

.inventory-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
</style>

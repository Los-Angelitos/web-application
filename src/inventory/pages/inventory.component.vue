<script>
import { SupplierApiService } from "../services/supply-api.service.js";
import { Supply } from "../model/supply.entity.js";
import { ProviderApiService } from "../services/provider-api.service.js";
import { Provider } from "../model/provider.entity.js";
import { HotelsApiService } from "../../shared/services/hotels-api.service.js";
import { Hotel } from "../../shared/model/hotel.entity.js";
import ButtonComponent from "../../shared/components/button.component.vue";
import SupplyDeleteConfirmComponent from "../components/supply-delete.component.vue";


export default {
  name: "InventoryPage",
  components: {
    ButtonComponent,
    SupplyDeleteConfirmComponent
  },
  data() {
    return {
      hotelId: 3,
      supplies: [],
      providers: [],
      supplierApi: new SupplierApiService(),
      providerApi: new ProviderApiService(),
      hotel: null,
      hotelApi: new HotelsApiService(),
      selectedSupplies: [],
      showDeleteModal: false,
    };
  },
  async created() {
    try {
      const res = await this.supplierApi.getSupplies(this.hotelId);
      this.supplies = res.data.map(s => Supply.fromDisplayableSupply(s));
    } catch (error) {
      console.error("Error al obtener supplies:", error);
    }

    try {
      const res = await this.providerApi.getProviders();
      this.providers = res.data.map(p => Provider.fromDisplayableProvider(p));
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }

    try {
      const res = await this.hotelApi.getHotelsById(this.hotelId);
      this.hotel = Hotel.fromDisplayableHotel(res.data);
    } catch (error) {
      console.error("Error al obtener hotel:", error);
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
    }
  },
  computed: {
    allSelected() {
      return this.selectedSupplies.length === this.supplies.length;
    }
  }
};
</script>

<template>
  <div class="inventory-page">
    <h1 class="hotel-title">{{ hotel?.name ?? 'Hotel Name Not Found' }}</h1>
    <h2 class="section-title">Inventory</h2>
    <div class="inventory-actions">
      <ButtonComponent
          text="Delete"
          state="basic"
          :onClick="() => showDeleteModal = true"
      />
      <ButtonComponent
          text="Add"
          state="primary"
          :onClick="() => console.log('Add new supply')"
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
        <th>ID</th>
        <th>Name</th>
        <th>Price</th>
        <th>Quantity</th>
        <th>Stock</th>
        <th>Provider</th>
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

<script>
import { ProviderApiService } from "../services/provider-api.service.js";
import { Provider } from "../model/provider.entity.js";
import i18n from "../../i18n.js";

export default {
  name: "ProviderDetailsComponent",
  props: {
    providerId: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      default: ''
    }
  },
  emits: ["close"],
  data() {
    return {
      provider: null,
      providerApi: new ProviderApiService()
    };
  },
  async created() {
    try {
      const res = await this.providerApi.getProviderById(this.providerId);
      this.provider = res.data;
    } catch (error) {
      console.error("Error fetching provider:", error);
    }
  },
  computed: {
    i18n() {
      return i18n
    }
  },
  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>

<template>
  <div class="modal-overlay" >
    <div class="modal-card" v-if="provider">
      <img
          :src="image"
          class="avatar"
          alt="Provider avatar"
      />
      <h2>{{ provider.name }}</h2>
      <p class="phone">{{ provider.phone }}</p>
      <p class="email">{{ provider.email }}</p>
      <button class="close-btn" @click="close">{{ i18n.global.t('providers.detailsButton.close')}}</button>
    </div>
    <div v-else class="modal-card">{{ i18n.global.t('providers.detailsButton.loading')}}</div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 280px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.avatar {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 1rem;
}

.phone, .email {
  margin: 0.25rem 0;
  font-size: 0.95rem;
  color: #444;
}

.close-btn {
  margin-top: 1.5rem;
  padding: 0.5rem 1.25rem;
  border: 1px solid #ccc;
  background-color: white;
  cursor: pointer;
  font-weight: 500;
  border-radius: 6px;
}

.close-btn:hover {
  background-color: #f2f2f2;
}
</style>

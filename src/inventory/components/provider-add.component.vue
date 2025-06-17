<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-icon">➕</div>
      <h3 class="modal-title">{{ i18n.global.t('providers.addButton.title') }}</h3>
      <div class="modal-form">
        <input
            v-model="form.name"
            type="text"
            :placeholder="i18n.global.t('providers.addButton.name')"
        />
        <input
            v-model="form.email"
            type="email"
            :placeholder="i18n.global.t('providers.addButton.email')"
        />
        <input
            v-model="form.phone"
            type="text"
            :placeholder="i18n.global.t('providers.addButton.phone')"
        />
      </div>
      <div class="modal-actions">
        <button class="btn cancel" @click="close">
          {{ i18n.global.t('providers.addButton.cancel') }}
        </button>
        <button class="btn add" @click="submit">
          {{ i18n.global.t('providers.addButton.add') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import i18n from "../../i18n.js";

export default {
  name: "ProviderAddModalComponent",
  props: {
    hotelId: {
      type: Number,
      required: true,
    },
  },
  emits: ["added", "close"],
  computed: {
    i18n() {
      return i18n;
    },
    canCreate() {
      return this.name && this.email && this.phone;
    }
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        phone: ''
      }
    };
  },
  methods: {
    submit() {
      try {
        this.$emit("added", {
          name: this.form.name,
          email: this.form.email,
          phone: this.form.phone,
          state: "active",
          hotelId: this.hotelId
        });
      } catch (e) {
        console.error("Error al agregar proveedor:", e);
        alert(this.i18n.global.t('providers.addButton.error'));
      }
    },
    close() {
      this.$emit("close");
    }
  }
};
</script>

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
  z-index: 999;
}

.modal-card {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 340px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  text-align: center;
}

.modal-icon {
  font-size: 2.5rem;
  color: #0066cc;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.modal-form input {
  display: block;
  width: 100%;
  margin-bottom: 1rem;
  padding: 0.5rem;
  font-size: 0.95rem;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.modal-actions {
  display: flex;
  justify-content: space-between;
}

.btn {
  padding: 0.5rem 1.25rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  border: 1px solid #ccc;
}

.btn.cancel {
  background-color: white;
}

.btn.add {
  background-color: #28a745;
  color: white;
  border-color: #28a745;
}
</style>

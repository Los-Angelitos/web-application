<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-icon">📦</div>
      <h3 class="modal-title">New Product</h3>

      <div class="form-group">
        <label>Product's name</label>
        <input v-model="name" type="text" placeholder="E.g., Shampoo" />
      </div>

      <div class="form-group">
        <label>Price</label>
        <input v-model.number="price" type="number" placeholder="E.g., 19.90" />
      </div>

      <div class="form-group">
        <label>Actual Quantity</label>
        <input v-model.number="stock" type="number" placeholder="E.g., 10" />
      </div>

      <div class="modal-actions">
        <button class="btn cancel" @click="close">Cancel</button>
        <button class="btn add" @click="create" :disabled="!canCreate">Add</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SupplyAddComponent",
  props: {
    hotelId: Number,
    providerId: Number
  },
  emits: ["close", "created"],
  data() {
    return {
      name: "",
      price: null,
      stock: null
    };
  },
  computed: {
    canCreate() {
      return this.name && this.price > 0 && this.stock >= 0;
    }
  },
  methods: {
    create() {
      this.$emit("created", {
        name: this.name,
        price: this.price,
        stock: this.stock
      });
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
  width: 320px;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.modal-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  font-size: 0.85rem;
  margin-bottom: 0.25rem;
  color: #444;
}

.form-group input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
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
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}
</style>

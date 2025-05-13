<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <div class="modal-icon">❌</div>
      <h3 class="modal-title">Are you sure?</h3>
      <p class="modal-text">
        The selected items will be removed from inventory.
      </p>
      <div class="modal-actions">
        <button class="btn cancel" @click="close">Close</button>
        <button class="btn delete" @click="confirm">Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SupplyDeleteComponent",
  emits: ["confirm", "close"],
  methods: {
    confirm() {
      this.$emit("confirm");
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
  color: #cc0000;
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.modal-text {
  font-size: 0.95rem;
  color: #444;
  margin-bottom: 1.5rem;
}

.modal-actions {
  display: flex;
  justify-content: center;
  gap: 1rem;
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

.btn.delete {
  background-color: #0066cc;
  color: white;
  border-color: #0066cc;
}
</style>

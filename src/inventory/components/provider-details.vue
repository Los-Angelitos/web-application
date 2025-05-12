<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-card">
      <img
          :src="image"
          class="avatar"
          alt="Provider avatar"
      />
      <h2>{{ provider.name }}</h2>
      <p class="phone">{{ provider.phone }}</p>
      <p class="email">{{ provider.email }}</p>
      <button class="close-btn" @click="close">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProviderDetailsComponent",
  props: {
    provider: Object,
    image: String
  },
  emits: ['close'],
  methods: {
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

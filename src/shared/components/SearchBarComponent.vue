<template>
  <div class="searchbar-container">
    <div class="searchbar">
      <input
          type="text"
          :placeholder="placeholder"
          v-model="searchQuery"
          @keyup.enter="performSearch"
          class="search-input"
      />
      <button icon="pi pi-search" class="search-button" @click="performSearch">
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    placeholder: {
      type: String,
      default: '¿Cuál es tu siguiente destino?'
    }
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  methods: {
    performSearch() {
      if (this.searchQuery.trim()) {
        this.$emit('search', this.searchQuery);
        // Optional: Navigate to search results page
        // this.$router.push({ name: 'search-results', query: { q: this.searchQuery } });
      }
    },
    clearSearch() {
      this.searchQuery = '';
    }
  }
}
</script>

<style scoped>
.searchbar-container {
  width: 100%;
  max-width: 850px;
  margin: 0 auto;
  padding: 0 15px;
}

.searchbar {
  display: flex;
  position: relative;
  width: 100%;
  border-radius: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  background-color: #ffffff;
  border: 1px solid #e0e0e0;
}

.search-input {
  flex: 1;
  padding: 15px 20px;
  font-size: 1rem;
  border: none;
  outline: none;
  color: #333;
  background: transparent;
  width: calc(100% - 60px);
}

.search-input::placeholder {
  color: #555;
}

.search-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 50px;
  background-color: #0066cc;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.search-button:hover {
  background-color: #0055b3;
}

.search-button i {
  color: white;
  font-size: 18px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .searchbar {
    border-radius: 24px;
  }

  .search-input {
    padding: 12px 16px;
    font-size: 0.95rem;
  }

  .search-button {
    width: 50px;
    height: 46px;
  }
}
</style>
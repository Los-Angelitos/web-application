<template>
  <div class="language-selector">
    <button
        v-for="lang in languages"
        :key="lang"
        :class="{ active: currentLanguage === lang }"
        @click="changeLanguage(lang)"
        class="lang-btn"
    >
      {{ lang }}
    </button>
  </div>
</template>
<script>
export default {
  name: 'LanguageSwitcher',
  data() {
    return {
      currentLanguage: 'EN', // Default language
      languages: [
        'EN','ES'
      ]
    };
  },
  methods: {
    changeLanguage(langCode) {
      this.currentLanguage = langCode;
      this.$i18n.locale = langCode.toLowerCase();
      localStorage.setItem('userLanguage', langCode.toLowerCase());
      if (window.innerWidth <= 768) {
        this.showMobileMenu = false;
      }
    },
  },
}
</script>
<style scoped>
  .language-selector {
    margin-right: 2rem;
  }

  .language-selector {
    margin-right: 2rem;
  }

  .lang-btn {
    background: none;
    border: none;
    padding: 0.3rem 0.6rem;
    cursor: pointer;
    color: #666;
    font-weight: 500;
    transition: all 0.2s;
  }

  .lang-btn.active {
    font-weight: 700;
    color: #0066cc;
    border-bottom: 2px solid #0066cc;
  }
</style>
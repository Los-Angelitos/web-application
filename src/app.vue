<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import TopBarComponent from './shared/components/top-bar.component.vue';

const route = useRoute();

const hideTopBar = computed(() =>
  ['/auth/sign-in', '/auth/sign-up'].includes(route.path)
);
</script>

<template>
  <div>
    <TopBarComponent v-if="!hideTopBar" />
    <router-view />
  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

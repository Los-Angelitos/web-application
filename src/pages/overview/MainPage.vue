<script>
import TopBarComponent from "../../shared/components/TopBarComponent.vue";
import SearchBar from "../../shared/components/SearchBarComponent.vue";

export default {
    name: "MainPage",
  components: {SearchBar, TopBarComponent}
}
</script>

<template>
  <TopBarComponent />
  <SearchBar />
</template>

<style scoped>
</style>
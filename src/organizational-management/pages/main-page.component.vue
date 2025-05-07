<script>
import TopBarComponent from "../../shared/components/top-bar.component.vue";
import SearchBar from "../../shared/components/search-bar.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";

export default {
    name: "MainPage",
  components: {ButtonComponent, SearchBar, TopBarComponent},
  methods: {
      handleButton() {
        console.log("Hello!");
      }
  }
}
</script>

<template>
  <TopBarComponent />
  <SearchBar />
  <ButtonComponent text="Hola" state="primary" @click="handleButton"/>
</template>

<style scoped>
</style>
<script>
import TopBarComponent from "../../shared/components/TopBarComponent.vue";
import SearchBar from "../../shared/components/SearchBarComponent.vue";
import ButtonComponent from "../../shared/components/ButtonComponent.vue";

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
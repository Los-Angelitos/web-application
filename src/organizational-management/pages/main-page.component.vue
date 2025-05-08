<script>
import TopBarComponent from "../../shared/components/top-bar.component.vue";
import SearchBar from "../../shared/components/search-bar.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";
import ModalComponent from "../../shared/components/modal.component.vue";

export default {
    name: "MainPage",
  components: {ButtonComponent, SearchBar, TopBarComponent, ModalComponent},
  data() {
    return {
      showModal: true,
    };
  },
  methods: {
      handleButton() {
        console.log("Hello!");
      },

  }
}
</script>

<template>
  <TopBarComponent />
  <SearchBar />
  <ButtonComponent text="Hola" state="primary" @click="handleButton"/>

  <ModalComponent v-model="showModal" title="Hello World" :showCloseButton="true" :closeOnOverlayClick="true" :width="'500px'" :height="'auto'" :backgroundColor="'#ffffff'">
    <template #header>
      <h1>Header</h1>
    </template>
    <template #body>
      <p>This is the body of the modal.</p>
    </template>
    <template #footer>
      <button class="btn primary" @click="saveUser">Guardar</button>
    </template>

  </ModalComponent>


</template>

<style scoped>
</style>
<script>
import TopBarComponent from "../../shared/components/top-bar.component.vue";
import SearchBar from "../../shared/components/search-bar.component.vue";
import ButtonComponent from "../../shared/components/button.component.vue";
import ModalComponent from "../../shared/components/modal.component.vue";
import MainPageNavigation from "../components/main-page-navigation.component.vue";
import HotelGallery from "../components/hotel-gallery.component.vue";

export default {
    name: "MainPage",
  components: {ButtonComponent, SearchBar, TopBarComponent, ModalComponent, MainPageNavigation, HotelGallery},
  data() {
    return {
      showModal: true
    };
  },
  methods: {
      handleButton() {
        console.log("Hello!");
      },
      onCategoryChanged(category) {
      console.log('Category changed to:', category);
    }

  }
}
</script>

<template>
  <SearchBar />
  <MainPageNavigation @category-changed="onCategoryChanged"/>
  <HotelGallery ref="hotelGallery"/>
</template>

<style scoped>
</style>
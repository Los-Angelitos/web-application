<script>
import BreadCrumb from "../../shared/components/breadcrumb.component.vue";
import userMock from "../../mocks/iam/user-profile-account.json";

export default {
    name: "MyReservationsPage",
    components: {
        BreadCrumb
    },
    data() {
      return {
        userData: null,
        breadcrumbPath: [
          { name: "Account", route: "" },
          { name: "My Reservations", route: "" },
        ]
      }
    },
    mounted() {
      this.fetchUserData();
    },
    methods: {
      fetchUserData() {
        setTimeout(() => {
          this.userData = userMock;
          console.log("User data fetched:", this.userData);

          this.breadcrumbPath[0].route = `/home/profile/${this.userData.id}`;
          this.breadcrumbPath[1].route = `/home/profile/${this.userData.id}/reservations`;
        }, 300);
      }
    }
}
</script>

<template>
  <div>
    <BreadCrumb :path="breadcrumbPath" />
    <h1>My reservations Page</h1>
  </div>
</template>

<style scoped>
</style>
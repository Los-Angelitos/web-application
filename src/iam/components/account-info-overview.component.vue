<script>
export default {
    name: "AccountInfoOverview",

    props: {
        username: {
            type: String,
            required: true
        },
        userType: {
            type: String,
            required: true
        },
    },
    methods: {
        discoverTypeOfUser() {
        switch(this.userType) {
          case "guest":
            return "Guest";
          case "admin":
            return "Administrator";
          case "owner":
            return "Chief Owner";
          default:
            return "Unknown Type";
        }
      },
    }
}
</script>

<template>
    <div v-if="username && userType" class="account-overview">
        <div class="account-info">
        <h2>{{ username }}</h2>
        <p>{{ discoverTypeOfUser() }}</p>
        </div>
    </div>
</template> 

<style scoped>
.account-overview {
  display: flex;
  align-items: center;
}

.account-info h2 {
  font-size: 2rem;
  font-weight: 400;
}

.account-info p {
  font-size: 1.2rem;
  color: var(--gray-light-color);
}


</style>
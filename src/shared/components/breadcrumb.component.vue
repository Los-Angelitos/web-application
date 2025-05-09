<script>
export default {
    name: "BreadCrumb",
    props: {
        path: {
            type: Array,
            required: true,
            // format: [{name: "Home", route: "/home"}, {name: "Settings", route: "/settings"}]
        }
    },
    methods: {
        navigateTo(crumb) {
            this.$router.push(crumb.route);
        }
    }
}
</script>

<template>
    <nav class="breadcrumb-container">
        <span
        v-for="(crumb, index) in path"
        :key="index"
        class="breadcrumb-item"
        >
        <span
            v-if="index !== path.length - 1"
            @click="navigateTo(crumb)"
            class="breadcrumb-link"
        >
            {{ crumb.name }}
        </span>
        <span v-else class="breadcrumb-current">{{ crumb.name }}</span>
        <span v-if="index !== path.length - 1"> &gt; </span>
        </span>
    </nav>
</template>

<style scoped>
.breadcrumb-container {
  margin: 1rem 0;
  font-size: 0.85rem;
  color: #000;
  font-weight: 400;
}

.breadcrumb-item {
  display: inline;
}

.breadcrumb-link {
  cursor: pointer;
}

.breadcrumb-current {
  font-weight: bold;
}
</style>

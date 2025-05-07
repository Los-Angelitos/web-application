<!--
import BasicCardComponent from "../../shared/components/BasicCardComponent.vue";

export default {
    name: "MainPage",
    components: {
        BasicCardComponent
    }
}
Use:

<BasicCardComponent title="Main Page Card">
    <template #image>
    <img src="https://via.placeholder.com/150" alt="Placeholder Image" />
    </template>
    <template #header-content>
    <h2>Card Header</h2>
    </template>
    <p>This is a card component used in the main page.</p>
    <p>It can contain images, headers, and other content.</p>
</BasicCardComponent>

-->

<script>
export default {
    name: "BasicCardComponent",
    props: {
        title: {
            type: String,
            required: true
        }
    }
}
</script>

<template>
    <div class="card">
        <div class="card-image">
            <slot name="image"></slot>
        </div>
        <div class="card-header">
            <h3>{{ title }}</h3>
            <div class="card-header-content">
                <slot name="header-content"></slot>
            </div>
        </div>
        <div class="card-body">
            <slot></slot>
        </div>
    </div>
</template>

<style scoped>
.card {
    border: 1px solid #ccc;
    border-radius: 15px;
    padding: 10px;
    margin: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    width: max-content;
}

.card-header {
    padding: 10px;
    text-align: center;
    color: #000;
}

.card-header-content {
    font-size: .8rem;
    font-weight: 400;
    color: var(--gray-color);
    margin-top: 5px;
}

.card-body {
    padding: 10px;
}

</style>
<script>
export default {
    name: "TextAreaEmail",
    data() {
        return {
            emailContent: ""
        }
    },
}
</script>

<template>
    <div class="text-area-email">
        <textarea
            v-model="emailContent"
            placeholder="Write your email here..."
            rows="10"
            cols="50"
        ></textarea>
    </div>
</template>

<style scoped>
.text-area-email textarea {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    padding: 10px;
    font-size: 1rem;
    color: var(--gray-color);
    border: none;
}

.text-area-email textarea:focus {
    outline: none;
    border: none;
}

</style>
<script>
export default {
  name: "TextAreaEmail",
  props: {
    emailContent: {
      type: String,
      default: ""
    }
  },
  emits: ["update:emailContent"]
}
</script>

<template>
  <div class="text-area-email">
    <textarea
      :value="emailContent"
      @input="$emit('update:emailContent', $event.target.value)"
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
  resize: none;
}
.text-area-email textarea:focus {
  outline: none;
  border: none;
}
</style>

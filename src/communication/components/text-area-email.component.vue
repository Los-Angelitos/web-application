<script>
import i18n from '../../i18n.js';

export default {
  name: "TextAreaEmail",
  props: {
    emailContent: {
      type: String,
      default: ""
    }
  },
  computed: {
    i18n() {
      return i18n
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
      :placeholder="i18n.global.t('notifications.form-email-item.message')"
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
